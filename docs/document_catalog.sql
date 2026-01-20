-- Optional future table for document catalog (do not execute here)
CREATE TABLE IF NOT EXISTS document_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_no INTEGER NOT NULL,
    sub_no INTEGER NOT NULL,
    doc_code TEXT NOT NULL,
    title TEXT NOT NULL,
    template_no TEXT,
    language TEXT DEFAULT 'EN',
    doc_type TEXT NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    locked_text BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data should mirror src/domain/documentCatalog.seed.json
