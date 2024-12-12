import type { ProjectStatus } from '@/types/project';

export interface CreateProjectPayload {
  titre: string;
  description?: string;
  statut: ProjectStatus;
  profil_redacteur_id: string;
  types_contenus: {
    type_id: string;
    subtype_ids: string[];
  }[];
}

export interface ProjectError extends Error {
  code: string;
  details?: Record<string, unknown>;
}