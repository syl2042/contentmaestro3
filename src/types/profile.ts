export interface WriterProfile {
  id: string;
  user_id: string;
  nom_profil: string;
  specialite_thematique: string;
  style_ecriture: string;
  ton: string;
  niveau_langage: string;
  traits_personnalite: string[];
  date_creation: string;
  date_modification: string;
}

export interface CreateProfileData {
  user_id: string;
  nom_profil: string;
  specialite_thematique: string;
  style_ecriture: string;
  ton: string;
  niveau_langage: string;
  traits_personnalite: string[];
}