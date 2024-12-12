-- Mise à jour des politiques RLS pour les projets
DROP POLICY IF EXISTS "Projets can be created by owner" ON projets;

CREATE POLICY "Projets can be created by owner" ON projets
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (
      SELECT true
      FROM profils_redacteurs pr
      WHERE pr.id = profil_redacteur_id
      AND pr.user_id = auth.uid()
    )
  );

-- Ajout d'un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projets_profil_redacteur ON projets(profil_redacteur_id);
CREATE INDEX IF NOT EXISTS idx_projets_user_id ON projets(user_id);

-- Mise à jour de la contrainte de clé étrangère
ALTER TABLE projets
DROP CONSTRAINT IF EXISTS projets_profil_redacteur_id_fkey,
ADD CONSTRAINT projets_profil_redacteur_id_fkey 
  FOREIGN KEY (profil_redacteur_id) 
  REFERENCES profils_redacteurs(id) 
  ON DELETE RESTRICT;