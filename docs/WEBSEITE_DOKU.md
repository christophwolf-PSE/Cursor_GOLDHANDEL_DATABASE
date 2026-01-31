# KORAS – Web-App Dokumentation (Kurzfassung)

## Ziel & Zweck
Die Web-App steuert den Deal‑Prozess für Goldhandel/Geschäftsabwicklung: von der Kontaktanbahnung über KYC/AML bis zu Abschlussdokumenten. Sie bündelt Deals, Dokumente, KYC/CIS‑Daten, Kontakte, Risiken und Exports in einer Oberfläche.

## Hauptbereiche der Anwendung

### 1) Dashboard
- Übersicht aller Deals mit Status und Fortschritt.
- Filter/Suche nach Status/Deal‑Nr.
- Einstieg in **„Generator & Exports“**.

### 2) Deal‑Detail (Geschäfte)
Ein Deal ist die zentrale Einheit. In der Detailansicht gibt es mehrere Tabs:

**a) Übersicht**
- Deal‑Meta (Deal‑Nr., Status, Commodity, etc.).
- Schnellaktionen (Bearbeiten, GRC‑Planung, Discount Participation Table).

**b) Prozess / Schritte**
- Prozessschritte 1–18 mit Status (Open/Done etc.).
- Button **„Erstellen“ / „Upload“** je Dokumenttyp.

**c) Dokumente**
- Alle Uploads/Exporte je Deal.
- Download/Preview aus Supabase Storage.

**d) Kontakte & Bankinformationen**
- Deal‑Kontakte (Buyer/Seller/Intermediary etc.).
- Bankinformationen pro Deal (Bankname, IBAN, BIC, Kontoinhaber).

**e) KYC / CIS**
- Eigener KYC‑Tab je Deal.
- Rollen: **Buyer / Seller / Producer**.
- Vollständiges Formular (Company, Legal Counsel, Bank, Products, Trade References, etc.).
- **KYC‑PDF Upload** (signiert) pro Rolle.
- **KYC‑PDFs aufräumen**: Liste aller KYC‑PDFs und Zuordnung zu Rollen.
- **Drucken / PDF**: saubere Druckansicht der KYC‑Daten.
- **Kontakte aus KYC erstellen**: erzeugt Kontakte (Buyer/Seller + Legal + Bank Officers) und legt Bankdaten in der Adressverwaltung ab.

**f) Risiken / Audit**
- Risiko‑Register (Kategorie/Severity/Mitigation).
- Audit‑Log der Änderungen.

### 3) Generator & Exports (Modal)
- Zentrale Stelle zum Erstellen/Exportieren von Dokumenten je Schritt.
- Sprachwahl (EN/DE/FR).
- Auswahl der Dokumente (GENERATE, SOURCE_UPLOADED, UPLOAD_SLOT, EXTERNAL).
- **KYC‑CIS „Erstellen“** springt direkt in den KYC‑Tab des Deals.

## Dokumenttypen (Kurzlogik)
- **GENERATE**: aus Template/Markdown/Platzhaltern erzeugt.
- **SOURCE_UPLOADED**: Originaldatei aus Supabase Storage herunterladen.
- **UPLOAD_SLOT**: Upload‑Dialog.
- **EXTERNAL**: Auto‑Export (nur Anzeige).

## Datenhaltung (Supabase)
- **deals**: Hauptdaten des Deals.
- **deal_steps**: Prozessschritte.
- **documents**: Dateien inkl. doc_type, file_path, Upload‑Meta.
- **contacts / deal_contacts**: Kontakte und Zuordnung zum Deal.
- **deal_bank_accounts**: Bankdaten pro Deal + Kontakt.
- **kyc_profiles**: KYC‑Daten pro Deal & Rolle.

## KYC‑Rollenlogik
- Pro Deal gibt es mehrere KYC‑Profile: Buyer/Seller/Producer.
- Wechsel der Rolle ist möglich; Daten können verschoben werden.
- Signierte KYC‑PDFs sind pro Rolle hinterlegt (doc_type: `KYC_SIGNED_<ROLE>`).

## Export / Druck
- KYC‑Druckansicht erzeugt ein druckbares PDF über den Browser.
- Dokument‑Exporte über Generator (PDF/Download aus Storage).

