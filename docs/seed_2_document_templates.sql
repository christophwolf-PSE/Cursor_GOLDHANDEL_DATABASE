-- Seed document_templates (idempotent)

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  '72H-COVER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# 72h Shipping Documents Cover Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  '72H-COVER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# 72h Shipping Documents Cover Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  '72H-COVER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# 72h Shipping Documents Cover Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-FINAL-COVER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Final Assay Report Cover + Summary
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-FINAL-COVER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Final Assay Report Cover + Summary
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-FINAL-COVER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Final Assay Report Cover + Summary
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-REQ', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Assay Request Form
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-REQ', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Assay Request Form
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-REQ', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Assay Request Form
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'BCL', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Bank Comfort Letter
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'BCL', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Bank Comfort Letter
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'BCL', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Bank Comfort Letter
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'CLOSING-INDEX', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Closing Dossier Index
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'CLOSING-INDEX', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Closing Dossier Index
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'CLOSING-INDEX', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Closing Dossier Index
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'COC-TRANSFER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Chain-of-Custody Transfer Record
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'COC-TRANSFER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Chain-of-Custody Transfer Record
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'COC-TRANSFER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Chain-of-Custody Transfer Record
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'DPT', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# Discount Participation Table (Annex)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'DPT', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# Discount Participation Table (Annex)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'DPT', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# Discount Participation Table (Annex)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-BUYER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Buyer-Side Intermediary Fee Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-BUYER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Buyer-Side Intermediary Fee Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-BUYER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Buyer-Side Intermediary Fee Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-CHAIN', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Full Chain Master Fee & NCNDA Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-CHAIN', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Full Chain Master Fee & NCNDA Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-CHAIN', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Full Chain Master Fee & NCNDA Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-SELLER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Seller-Side Intermediary Fee Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-SELLER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Seller-Side Intermediary Fee Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-SELLER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Seller-Side Intermediary Fee Agreement
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'IMPORT-INSTR', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Customs/Import Instruction Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'IMPORT-INSTR', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Customs/Import Instruction Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'IMPORT-INSTR', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Customs/Import Instruction Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'KYC-CIS', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# KYC / CIS Form
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'KYC-CIS', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# KYC / CIS Form
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'KYC-CIS', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# KYC / CIS Form
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'LOG-INS', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Logistics & Insurance Instructions
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'LOG-INS', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Logistics & Insurance Instructions
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'LOG-INS', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Logistics & Insurance Instructions
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'NDA-NCNDA', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# NDA / NCNDA (light)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'NDA-NCNDA', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# NDA / NCNDA (light)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'NDA-NCNDA', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# NDA / NCNDA (light)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWN-TRANSFER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Ownership Transfer Certificate
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWN-TRANSFER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Ownership Transfer Certificate
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWN-TRANSFER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Ownership Transfer Certificate
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PAY-GUAR', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Payment Guarantee Letter
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PAY-GUAR', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Payment Guarantee Letter
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PAY-GUAR', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Payment Guarantee Letter
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PRICE-FIX', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Price Fixing Sheet (LBMA reference)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PRICE-FIX', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Price Fixing Sheet (LBMA reference)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PRICE-FIX', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Price Fixing Sheet (LBMA reference)
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'RECEIVE-CERT', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Acceptance & Receiving Certificate
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'RECEIVE-CERT', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Acceptance & Receiving Certificate
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'RECEIVE-CERT', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Acceptance & Receiving Certificate
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'REFINE-ORDER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Refining Order / Processing Instruction
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'REFINE-ORDER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Refining Order / Processing Instruction
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'REFINE-ORDER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Refining Order / Processing Instruction
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'NDA-NCNDA', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S01.3 NDA NCN
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'NDA-NCNDA', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S01.3 NDA NCN
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'NDA-NCNDA', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S01.3 NDA NCN
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-BUYER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S02.2 BUYER SIDE COMMISSION AGREEMENT
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-BUYER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S02.2 BUYER SIDE COMMISSION AGREEMENT
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-BUYER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S02.2 BUYER SIDE COMMISSION AGREEMENT
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-CHAIN', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S02.3 FULL CHAIN COMMISSION AGREEMENT
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-CHAIN', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S02.3 FULL CHAIN COMMISSION AGREEMENT
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FEE-CHAIN', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S02.3 FULL CHAIN COMMISSION AGREEMENT
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'DPT', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# S02.4 DISCOUNT PARTICIPATION TABLE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'DPT', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# S02.4 DISCOUNT PARTICIPATION TABLE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'DPT', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# S02.4 DISCOUNT PARTICIPATION TABLE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SCREEN-LOG', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S03.5 KYC AML SCREENING LOG
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SCREEN-LOG', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S03.5 KYC AML SCREENING LOG
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SCREEN-LOG', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S03.5 KYC AML SCREENING LOG
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'COC-TRANSFER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S04.1 CHAIN OF CUSTODY DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'COC-TRANSFER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S04.1 CHAIN OF CUSTODY DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'COC-TRANSFER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S04.1 CHAIN OF CUSTODY DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWNERSHIP', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S04.2 OWNERSHIP DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWNERSHIP', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S04.2 OWNERSHIP DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWNERSHIP', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S04.2 OWNERSHIP DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FREE-CLEAR', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.10 FREE AND CLEAR DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FREE-CLEAR', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.10 FREE AND CLEAR DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'FREE-CLEAR', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.10 FREE AND CLEAR DECLARATION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  '72H-COVER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.1 72H DOCUMENT COVER SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  '72H-COVER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.1 72H DOCUMENT COVER SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  '72H-COVER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.1 72H DOCUMENT COVER SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PROFORMA', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.2 PROFORMA INVOICE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PROFORMA', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.2 PROFORMA INVOICE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PROFORMA', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.2 PROFORMA INVOICE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PACKING', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.3 PACKING LIST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PACKING', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.3 PACKING LIST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PACKING', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S06.3 PACKING LIST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'LOG-INS', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S07.1 AIR TRANSPORT INSTRUCTION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'LOG-INS', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S07.1 AIR TRANSPORT INSTRUCTION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'LOG-INS', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S07.1 AIR TRANSPORT INSTRUCTION
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'IMPORT-INSTR', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S08.1 IMPORT PRECHECK CHECKLIST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'IMPORT-INSTR', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S08.1 IMPORT PRECHECK CHECKLIST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'IMPORT-INSTR', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S08.1 IMPORT PRECHECK CHECKLIST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SEC-HANDOVER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S09.1 SECURITY HANDOVER PROTOCOL
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SEC-HANDOVER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S09.1 SECURITY HANDOVER PROTOCOL
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SEC-HANDOVER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S09.1 SECURITY HANDOVER PROTOCOL
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'RECEIVE-CERT', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S10.1 RECEIPT ACCEPTANCE CERTIFICATE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'RECEIVE-CERT', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S10.1 RECEIPT ACCEPTANCE CERTIFICATE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'RECEIVE-CERT', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S10.1 RECEIPT ACCEPTANCE CERTIFICATE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-REQ', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S11.1 FIRE ASSAY REQUEST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-REQ', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S11.1 FIRE ASSAY REQUEST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-REQ', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S11.1 FIRE ASSAY REQUEST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-2ND', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S11.2 SECOND ASSAY REQUEST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-2ND', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S11.2 SECOND ASSAY REQUEST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-2ND', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S11.2 SECOND ASSAY REQUEST
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-FINAL-COVER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S12.1 BINDING ASSAY SUMMARY SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-FINAL-COVER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S12.1 BINDING ASSAY SUMMARY SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'ASSAY-FINAL-COVER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S12.1 BINDING ASSAY SUMMARY SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PRICE-FIX', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S13.1 PRICE FIXATION SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PRICE-FIX', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S13.1 PRICE FIXATION SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'PRICE-FIX', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S13.1 PRICE FIXATION SHEET
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SETTLEMENT', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S14.1 PAYMENT INSTRUCTION LETTER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SETTLEMENT', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S14.1 PAYMENT INSTRUCTION LETTER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SETTLEMENT', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S14.1 PAYMENT INSTRUCTION LETTER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWN-TRANSFER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S15.1 OWNERSHIP TRANSFER CERTIFICATE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWN-TRANSFER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S15.1 OWNERSHIP TRANSFER CERTIFICATE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'OWN-TRANSFER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S15.1 OWNERSHIP TRANSFER CERTIFICATE
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'REFINE-ORDER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S16.1 REFINING ORDER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'REFINE-ORDER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S16.1 REFINING ORDER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'REFINE-ORDER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S16.1 REFINING ORDER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'STORAGE-RELEASE', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S17.2 RELEASE ORDER BUYER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'STORAGE-RELEASE', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S17.2 RELEASE ORDER BUYER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'STORAGE-RELEASE', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# S17.2 RELEASE ORDER BUYER
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'CLOSING-INDEX', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# S18.1 CLOSING DOSSIER INDEX
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'CLOSING-INDEX', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# S18.1 CLOSING DOSSIER INDEX
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'CLOSING-INDEX', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer", "table_md"]'::jsonb, '# S18.1 CLOSING DOSSIER INDEX
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

