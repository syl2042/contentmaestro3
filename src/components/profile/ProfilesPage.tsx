import React, { useState, useCallback } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfileList } from './ProfileList';
import { ProfileTable } from './ProfileTable';
import { ProfileWizard } from './ProfileWizard';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { WriterProfile } from '@/types/profile';

export function ProfilesPage() {
  const { user } = useAuth();
  const { profiles, loading, error, deleteProfile, refreshProfiles } = useProfiles(user?.id);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<WriterProfile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredProfiles = profiles.filter(profile =>
    profile.nom_profil.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.specialite_thematique.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = useCallback((id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setSelectedProfile(profile);
      setIsWizardOpen(true);
    }
  }, [profiles]);

  const handleDuplicate = useCallback((id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      const duplicatedProfile = {
        ...profile,
        id: crypto.randomUUID(),
        nom_profil: `${profile.nom_profil} (copie)`,
        traits_personnalite: [...(profile.traits_personnalite || [])]
      };
      setSelectedProfile(duplicatedProfile);
      setIsWizardOpen(true);
    }
  }, [profiles]);

  const handleDelete = useCallback((id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setSelectedProfile(profile);
      setIsDeleteDialogOpen(true);
    }
  }, [profiles]);

  const handleNewProfile = () => {
    setSelectedProfile(null);
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
    setSelectedProfile(null);
  };

  const handleProfileCreated = () => {
    refreshProfiles();
  };

  const confirmDelete = async () => {
    if (selectedProfile) {
      try {
        await deleteProfile(selectedProfile.id);
        setIsDeleteDialogOpen(false);
        setSelectedProfile(null);
        refreshProfiles();
      } catch (err) {
        console.error('Error deleting profile:', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-[rgb(var(--color-primary))]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Profils de Rédacteurs
            </h1>
          </div>
          <p className="text-base text-[rgb(var(--color-text-secondary))]">
            Créez et gérez vos profils de rédacteurs pour personnaliser la génération de contenu
          </p>
        </div>
        <Button onClick={handleNewProfile} className="gap-2">
          + Nouveau Profil
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
        <Input
          type="text"
          placeholder="Rechercher un profil..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-[400px] rounded-xl bg-[rgb(var(--color-surface))] animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-[rgb(var(--color-error))/0.1] text-[rgb(var(--color-error))]">
          Une erreur est survenue lors du chargement des profils
        </div>
      ) : (
        <ProfileList
          profiles={filteredProfiles}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}

      <ProfileWizard
        key={selectedProfile?.id || 'new'}
        isOpen={isWizardOpen}
        onClose={handleCloseWizard}
        profile={selectedProfile}
        onProfileCreated={handleProfileCreated}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        profileId={selectedProfile?.id || ''}
        profileName={selectedProfile?.nom_profil || ''}
      />
    </div>
  );
}