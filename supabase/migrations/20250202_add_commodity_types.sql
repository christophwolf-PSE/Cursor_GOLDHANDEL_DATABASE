DO $$
DECLARE
  enum_name text;
  has_check boolean;
BEGIN
  -- Detect ENUM-based column
  SELECT t.typname INTO enum_name
  FROM pg_attribute a
  JOIN pg_type t ON a.atttypid = t.oid
  WHERE a.attrelid = 'deals'::regclass
    AND a.attname = 'commodity_type'
    AND t.typtype = 'e';

  IF enum_name IS NOT NULL THEN
    EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', enum_name, 'Gold Dust / Nuggets / Lumps');
    EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', enum_name, 'Scrap / Melt');
    EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', enum_name, 'Granulat / Grain');
    EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', enum_name, 'Münzen / Medaillen');
    EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', enum_name, 'Cast Bars');
    EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', enum_name, 'Minted Bars');
    RETURN;
  END IF;

  -- Detect CHECK-based constraint
  SELECT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'deals_commodity_type_check'
      AND conrelid = 'deals'::regclass
  ) INTO has_check;

  IF has_check THEN
    EXECUTE 'ALTER TABLE deals DROP CONSTRAINT deals_commodity_type_check';
  END IF;

  EXECUTE $sql$
    ALTER TABLE deals
      ADD CONSTRAINT deals_commodity_type_check
      CHECK (commodity_type IN (
        'Doré',
        'Hallmark',
        'Gold Dust / Nuggets / Lumps',
        'Scrap / Melt',
        'Granulat / Grain',
        'Münzen / Medaillen',
        'Cast Bars',
        'Minted Bars'
      ))
  $sql$;
END $$;
