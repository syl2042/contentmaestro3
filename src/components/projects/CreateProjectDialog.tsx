import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProjectForm } from './ProjectForm';
import { createProject } from '@/lib/api/projects';
import { useAuth } from '@/contexts/AuthContext';
import { useProfiles } from '@/hooks/useProfiles';
import type { CreateProjectPayload } from '@/lib/api/projects';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateProjectDialog({ isOpen, onClose, onSuccess }: CreateProjectDialogProps) {
  const { user } = useAuth();
  const { profiles, loading: loadingProfiles } = useProfiles(user?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateProjectPayload) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await createProject(user.id, data);
      
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
          {error && (
            <p className="text-sm text-[rgb(var(--color-error))]">{error}</p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <ProjectForm 
            onSubmit={handleSubmit} 
            submitting={loading} 
            profiles={profiles}
            loadingProfiles={loadingProfiles}
          />
        </div>
      </DialogContent>
    </Dialog>
  ); 
}
const handleSubmit = async (data: CreateProjectPayload) => {
  if (!user?.id) {
    setError('Utilisateur non connecté');
    return;
  }

  if (!data.profil_redacteur_id || !data.profil_redacteur_id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
    setError('Le profil de rédacteur est invalide ou manquant');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    await createProject(user.id, data);
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.error('Failed to create project:', err);
    setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la création du projet');
  } finally {
    setLoading(false);
  }
};
