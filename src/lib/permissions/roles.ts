export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "RECEPCAO",
  "MEDICO",
  "PACIENTE",
] as const;

export type Role = (typeof ROLES)[number];

/**
 * Tabela capability -> papéis autorizados. Cada etapa que adicionar uma
 * funcionalidade nova declara aqui quem pode acessar; a checagem real é
 * sempre no server (layout/Server Action), nunca só escondendo no menu.
 */
export const PERMISSIONS = {
  "portal-paciente": ["PACIENTE"],
  "portal-medico": ["MEDICO"],
  "painel-admin": ["SUPER_ADMIN", "ADMIN", "RECEPCAO"],
} as const satisfies Record<string, readonly Role[]>;

export type Capability = keyof typeof PERMISSIONS;

export function roleCanAccess(capability: Capability, role: Role): boolean {
  return (PERMISSIONS[capability] as readonly Role[]).includes(role);
}

/** Área (rota base) que cada papel acessa por padrão após o login. */
export const HOME_BY_ROLE: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  RECEPCAO: "/admin",
  MEDICO: "/medico",
  PACIENTE: "/portal",
};