## Bedien‑Quickstart
1. Deal öffnen (Dashboard → Deal anklicken).
2. KYC‑Daten ausfüllen (Tab KYC / CIS, Rolle auswählen, Speichern).
3. Signiertes KYC‑PDF hochladen.
4. Generator & Exports öffnen, Dokumente erstellen/Download/Upload.
5. Kontakte prüfen, Bankdaten übernehmen.

---

## Ablaufschema Südafrika SmartRec (Doré Bars) – Terminierung (Arbeitstage)
Annahmen: **Arbeitstage (Mo–Fr)**, **keine Zeitzonen‑Tage**, **keine Fix‑Slots**.  
Terminlogik: **Plan‑Datum** wird vorwärts aus Startdatum + Dauer berechnet; bei **Ist‑Datum** wird ab diesem Schritt neu geplant.

| Nr | Schritt | Verantwortlich | Dauer (AT) | Puffer (AT) | Plan Start | Plan Ende | Ist Start | Ist Ende | Hinweise |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Kontaktanbahnung Seller/Intermediaries | Koras | 3 | 0 |  |  |  |  | Erstkontakt, Bedarf, Verhandlung |
| 2 | Buyer‑Placement | Koras | 3 | 0 |  |  |  |  | Buyer identifizieren, LOI |
| 3 | KYC/AML/Sanktions‑/Embargoprüfung | Koras | 5 | 1 |  |  |  |  | Due Diligence, Screening |
| 4 | Chain‑of‑Custody Dokumentation | Koras | 3 | 0 |  |  |  |  | Herkunft/CoC‑Nachweise |
| 5 | SPA‑Erstellung/Signatur | Koras | 5 | 0 |  |  |  |  | **Drittbegünstigter** optional; falls vorhanden: Compliance‑Prüfung + Aufnahme in SPA |
| 6 | Re‑Identifizierung (nur Hallmark >5 Jahre) | Assay | 3 | 0 |  |  |  |  | Für Doré i. d. R. nicht relevant |
| 7 | Vorab‑Dokumente 72h vor Versand | Seller | 2 | 0 |  |  |  |  | 72h‑Frist überwachen |
| 8 | Lufttransport (versichert, Zollversiegelung) | Seller (bis FRA) / Koras (ab FRA) | 3 | 1 |  |  |  |  | Auslandslieferung per Luftfracht; **AWB** dokumentiert Flugdaten. Transportplanung bis FRA **durch Seller**, ab FRA **durch Koras** |
| 9 | Zollbereich Frankfurt/Main: Vorprüfung | Koras | 3 | 1 |  |  |  |  | Zoll‑Precheck nach Ankunft FRA |
| 10 | Sicherheitslogistik | Koras | 1 | 0 |  |  |  |  | Übergabe/Chain‑of‑Custody |
| 11 | Ankunft Pforzheim: Annahmebestätigung | Koras | 1 | 0 |  |  |  |  | Receiving/Acceptance |
| 12 | Fire Assay + optional Second Assay | Assay | 5 | 1 |  |  |  |  | Optional Second Assay |
| 13 | Verbindlicher Assay Report | Assay | 3 | 0 |  |  |  |  | Final Report |
| 14 | Preisfestlegung (LBMA Fixing Bezug) | Koras | 1 | 0 |  |  |  |  | Price Fixing |
| 15 | Zahlung innerhalb vertraglicher Frist | Koras / Bank | 2 | 1 |  |  |  |  | Bankinstrumente durch Koras: **SBLC/DLC/Block Funds/Bankgarantie** |
| 16 | Ownership Transfer | Koras | 1 | 0 |  |  |  |  | Eigentumsübergang |
| 17 | Raffination zu 999,9 | Refinery | 7 | 1 |  |  |  |  | Refining |
| 18 | Lagerung/Abholung Buyer | Koras | 3 | 0 |  |  |  |  | Storage/Release |
| 19 | Abschlussdokumentation | Koras | 1 | 0 |  |  |  |  | Closing Dossier |

## Hinweis für Präsentation
- Kernnutzen: **Prozesssicherheit, Dokumentenkonsistenz, KYC‑Compliance, zentrale Datenhaltung**.
- Alles ist Deal‑zentriert, Rollenbasiert (Buyer/Seller/Producer).

---

Wenn du eine ausführliche Version mit Screenshots/Beispiel‑Flows brauchst, sag mir Bescheid.