{{table_md}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SCREEN-LOG', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Sanctions/PEP/Embargo Screening Log
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SCREEN-LOG', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Sanctions/PEP/Embargo Screening Log
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SCREEN-LOG', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Sanctions/PEP/Embargo Screening Log
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SEC-HANDOVER', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Security Logistics Handover Record
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SEC-HANDOVER', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Security Logistics Handover Record
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SEC-HANDOVER', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Security Logistics Handover Record
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SETTLEMENT', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Payment Instruction / Settlement Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SETTLEMENT', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Payment Instruction / Settlement Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SETTLEMENT', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Payment Instruction / Settlement Sheet
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SOF-SOW', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Source of Funds / Source of Wealth Declaration
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SOF-SOW', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Source of Funds / Source of Wealth Declaration
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SOF-SOW', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Source of Funds / Source of Wealth Declaration
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SPA', 'EN', 1, true, '[]'::jsonb, 'SOURCE_UPLOADED', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SPA', 'DE', 1, true, '[]'::jsonb, 'SOURCE_UPLOADED', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SPA', 'FR', 1, true, '[]'::jsonb, 'SOURCE_UPLOADED', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SPA-ADD-02', 'EN', 1, true, '[]'::jsonb, 'SOURCE_UPLOADED', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SPA-ADD-02', 'DE', 1, true, '[]'::jsonb, 'SOURCE_UPLOADED', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'SPA-ADD-02', 'FR', 1, true, '[]'::jsonb, 'SOURCE_UPLOADED', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'STORAGE-RELEASE', 'EN', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Storage & Buyer Release / Collection Note
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

This document records the agreement and operational details for the referenced transaction.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Scope
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operational Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
The parties confirm compliance with applicable AML/KYC, sanctions, and customs requirements.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'STORAGE-RELEASE', 'DE', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Storage & Buyer Release / Collection Note
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Dieses Dokument hält die Vereinbarung und die operativen Details der referenzierten Transaktion fest.

## Parteien
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Geltungsbereich
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Operative Details
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Compliance
Die Parteien bestätigen die Einhaltung der geltenden AML/KYC-, Sanktions- und Zollvorgaben.

## Unterschriften
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();

insert into public.document_templates (doc_code, language, version, locked_text, placeholders, body_md, updated_at) values (
  'STORAGE-RELEASE', 'FR', 1, false, '["doc_code", "date", "deal_no", "seller.name", "buyer.name", "seller.address", "buyer.address", "intermediaries.names", "commodity", "quantity_kg", "origin.country", "shipment.route", "price_fixing", "lbma_discount_pct", "bank.name", "bank.iban", "bank.bic", "bank.account_holder", "signatures.seller", "signatures.buyer"]'::jsonb, '# Storage & Buyer Release / Collection Note
**Document Code:** {{doc_code}}
**Date:** {{date}}
**Deal No.:** {{deal_no}}

Ce document consigne l’accord et les détails opérationnels de la transaction concernée.

## Parties
- Seller: {{seller.name}}
- Buyer: {{buyer.name}}
- Intermediaries: {{intermediaries.names}}

## Portée
- Commodity: {{commodity}}
- Quantity (kg): {{quantity_kg}}
- Origin: {{origin.country}}

## Détails opérationnels
- Route: {{shipment.route}}
- Price Fixing: {{price_fixing}}
- LBMA Discount: {{lbma_discount_pct}}

## Conformité
Les parties confirment le respect des obligations AML/KYC, sanctions et douanes applicables.

## Signatures
Seller: {{signatures.seller}}
Buyer: {{signatures.buyer}}', now()
) on conflict (doc_code, language, version) do update set
  locked_text = excluded.locked_text,
  placeholders = excluded.placeholders,
  body_md = excluded.body_md,
  updated_at = now();
