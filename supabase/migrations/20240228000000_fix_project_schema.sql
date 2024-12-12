-- Mise à jour de la table projets
ALTER TABLE projets
ADD COLUMN IF NOT EXISTS profil_redacteur_id UUID REFERENCES profils_redacteurs(id);

-- Mise à jour des politiques RLS
DROP POLICY IF EXISTS "Projets can be created by owner" ON projets;
DROP POLICY IF EXISTS "Projets can be read by owner" ON projets;
DROP POLICY IF EXISTS "Projets can be updated by owner" ON projets;
DROP POLICY IF EXISTS "Projets can be deleted by owner" ON projets;

-- Création des nouvelles politiques
CREATE POLICY "Projets can be created by owner" ON projets
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM profils_redacteurs pr
      WHERE pr.id = profil_redacteur_id
      AND pr.user_id = auth.uid()
    )
  );

CREATE POLICY "Projets can be read by owner" ON projets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Projets can be updated by owner" ON projets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Projets can be deleted by owner" ON projets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Ajout d'un trigger pour valider le profil_redacteur_id
CREATE OR REPLACE FUNCTION validate_project_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profils_redacteurs
    WHERE id = NEW.profil_redacteur_id
    AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Le profil de rédacteur doit appartenir à l''utilisateur'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_project_profile ON projets;
CREATE TRIGGER check_project_profile
  BEFORE INSERT OR UPDATE ON projets
  FOR EACH ROW
  EXECUTE FUNCTION validate_project_profile();