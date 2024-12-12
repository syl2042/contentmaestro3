import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { checkProfileUsage } from '@/lib/api/profiles';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  profileId: string;
  profileName: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  profileId,
  profileName,
}: DeleteConfirmDialogProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [canDelete, setCanDelete] = React.useState(true);

  // Vérifier si le profil peut être supprimé dès l'ouverture du dialogue
  React.useEffect(() => {
    async function checkDeletion() {
      if (isOpen && profileId) {
        try {
          setLoading(true);
          const isUsed = await checkProfileUsage(profileId);
          setCanDelete(!isUsed);
          if (isUsed) {
            setError('Vous ne pouvez pas supprimer un profil de rédacteur lié à un projet existant');
          }
        } catch (err) {
          console.error('Error checking profile usage:', err);
          setError('Une erreur est survenue lors de la vérification');
        } finally {
          setLoading(false);
        }
      }
    }
    checkDeletion();
  }, [isOpen, profileId]);

  const handleConfirm = async () => {
    if (!canDelete) return;
    
    try {
      setLoading(true);
      setError(null);
      await onConfirm(profileId);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          {!error ? (
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le profil "{profileName}" ? Cette action est irréversible.
            </DialogDescription>
          ) : (
            <div className="mt-2 p-3 rounded-md bg-[rgb(var(--color-error))/0.1] border border-[rgb(var(--color-error))/0.2]">
              <p className="text-sm text-[rgb(var(--color-error))]">{error}</p>
            </div>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {!error && (
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={loading || !canDelete}
            >
              {loading ? 'Suppression...' : 'Supprimer'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}