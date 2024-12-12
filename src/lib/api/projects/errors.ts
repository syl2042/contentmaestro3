/**
 * Types d'erreurs spécifiques aux projets
 */

export class ProjectValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectValidationError';
  }
}

export class ProfileOwnershipError extends Error {
  constructor() {
    super('Le profil de rédacteur doit appartenir à l\'utilisateur');
    this.name = 'ProfileOwnershipError';
  }
}

export class ProjectCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectCreationError';
  }
}