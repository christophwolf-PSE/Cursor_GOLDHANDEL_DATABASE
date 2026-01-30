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

## Hinweis für Präsentation
- Kernnutzen: **Prozesssicherheit, Dokumentenkonsistenz, KYC‑Compliance, zentrale Datenhaltung**.
- Alles ist Deal‑zentriert, Rollenbasiert (Buyer/Seller/Producer).

---

Wenn du eine ausführliche Version mit Screenshots/Beispiel‑Flows brauchst, sag mir Bescheid.
