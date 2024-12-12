import { supabase } from '@/lib/supabase';
import { validateProjectData, validateProfileOwnership } from './validation';
import { ProjectValidationError, ProfileOwnershipError, ProjectCreationError } from './errors';
import type { CreateProjectPayload } from './types';
import type { Project } from '@/types/project';

export async function getProjectDetails(projectId: string): Promise<Project> {
  try {
    console.log('Fetching project details:', projectId);

    const { data: project, error } = await supabase
      .from('projets')
      .select(`
        id,
        user_id,
        profil_redacteur_id,
        titre,
        description,
        statut,
        types_contenus,
        sous_types_contenus,
        progression,
        date_creation,
        date_modification
      `)
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project details:', error);
      throw error;
    }

    if (!project) {
      throw new Error('Project not found');
    }

    // S'assurer que sous_types_contenus est un tableau
    const typesContenus = Array.isArray(project.sous_types_contenus) 
      ? project.sous_types_contenus 
      : [];

    return {
      ...project,
      contentCount: typesContenus.reduce((sum, type: any) => 
        sum + (Array.isArray(type.subtype_ids) ? type.subtype_ids.length : 0), 0
      ),
      types_contenus: typesContenus
    };
  } catch (error) {
    console.error('Get project details error:', error);
    throw error;
  }
}

// ... autres fonctions existantes ...