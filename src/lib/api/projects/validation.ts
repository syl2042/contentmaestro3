import { validateId } from '@/lib/utils/validation';
import { supabase } from '@/lib/supabase';
import type { CreateProjectPayload } from './types';

export function validateProjectData(data: CreateProjectPayload): string | null {
  // Validation du titre
  if (!data.titre?.trim()) {
    return 'Le titre est requis';
  }

  // Validation de l'UUID du profil
  const profileIdError = validateId(data.profil_redacteur_id, 'Le profil de rédacteur');
  if (profileIdError) {
    return profileIdError;
  }

  // Validation des types de contenus
  if (!data.types_contenus?.length) {
    return 'Au moins un type de contenu est requis';
  }

  // Validation des sous-types pour chaque type de contenu
  for (const type of data.types_contenus) {
    if (!type.subtype_ids?.length) {
      return `Au moins un sous-type est requis pour le type "${type.type_id}"`;
    }
  }

  return null;
}

export async function validateProfileOwnership(userId: string, profileId: string): Promise<boolean> {
  try {
    // Validation des UUID
    const userIdError = validateId(userId, 'L\'identifiant utilisateur');
    const profileIdError = validateId(profileId, 'L\'identifiant du profil');
    
    if (userIdError || profileIdError) {
      console.error('UUID validation failed:', { userIdError, profileIdError });
      return false;
    }

    console.log('Validating profile ownership:', { userId, profileId });

    // Vérification que le profil existe et appartient à l'utilisateur
    const { data: profileData, error: profileError } = await supabase
      .from('profils_redacteurs')
      .select('id')
      .eq('id', profileId)
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Profile validation error:', profileError);
      return false;
    }

    const isValid = !!profileData;
    console.log('Profile validation result:', { isValid, profileData });
    return isValid;
  } catch (err) {
    console.error('Validation error:', err);
    return false;
  }
}