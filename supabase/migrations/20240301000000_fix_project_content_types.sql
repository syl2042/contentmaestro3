-- Mise à jour de la structure de la table projets
ALTER TABLE projets
ALTER COLUMN types_contenus SET DEFAULT '[]'::jsonb,
ALTER COLUMN sous_types_contenus SET DEFAULT '[]'::jsonb;

-- Ajout d'une contrainte de validation pour les types_contenus
ALTER TABLE projets
ADD CONSTRAINT check_types_contenus 
CHECK (jsonb_typeof(sous_types_contenus) = 'array');

-- Ajout d'un trigger pour valider la structure des types_contenus
CREATE OR REPLACE FUNCTION validate_content_types()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT (
    SELECT bool_and(
      jsonb_typeof(value->>'type_id') = 'string' AND
      jsonb_typeof(value->'subtype_ids') = 'array'
    )
    FROM jsonb_array_elements(NEW.sous_types_contenus)
  ) THEN
    RAISE EXCEPTION 'Invalid content types structure';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_content_types ON projets;
CREATE TRIGGER check_content_types
  BEFORE INSERT OR UPDATE ON projets
  FOR EACH ROW
  EXECUTE FUNCTION validate_content_types();