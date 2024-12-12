import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProjectForm } from './ProjectForm';
import { updateProject } from '@/lib/api/projects';
import { useAuth } from '@/contexts/AuthContext';
import { useProfiles } from '@/hooks/useProfiles';
import type { Project, CreateProjectData } from '@/types/project';

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSuccess?: () => void;
}

export function EditProjectDialog({ isOpen, onClose, project, onSuccess }: EditProjectDialogProps) {
  const { user } = useAuth();
  const { profiles, loading: loadingProfiles } = useProfiles(user?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateProjectData) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateProject(project.id, data);
      
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to update project:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour du projet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
          {error && (
            <p className="text-sm text-[rgb(var(--color-error))]">{error}</p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <ProjectForm 
            onSubmit={handleSubmit} 
            submitting={loading}
            initialData={{
              titre: project.titre,
              description: project.description,
              statut: project.statut,
              profil_redacteur_id: project.profil_redacteur_id,
              types_contenus: project.types_contenus
            }}
            profiles={profiles}
            loadingProfiles={loadingProfiles}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}