-- Supprimer l'ancienne contrainte de clé étrangère
ALTER TABLE projets 
DROP CONSTRAINT IF EXISTS projets_profil_redacteur_id_fkey;

-- Recréer la contrainte avec ON DELETE RESTRICT
ALTER TABLE projets
ADD CONSTRAINT projets_profil_redacteur_id_fkey 
FOREIGN KEY (profil_redacteur_id) 
REFERENCES profils_redacteurs(id) 
ON DELETE RESTRICT;

-- Créer une fonction pour vérifier si un profil peut être supprimé
CREATE OR REPLACE FUNCTION check_profile_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM projets 
    WHERE profil_redacteur_id = OLD.id
  ) THEN
    RAISE EXCEPTION 'Vous ne pouvez pas supprimer un profil de rédacteur qui participe à un projet.'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour exécuter la vérification avant la suppression
DROP TRIGGER IF EXISTS check_profile_deletion_trigger ON profils_redacteurs;
CREATE TRIGGER check_profile_deletion_trigger
  BEFORE DELETE ON profils_redacteurs
  FOR EACH ROW
  EXECUTE FUNCTION check_profile_deletion();