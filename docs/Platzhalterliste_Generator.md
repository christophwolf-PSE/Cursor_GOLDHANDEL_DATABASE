# Platzhalterliste – Generator (aktuell + KYC/CIS Erweiterung)

Diese Liste ist in zwei Bereiche geteilt:
1) **Aktuell in der App verarbeitet**
2) **KYC/CIS & Bank Erweiterungen** (Schema wird ergänzt)

## 1) Aktuell in der App verarbeitet

| Platzhalter | Beschreibung | Quelle (DB) | Beispiel |
|---|---|---|---|
| `{{doc_code}}` | Dokumentcode | generator.js | doc_code |
| `{{date}}` | Datum (ISO, heute) | generator.js | 2026-01-27 |
| `{{deal_no}}` | Deal-Nummer | deals.deal_no | G-0012 |
| `{{seller.name}}` | Verkäufer Name | deals.seller_name / deals.seller | Acme Seller Ltd |
| `{{buyer.name}}` | Käufer Name | deals.buyer_name / deals.buyer | Buyer GmbH |
| `{{intermediaries.names}}` | Intermediaries Namen (kommagetrennt) | contacts (selected) | Alice Smith, Bob Jones |
| `{{contacts.names}}` | Kontakte Namen (kommagetrennt) | contacts (selected) | Alice Smith, Bob Jones |
| `{{contacts.list}}` | Kontakte Namen (kommagetrennt) | contacts (selected) | Alice Smith, Bob Jones |
| `{{commodity}}` | Commodity | deals.commodity_type / deals.commodity | Gold Dore |
| `{{quantity_kg}}` | Menge in kg | deals.quantity_kg / deals.quantity | 250 |
| `{{origin.country}}` | Ursprungsland | deals.origin_country / deals.country | GH |
| `{{shipment.route}}` | Versandroute | deals.shipment_route / deals.route | ACC → FRA |
| `{{price_fixing}}` | Price Fixing | deals.price_fixing | LBMA AM |
| `{{lbma_discount_pct}}` | LBMA Discount % | deals.lbma_discount_pct | 2.5 |

## 2) Bankdaten (derzeit in DB vorhanden, aber noch nicht im Generator verdrahtet)

| Platzhalter | Beschreibung | Quelle (DB) | Beispiel |
|---|---|---|---|
| `{{bank.name}}` | Bankname | deal_bank_accounts.bank_name | HypoVereinsbank |
| `{{bank.iban}}` | IBAN | deal_bank_accounts.iban | DE09 67020190 0033115229 |
| `{{bank.bic}}` | BIC/SWIFT | deal_bank_accounts.bic | HYVEDEMM489 |
| `{{bank.account_holder}}` | Kontoinhaber | deal_bank_accounts.account_holder | Koras PMR GmbH |

## 3) KYC/CIS – vorgeschlagene Felder (müssen in DB angelegt werden)

