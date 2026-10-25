export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditActor {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface AuditEntity {
  id: string;
  type: string;
  name: string;
}

export interface AuditDiff {
  field: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string; // Formato ISO 8601
  actor: AuditActor;
  action: string;
  entity: AuditEntity;
  severity: AuditSeverity;
  diff?: AuditDiff[];
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}
