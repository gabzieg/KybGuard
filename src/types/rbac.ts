export type RbacRole = {
  id: string;
  name: string;
  description: string;
};

export type RbacResource = {
  id: string;
  name: string;
  description?: string;
  group?: string; // Para agrupar recursos relacionados, ex: "Contratos", "Usuários"
};

// Permissões padrão CRUD + Executar/Aprovar
export type PermissionLevel = 'none' | 'read' | 'write' | 'full';

export type RbacMapping = {
  roleId: string;
  resourceId: string;
  level: PermissionLevel;
};
