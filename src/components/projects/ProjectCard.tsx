import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, BarChart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROJECT_STATUSES } from '@/types/project';
import { cn } from '@/lib/utils';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from '@/contexts/AuthContext';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profiles } = useProfiles(user?.id);

  const formatDateShort = (date: string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Date invalide';
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const profile = profiles.find(p => p.id === project.profil_redacteur_id);

  return (
    <div className={cn(
      "flex flex-col h-[360px] p-6 rounded-xl bg-white",
      "shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
      "dark:bg-[rgb(var(--color-surface))] dark:border dark:border-[rgb(var(--color-border))]",
      "transition-all duration-300 hover:-translate-y-1"
    )}>
      {/* En-tête avec statut */}
      <div className="flex justify-end mb-4">
        <span className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
          project.statut === 'en_cours' && "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]",
          project.statut === 'termine' && "bg-[rgb(var(--color-success)/0.1)] text-[rgb(var(--color-success))]",
          project.statut === 'archive' && "bg-[rgb(var(--color-secondary)/0.1)] text-[rgb(var(--color-secondary))]"
        )}>
          {PROJECT_STATUSES[project.statut]}
        </span>
      </div>

      {/* Titre du projet avec hauteur fixe */}
      <div className="h-[72px] mb-4">
        <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))] line-clamp-3">
          {project.titre}
        </h3>
      </div>

      {/* Profil rédacteur avec hauteur fixe */}
      <div className="h-[48px] mb-6">
        {profile && (
          <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))] line-clamp-2">
            <User className="h-4 w-4 flex-shrink-0" />
            <span>{profile.nom_profil}</span>
          </div>
        )}
      </div>

      {/* Statistiques en colonnes */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <div className="text-sm">
            <span className="text-[rgb(var(--color-text-secondary))]">Créé le : </span>
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              {formatDateShort(project.date_creation)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <div className="text-sm">
            <span className="text-[rgb(var(--color-text-secondary))]">Contenus : </span>
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              {project.contentCount || 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <BarChart className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <div className="text-sm">
            <span className="text-[rgb(var(--color-text-secondary))]">Progression : </span>
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              {project.progression}%
            </span>
          </div>
        </div>
      </div>

      {/* Espace flexible */}
      <div className="flex-1" />

      {/* Bouton d'action */}
      <Button 
        variant="default"
        className="w-full"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        Voir les détails
      </Button>
    </div>
  );
}