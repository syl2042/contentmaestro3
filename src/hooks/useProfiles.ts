import { useState, useCallback, useEffect } from 'react';
import { createProfile, updateProfile } from '@/lib/api/profiles';
import { getProfilsRedacteurs, deleteProfilRedacteur } from '@/lib/api/supabase-queries';
import type { WriterProfile, CreateProfileData } from '@/types/profile';

export function useProfiles(userId: string | undefined) {
  const [profiles, setProfiles] = useState<WriterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getProfilsRedacteurs(userId);
      setProfiles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profiles'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleCreateProfile = async (data: Omit<CreateProfileData, 'user_id'>) => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const newProfile = await createProfile({
        ...data,
        user_id: userId
      });
      
      setProfiles(prev => [newProfile, ...prev]);
      return newProfile;
    } catch (err) {
      console.error('Error in createProfile:', err);
      throw err;
    }
  };

  const handleUpdateProfile = async (id: string, data: Partial<CreateProfileData>) => {
    try {
      const updatedProfile = await updateProfile(id, data);
      setProfiles(prev => prev.map(p => p.id === id ? updatedProfile : p));
      return updatedProfile;
    } catch (err) {
      console.error('Error in updateProfile:', err);
      throw err;
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      await deleteProfilRedacteur(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error in deleteProfile:', err);
      throw err;
    }
  };

  return {
    profiles,
    loading,
    error,
    createProfile: handleCreateProfile,
    updateProfile: handleUpdateProfile,
    deleteProfile: handleDeleteProfile,
    refreshProfiles: fetchProfiles,
  };
}