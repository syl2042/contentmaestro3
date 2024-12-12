import { supabase } from '../supabase';
import type { Project, CreateProjectData } from '@/types/project';

export async function getRecentProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
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
    .eq('user_id', userId)
    .order('date_modification', { ascending: false });

  if (error) {
    console.error('Error fetching recent projects:', error);
    throw error;
  }

  return data.map(project => ({
    ...project,
    contentCount: project.sous_types_contenus ? 
      (project.sous_types_contenus as any[]).reduce((sum, type) => 
        sum + (type.subtype_ids?.length || 0), 0
      ) : 0,
    types_contenus: project.sous_types_contenus || []
  }));
}

export async function createProject(userId: string, data: CreateProjectData): Promise<Project> {
  const projectData = {
    user_id: userId,
    titre: data.titre,
    description: data.description,
    statut: data.statut,
    profil_redacteur_id: data.profil_redacteur_id,
    types_contenus: data.types_contenus.map(type => type.type_id),
    sous_types_contenus: data.types_contenus,
    progression: 0,
    date_creation: new Date().toISOString(),
    date_modification: new Date().toISOString()
  };

  const { data: project, error } = await supabase
    .from('projets')
    .insert([projectData])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return {
    ...project,
    contentCount: project.sous_types_contenus ? 
      (project.sous_types_contenus as any[]).reduce((sum, type) => 
        sum + (type.subtype_ids?.length || 0), 0
      ) : 0,
    types_contenus: project.sous_types_contenus || []
  };
}

export async function updateProject(projectId: string, data: Partial<CreateProjectData>): Promise<Project> {
  const updateData: any = {
    ...data,
    date_modification: new Date().toISOString()
  };

  if (data.types_contenus) {
    updateData.types_contenus = data.types_contenus.map(type => type.type_id);
    updateData.sous_types_contenus = data.types_contenus;
  }

  const { data: project, error } = await supabase
    .from('projets')
    .update(updateData)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return {
    ...project,
    contentCount: project.sous_types_contenus ? 
      (project.sous_types_contenus as any[]).reduce((sum, type) => 
        sum + (type.subtype_ids?.length || 0), 0
      ) : 0,
    types_contenus: project.sous_types_contenus || []
  };
}

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from('projets')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function getProjectDetails(projectId: string): Promise<Project> {
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

  return {
    ...project,
    contentCount: project.sous_types_contenus ? 
      (project.sous_types_contenus as any[]).reduce((sum, type) => 
        sum + (type.subtype_ids?.length || 0), 0
      ) : 0,
    types_contenus: project.sous_types_contenus || []
  };
}