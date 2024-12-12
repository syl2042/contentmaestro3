/**
 * Utilitaires de validation
 */

/**
 * Valide si une chaîne est un UUID valide
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Valide si un ID est défini et est un UUID valide
 */
export function validateId(id: unknown, fieldName: string): string | null {
  if (!id) {
    return `${fieldName} est requis`;
  }
  if (typeof id !== 'string' || !isValidUUID(id)) {
    return `${fieldName} n'est pas un identifiant valide`;
  }
  return null;
}