| Platzhalter | Beschreibung | Vorschlag DB-Feld | Beispiel |
|---|---|---|---|
| `{{company.name}}` | Company Name | kyc_profiles.company_name | Koras PMR GmbH |
| `{{company.authorized_signatory.name}}` | Authorized Signatory Name | kyc_profiles.authorized_signatory_name | Thorsten Koras |
| `{{company.authorized_signatory.title}}` | Authorized Signatory Title | kyc_profiles.authorized_signatory_title | General Manager |
| `{{company.authorized_signatory.passport_no}}` | Passport No. | kyc_profiles.authorized_signatory_passport_no | C91GTK2XR / C91GZ7239 |
| `{{company.address.street}}` | Street | kyc_profiles.company_street | Hauptstrasse 66 |
| `{{company.address.postal_code}}` | Postal Code | kyc_profiles.company_postal_code | 75331 |
| `{{company.address.city}}` | City | kyc_profiles.company_city | Engelsbrand |
| `{{company.address.country}}` | Country | kyc_profiles.company_country | Germany |
| `{{company.phone}}` | Phone | kyc_profiles.company_phone | +49 7082 79283 00 |
| `{{company.email}}` | Business Corporate E-mail | kyc_profiles.company_email | info@koras-group.de |
| `{{company.website}}` | Business Website | kyc_profiles.company_website | www.koras-group.de |
| `{{company.tax_id}}` | Tax Identification Number | kyc_profiles.company_tax_id | 49474/00324 |
| `{{company.vat_id}}` | VAT/BTW Number | kyc_profiles.company_vat_id | DE326313730 |
| `{{company.role.buyer}}` | Are you a Buyer (Yes/No) | kyc_profiles.role_buyer | Yes/No |
| `{{company.role.seller}}` | Are you a Seller (Yes/No) | kyc_profiles.role_seller | Yes/No |
| `{{company.role.producer}}` | Are you a Producer (Yes/No) | kyc_profiles.role_producer | Yes/No |
| `{{company.product.raw_material}}` | Raw material of precious metals (Yes/No) | kyc_profiles.product_raw_material | Yes/No |
| `{{company.product.refined_bars}}` | Refined bars of precious metals (Yes/No) | kyc_profiles.product_refined_bars | Yes/No |
| `{{company.product.machinery}}` | Precious metal refinery machinery (Yes/No) | kyc_profiles.product_machinery | Yes/No |
| `{{company.type_of_business}}` | Type of Business | kyc_profiles.type_of_business | Sales / trade |
| `{{company.incorporation_date}}` | Incorporation Date | kyc_profiles.incorporation_date | 2019-08-14 |
| `{{company.shareholder_owner}}` | Shareholder/Owner | kyc_profiles.shareholder_owner | Thorsten Koras |
| `{{company.total_employees}}` | Total number of Employees | kyc_profiles.total_employees | 5 |
| `{{company.subsidiaries}}` | Subsidiaries | kyc_profiles.subsidiaries | See separate list |
| `{{primary_contact.first_name}}` | Primary Contact First Name | kyc_profiles.primary_contact_first_name | Thorsten |
| `{{primary_contact.last_name}}` | Primary Contact Last Name | kyc_profiles.primary_contact_last_name | Koras |
| `{{primary_contact.function}}` | Primary Contact Function | kyc_profiles.primary_contact_function | General Manager |
| `{{primary_contact.phone}}` | Primary Contact Phone | kyc_profiles.primary_contact_phone | +49 7082 79283 00 |
| `{{primary_contact.email}}` | Primary Contact Email | kyc_profiles.primary_contact_email | thorsten.koras@koras-group.de |
| `{{legal_counsel.name}}` | Legal Counsel Name | kyc_profiles.legal_counsel_name | Dr. Marco Loesche |
| `{{legal_counsel.street}}` | Legal Counsel Street | kyc_profiles.legal_counsel_street | Zeppelinallee 77 |
| `{{legal_counsel.postal_code}}` | Legal Counsel Postal Code | kyc_profiles.legal_counsel_postal_code | 60487 |
| `{{legal_counsel.city}}` | Legal Counsel City | kyc_profiles.legal_counsel_city | Frankfurt am Main |
| `{{legal_counsel.country}}` | Legal Counsel Country | kyc_profiles.legal_counsel_country | Germany |
| `{{legal_counsel.phone}}` | Legal Counsel Phone | kyc_profiles.legal_counsel_phone | +49 69 24 70 97 22 |
| `{{legal_counsel.email}}` | Legal Counsel Email | kyc_profiles.legal_counsel_email | marco.loesche@actlegal-act.com |
| `{{legal_counsel.website}}` | Legal Counsel Website | kyc_profiles.legal_counsel_website | www.actlegal.com |

## 4) Bankdetails (KYC/CIS – vorgeschlagen)

| Platzhalter | Beschreibung | Vorschlag DB-Feld | Beispiel |
|---|---|---|---|
| `{{bank.street}}` | Bank Street | kyc_bank_details.bank_street | C 1, 3 |
| `{{bank.postal_code}}` | Bank Postal Code | kyc_bank_details.bank_postal_code | 68159 |
| `{{bank.city}}` | Bank City | kyc_bank_details.bank_city | Mannheim |
| `{{bank.country}}` | Bank Country | kyc_bank_details.bank_country | Germany |
| `{{bank.phone}}` | Bank Phone | kyc_bank_details.bank_phone | +49 621 5908 269 |
| `{{bank.officer.name}}` | Bank Officer Name | kyc_bank_details.bank_officer_name | M. Tobias Herget |
| `{{bank.officer.direct_phone}}` | Bank Officer Direct Phone | kyc_bank_details.bank_officer_direct_phone | +49 621 5908 269 |
| `{{bank.officer.email}}` | Bank Officer Email | kyc_bank_details.bank_officer_email | tobias.herget@unicredit.de |
| `{{bank.account_name}}` | Account Name | kyc_bank_details.account_name | Koras PMR GmbH |
| `{{bank.account_number}}` | Account Number | kyc_bank_details.account_number | 33115229 |
| `{{bank.swift_bic}}` | SWIFT/BIC | kyc_bank_details.swift_bic | HYVEDEMM489 |
| `{{bank.account_signatory}}` | Account Signatory | kyc_bank_details.account_signatory | Thorsten Koras, Solange Koras |
| `{{bank.reference_letter_appendix}}` | Bank reference letter in appendix (Yes/No) | kyc_bank_details.reference_letter_appendix | Yes/No |
| `{{bank.contacts.table}}` | Bank Contact People (table) | kyc_bank_contacts (list) | Generated table |

## 5) Trade References / CIF / Fixtures (KYC/CIS – vorgeschlagen)

| Platzhalter | Beschreibung | Vorschlag DB-Feld | Beispiel |
|---|---|---|---|
| `{{trade_references.table}}` | Trade References (table) | kyc_trade_references (list) | Generated table |
| `{{trade_references.list}}` | Trade References (list) | kyc_trade_references (list) | Adani (India); Aurus (Russia); Heng Juan (China) |
| `{{cif_basis}}` | Deal on CIF basis (Yes/No) | kyc_profiles.cif_basis | Yes/No |
| `{{fixtures.last_three}}` | Last three fixtures (text) | kyc_profiles.fixtures_last_three | Fixture 1; Fixture 2; Fixture 3 |
