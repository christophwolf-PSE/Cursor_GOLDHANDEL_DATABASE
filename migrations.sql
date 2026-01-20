-- Goldankauf Prozess-Management System
-- Supabase Migration SQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Deals (Geschäfte)
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_no TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL,
    route TEXT,
    commodity_type TEXT NOT NULL CHECK (commodity_type IN ('Doré', 'Hallmark')),
    hallmark_age_bucket TEXT CHECK (hallmark_age_bucket IN ('<=5 Jahre', '>5 Jahre')),
    offer_terms TEXT,
    lbma_discount_pct INTEGER NOT NULL DEFAULT 0,
    discount_participation JSONB,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'In Progress', 'On Hold', 'Completed', 'Cancelled (IMP)', 'Cancelled (Seller)', 'Cancelled (Buyer)', 'Aborted (IMP)', 'Aborted (Seller)', 'Aborted (Buyer)')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE deals ADD COLUMN IF NOT EXISTS discount_participation JSONB;

-- Parties (Parteien/Rollen)
CREATE TABLE IF NOT EXISTS parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('Seller', 'Buyer', 'Koras', 'IMP', 'Intermediary', 'Logistics', 'Assay', 'Customs')),
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal Contacts (Assignments)
CREATE TABLE IF NOT EXISTS deal_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    role TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank Accounts per Deal
CREATE TABLE IF NOT EXISTS deal_bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    iban TEXT,
    bic TEXT,
    account_holder TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Process Templates
CREATE TABLE IF NOT EXISTS process_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    version TEXT DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template Steps
CREATE TABLE IF NOT EXISTS template_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES process_templates(id) ON DELETE CASCADE,
    step_no INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    risk_notes TEXT,
    documents_required BOOLEAN DEFAULT FALSE,
    documents_json JSONB DEFAULT '[]'::jsonb,
    responsible_role TEXT NOT NULL,
    actions_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, step_no)
);

-- Deal Steps (instanziierte Schritte)
CREATE TABLE IF NOT EXISTS deal_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    step_no INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    risk_notes TEXT,
    documents_required BOOLEAN DEFAULT FALSE,
    documents_json JSONB DEFAULT '[]'::jsonb,
    responsible_role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Blocked', 'Done', 'Verified')),
    due_date DATE,
    done_at TIMESTAMP WITH TIME ZONE,
    done_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    verification_note TEXT,
    block_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(deal_id, step_no)
);

