// TODO: Estos IDs deberían obtenerse dinámicamente del sistema
// Por ahora están hardcodeados según la respuesta del API

export const SYSTEM_ROLES = {
  USER: '68560fca89402fc12be977e1', // Rol "user" del sistema
  SUPER_ADMIN: '68560fca89402fc12be977e0' // TODO: Obtener el ID del rol superadmin
} as const;

export type SystemRoleId = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES]; 