import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Trash2, BookOpen, MessageSquare, Settings, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WriterProfile } from '@/types/profile';

interface ProfileCardProps {
  profile: WriterProfile;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProfileCard({ profile, onEdit, onDuplicate, onDelete }: ProfileCardProps) {
  return (
    <div className={cn(
      "flex flex-col h-[400px] p-6 rounded-xl bg-white",
      "shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
      "dark:bg-[rgb(var(--color-surface))] dark:border dark:border-[rgb(var(--color-border))]",
      "transition-all duration-300 hover:-translate-y-1"
    )}>
      {/* Titre et spécialité avec hauteur fixe */}
      <div className="h-[80px] mb-6">
        <h3 className="text-xl font-bold text-[rgb(var(--color-text-primary))] line-clamp-2 mb-2">
          {profile.nom_profil}
        </h3>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] line-clamp-2">
          {profile.specialite_thematique}
        </p>
      </div>

      {/* Statistiques en grille */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
            <BookOpen className="h-4 w-4" />
            <span>Style</span>
          </div>
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] mt-1 line-clamp-1">
            {profile.style_ecriture}
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
            <MessageSquare className="h-4 w-4" />
            <span>Ton</span>
          </div>
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] mt-1 line-clamp-1">
            {profile.ton}
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
            <Settings className="h-4 w-4" />
            <span>Niveau</span>
          </div>
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] mt-1 line-clamp-1">
            {profile.niveau_langage}
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
            <FileText className="h-4 w-4" />
            <span>Traits</span>
          </div>
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] mt-1">
            {profile.traits_personnalite?.length || 0}
          </p>
        </div>
      </div>

      {/* Espace flexible */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(profile.id)}
            className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))]"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDuplicate(profile.id)}
            className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))]"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(profile.id)}
            className="text-[rgb(var(--color-error))] hover:text-[rgb(var(--color-error))]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {profile.traits_personnalite && profile.traits_personnalite.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-[rgb(var(--color-border))]">
            {profile.traits_personnalite.map((trait, index) => (
              <span
                key={`${profile.id}-${trait}-${index}`}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  "bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]",
                  "transition-all duration-200"
                )}
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}