-- Step Dependencies
CREATE TABLE IF NOT EXISTS step_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    step_id UUID NOT NULL REFERENCES deal_steps(id) ON DELETE CASCADE,
    depends_on_step_id UUID NOT NULL REFERENCES deal_steps(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (step_id != depends_on_step_id)
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    step_id UUID REFERENCES deal_steps(id) ON DELETE SET NULL,
    doc_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT,
    version INTEGER DEFAULT 1,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risks
CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    step_id UUID REFERENCES deal_steps(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('AML', 'KYC', 'Zoll', 'Logistik', 'Qualität', 'Zahlung', 'Compliance')),
    description TEXT NOT NULL,
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
    probability INTEGER NOT NULL CHECK (probability BETWEEN 1 AND 5),
    mitigation TEXT,
    owner TEXT,
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Mitigated', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    actor UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    before_json JSONB,
    after_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_deal_no ON deals(deal_no);
CREATE INDEX IF NOT EXISTS idx_parties_deal_id ON parties(deal_id);
CREATE INDEX IF NOT EXISTS idx_contacts_full_name ON contacts(full_name);
CREATE INDEX IF NOT EXISTS idx_deal_steps_deal_id ON deal_steps(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_steps_status ON deal_steps(status);
CREATE INDEX IF NOT EXISTS idx_deal_contacts_deal_id ON deal_contacts(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_contacts_contact_id ON deal_contacts(contact_id);
CREATE INDEX IF NOT EXISTS idx_deal_bank_accounts_deal_id ON deal_bank_accounts(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_bank_accounts_contact_id ON deal_bank_accounts(contact_id);
CREATE INDEX IF NOT EXISTS idx_documents_deal_id ON documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_documents_step_id ON documents(step_id);
CREATE INDEX IF NOT EXISTS idx_risks_deal_id ON risks(deal_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_deal_id ON audit_log(deal_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deal_steps_updated_at BEFORE UPDATE ON deal_steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate next deal number
CREATE OR REPLACE FUNCTION generate_deal_no()
RETURNS TEXT AS $$
DECLARE
    last_no INTEGER;
    new_no TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(deal_no FROM 'G-(\d+)') AS INTEGER)), 0) INTO last_no
    FROM deals
    WHERE deal_no ~ '^G-\d+$';
    
    new_no := 'G-' || LPAD((last_no + 1)::TEXT, 4, '0');
    RETURN new_no;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policies: Users can read/write their own data and admins can access all
-- Note: Adjust these policies based on your actual requirements

-- Deals policies
CREATE POLICY "Users can view all deals" ON deals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create deals" ON deals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update deals" ON deals FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete deals" ON deals FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for other tables (simplified - adjust as needed)
CREATE POLICY "Users can manage parties" ON parties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage templates" ON process_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage template_steps" ON template_steps FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage deal_steps" ON deal_steps FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage step_dependencies" ON step_dependencies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage deal_contacts" ON deal_contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage deal_bank_accounts" ON deal_bank_accounts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage documents" ON documents
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can manage risks" ON risks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can view audit_log" ON audit_log FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can insert audit_log" ON audit_log FOR INSERT WITH CHECK (true);

-- ============================================
-- SEED DATA: Initial Process Template
-- ============================================

-- Insert default template
INSERT INTO process_templates (id, name, version) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Goldankauf Standard-Prozess', '1.0')
ON CONFLICT DO NOTHING;

-- Template Steps (Goldankauf Prozess)
INSERT INTO template_steps (template_id, step_no, title, description, risk_notes, documents_required, documents_json, responsible_role, actions_json) VALUES
('00000000-0000-0000-0000-000000000001', 1, 'Kontaktanbahnung Seller/Intermediaries', 
 'Erstkontakt mit Verkäufer oder Zwischenhändlern, Bedarfsermittlung, erste Verhandlungen', 
 'Risiko: Unbekannte Partner, fehlende Referenzen', 
 TRUE, 
 '["Kontaktnotizen", "Email-Korrespondenz", "Terminvereinbarung"]'::jsonb,
 'Koras',
 '["Kontakt aufnehmen", "Termin vereinbaren", "Bedarfsermittlung"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 2, 'Buyer-Placement', 
 'Identifikation und Platzierung des Endkäufers, Vertragsgrundlagen klären', 
 'Risiko: Fehlende Buyer-Verfügbarkeit', 
 TRUE,
 '["Buyer-Identifikation", "Letter of Intent"]'::jsonb,
 'Koras',
 '["Buyer identifizieren", "Platzierung bestätigen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 3, 'KYC/AML/Sanktions-/Embargoprüfung', 
 'Due Diligence: Know Your Customer, Anti-Money-Laundering, Sanktionslistenprüfung, Embargo-Check', 
 'Risiko: Hohes Compliance-Risiko bei fehlender Prüfung', 
 TRUE,
 '["KYC-Formular", "Ausweiskopie", "Firmenregisterauszug", "Sanktionsprüfung", "Embargo-Check"]'::jsonb,
 'Koras',
 '["KYC-Dokumente anfordern", "Prüfung durchführen", "Freigabe erteilen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 4, 'Chain-of-Custody Dokumentation', 
 'Nachweis der Besitzkette, Herkunftsnachweis, Transparenz der Lieferkette', 
 'Risiko: Unklare Herkunft, fehlende Dokumentation', 
 TRUE,
 '["Herkunftsnachweis", "Chain-of-Custody Dokument", "Mine/Quelle Dokumentation"]'::jsonb,
 'Koras',
 '["Dokumentation anfordern", "Prüfen", "Verifizieren"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 5, 'SPA-Erstellung/Signatur', 
 'Sales and Purchase Agreement erstellen, Vertragsentwurf, Signatur durch alle Parteien', 
 'Risiko: Unklare Vertragsbedingungen, fehlende Signatur', 
 TRUE,
 '["SPA-Entwurf", "Signierte SPA", "Anhänge"]'::jsonb,
 'Koras',
 '["SPA erstellen", "Zur Signatur vorlegen", "Signatur einholen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 6, 'Re-Identifizierung (nur bei Hallmark >5 Jahre)', 
 'Bei gestempeltem Tafelgold älter als 5 Jahre: Re-Identifizierung durch zertifizierten Assayer', 
 'Risiko: Alte Stempel können nicht mehr verifiziert werden', 
 TRUE,
 '["Re-Identifizierungsbericht", "Assayer-Zertifikat"]'::jsonb,
 'Assay',
 '["Assayer beauftragen", "Re-Identifizierung durchführen", "Bericht erhalten"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 7, 'Vorab-Dokumente 72h vor Versand', 
 'Alle Versanddokumente müssen 72 Stunden vor Versand vorliegen: Proforma Invoice, COO, Ownership, Packing List, Assay Report, AWB, Export Permit, Customs Declaration, Tax Receipt, Insurance, Free&Clear Declaration', 
 'Risiko: Verzögerung bei fehlenden Dokumenten, Zollprobleme', 
 TRUE,
 '["Proforma Invoice", "Certificate of Origin (COO)", "Ownership Dokument", "Packing List", "Assay Report", "Air Waybill (AWB)", "Export Permit", "Customs Declaration", "Tax Receipt", "Insurance", "Free&Clear Declaration"]'::jsonb,
 'Seller',
 '["Dokumente anfordern", "Prüfen", "72h-Frist überwachen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 8, 'Lufttransport (versichert, Zollversiegelung)', 
 'Organisation des Lufttransports mit Versicherung und Zollversiegelung', 
 'Risiko: Transportrisiko, Diebstahl, Beschädigung', 
 TRUE,
 '["Transportvertrag", "Versicherungspolice", "Zollversiegelungsnachweis", "Tracking-Information"]'::jsonb,
 'Logistics',
 '["Transport organisieren", "Versicherung abschließen", "Zollversiegelung anbringen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 9, 'Zollbereich Frankfurt/Main: Vorprüfung', 
 'Vorprüfung durch Zoll, Importbeauftragter, Aufschubkonto/EUSt-Handling', 
 'Risiko: Zollverzögerung, Steuerprobleme', 
 TRUE,
 '["Zollanmeldung", "Importbeauftragter Bestätigung", "EUSt-Handling Dokumente", "Aufschubkonto Nachweis"]'::jsonb,
 'Customs',
 '["Zollanmeldung vorbereiten", "Vorprüfung durchführen", "EUSt klären"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 10, 'Sicherheitslogistik', 
 'Sicherer Transport vom Flughafen nach Pforzheim mit bewaffnetem Sicherheitsdienst', 
 'Risiko: Sicherheitsrisiko, Diebstahl', 
 TRUE,
 '["Sicherheitslogistik-Vertrag", "Transportroute", "Sicherheitsbestätigung"]'::jsonb,
 'Logistics',
 '["Sicherheitslogistik organisieren", "Transport durchführen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 11, 'Ankunft Pforzheim: Annahmebestätigung', 
 'Annahme der Ware in Pforzheim, erste Sichtprüfung, Annahmebestätigung', 
 'Risiko: Beschädigung, Mengenabweichung', 
 TRUE,
 '["Annahmebestätigung", "Sichtprüfungsprotokoll", "Fotos"]'::jsonb,
 'Koras',
 '["Ware annehmen", "Sichtprüfung durchführen", "Annahmebestätigung ausstellen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 12, 'Fire Assay + optional Second Assay', 
 'Feuerprobe durch zertifiziertes Labor, optional zweite unabhängige Assay', 
 'Risiko: Qualitätsabweichung, Reinheitsprobleme', 
 TRUE,
 '["Fire Assay Report", "Second Assay Report (optional)", "Labor-Zertifikat"]'::jsonb,
 'Assay',
 '["Assay beauftragen", "Probe entnehmen", "Assay durchführen", "Bericht erhalten"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 13, 'Verbindlicher Assay Report', 
 'Finaler, verbindlicher Assay-Report als Grundlage für Preisfestlegung', 
 'Risiko: Abweichung von erwarteter Qualität', 
 TRUE,
 '["Verbindlicher Assay Report", "Qualitätszertifikat"]'::jsonb,
 'Assay',
 '["Report finalisieren", "Verbindlichkeit bestätigen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 14, 'Preisfestlegung (LBMA Fixing Bezug)', 
 'Preisfestlegung basierend auf LBMA Fixing und Assay-Ergebnissen', 
 'Risiko: Preisvolatilität, Marktrisiko', 
 TRUE,
 '["LBMA Fixing Referenz", "Preiskalkulation", "Preisbestätigung"]'::jsonb,
 'Koras',
 '["LBMA Fixing ermitteln", "Preis kalkulieren", "Preis bestätigen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 15, 'Zahlung innerhalb vertraglicher Frist', 
 'Zahlung an Verkäufer innerhalb der im SPA vereinbarten Frist', 
 'Risiko: Zahlungsverzug, Liquiditätsprobleme', 
 TRUE,
 '["Zahlungsbestätigung", "Bankbeleg", "Zahlungsnachweis"]'::jsonb,
 'Koras',
 '["Zahlung veranlassen", "Zahlung durchführen", "Nachweis dokumentieren"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 16, 'Ownership Transfer', 
 'Rechtlicher Eigentumsübergang dokumentieren', 
 'Risiko: Rechtliche Unklarheiten', 
 TRUE,
 '["Ownership Transfer Dokument", "Rechtliche Bestätigung"]'::jsonb,
 'Koras',
 '["Ownership Transfer dokumentieren", "Rechtlich bestätigen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 17, 'Raffination zu 999,9', 
 'Raffination des Goldes auf 999,9 Reinheit', 
 'Risiko: Raffinationsverluste, Qualitätsprobleme', 
 TRUE,
 '["Raffinationsauftrag", "Raffinationsbericht", "Qualitätszertifikat 999,9"]'::jsonb,
 'Koras',
 '["Raffinerie beauftragen", "Raffination durchführen", "Zertifikat erhalten"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 18, 'Lagerung/Abholung Buyer', 
 'Lagerung des raffinierten Goldes und Abholung durch Endkäufer', 
 'Risiko: Lagerrisiko, Abholungsverzögerung', 
 TRUE,
 '["Lagerbestätigung", "Abholungsbestätigung", "Endkunden-Dokumentation"]'::jsonb,
 'Koras',
 '["Lagerung organisieren", "Abholung koordinieren", "Dokumentation abschließen"]'::jsonb),

('00000000-0000-0000-0000-000000000001', 19, 'Abschlussdokumentation', 
 'Finale Dokumentation des gesamten Prozesses, Archivierung', 
 'Risiko: Unvollständige Dokumentation', 
 TRUE,
 '["Prozessabschlussbericht", "Finale Dokumentation", "Archivierung"]'::jsonb,
 'Koras',
 '["Dokumentation finalisieren", "Archivieren", "Abschluss bestätigen"]'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
-- Note: Storage buckets must be created via Supabase Dashboard or API
-- Bucket name: deal-documents
-- Public: false (private)
-- Allowed MIME types: application/pdf, image/jpeg, image/png, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
