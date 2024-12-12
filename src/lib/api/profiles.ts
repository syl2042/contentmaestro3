import { supabase } from '../supabase';
import type { WriterProfile, CreateProfileData } from '@/types/profile';

export async function createProfile(data: CreateProfileData): Promise<WriterProfile> {
  try {
    const profileData = {
      user_id: data.user_id,
      nom_profil: data.nom_profil,
      specialite_thematique: data.specialite_thematique,
      style_ecriture: data.style_ecriture,
      ton: data.ton,
      niveau_langage: data.niveau_langage,
      traits_personnalite: data.traits_personnalite || [],
      date_creation: new Date().toISOString(),
      date_modification: new Date().toISOString()
    };

    const { data: profile, error } = await supabase
      .from('profils_redacteurs')
      .insert([profileData])
      .select()
      .single();

    if (error) throw error;
    return profile;
  } catch (err) {
    console.error('Error creating profile:', err);
    throw err;
  }
}

export async function updateProfile(id: string, data: Partial<CreateProfileData>): Promise<WriterProfile> {
  try {
    const updateData = {
      ...(data.nom_profil && { nom_profil: data.nom_profil }),
      ...(data.specialite_thematique && { specialite_thematique: data.specialite_thematique }),
      ...(data.style_ecriture && { style_ecriture: data.style_ecriture }),
      ...(data.ton && { ton: data.ton }),
      ...(data.niveau_langage && { niveau_langage: data.niveau_langage }),
      ...(data.traits_personnalite && { traits_personnalite: data.traits_personnalite }),
      date_modification: new Date().toISOString()
    };

    const { data: profile, error } = await supabase
      .from('profils_redacteurs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  } catch (err) {
    console.error('Error updating profile:', err);
    throw err;
  }
}

export async function checkProfileUsage(profileId: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('projets')
      .select('*', { count: 'exact', head: true })
      .eq('profil_redacteur_id', profileId);

    if (error) throw error;
    return count ? count > 0 : false;
  } catch (err) {
    console.error('Error checking profile usage:', err);
    throw err;
  }
}

export async function deleteProfile(profileId: string): Promise<void> {
  try {
    // Vérifier si le profil est utilisé
    const isUsed = await checkProfileUsage(profileId);
    if (isUsed) {
      throw new Error('Vous ne pouvez pas supprimer un profil de rédacteur qui participe à un projet');
    }

    // Si le profil n'est pas utilisé, procéder à la suppression
    const { error } = await supabase
      .from('profils_redacteurs')
      .delete()
      .eq('id', profileId);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting profile:', err);
    throw err;
  }
}