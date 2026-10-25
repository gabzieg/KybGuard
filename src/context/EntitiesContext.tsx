'use client';

import React, { createContext, useContext, useState } from 'react';
import { Entity } from '@/components/compliance/EntityDataTable';
import { AuditLogEntry } from '@/types/audit';

export interface ContractItem {
  id: string;
  code: string;
  title: string;
  entityName: string;
  type: string;
  validUntil: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'in_review' | 'pending_signature' | 'expired';
}

const defaultEntities: Entity[] = [
  {
    id: 'ent-1',
    name: 'TechCorp Solutions Ltda.',
    razaoSocial: 'TECHCORP SOLUTIONS TECNOLOGIA E SISTEMAS LTDA',
    documentId: 'CNPJ: 12.345.678/0001-90',
    status: 'pending',
    riskScore: 78,
    cnae: 'Desenvolvimento de programas de computador sob encomenda',
    cidade: 'São Paulo',
    uf: 'SP',
    capitalSocial: 'R$ 450.000,00',
    porte: 'Médio Porte',
    abertura: '2019-06-14',
    socios: ['Marcos Vinícius Andrade (Sócio-Administrador)', 'Helena Costa (Sócia Cotista)'],
  },
  {
    id: 'ent-2',
    name: 'Acme Logística Integrada',
    razaoSocial: 'ACME LOGISTICA E TRANSPORTES RODOVIARIOS S.A.',
    documentId: 'CNPJ: 00.111.222/0001-33',
    status: 'approved',
    riskScore: 12,
    cnae: 'Transporte rodoviário de cargas, exceto produtos perigosos',
    cidade: 'Curitiba',
    uf: 'PR',
    capitalSocial: 'R$ 2.800.000,00',
    porte: 'Demais',
    abertura: '2014-02-10',
    socios: ['Roberto Almeida (Diretor Presidente)', 'Carla Nogueira (Diretora Financeira)'],
  },
  {
    id: 'ent-3',
    name: 'Globex Internacional S.A.',
    razaoSocial: 'GLOBEX COMERCIO EXTERIOR E IMPORTACAO S.A.',
    documentId: 'CNPJ: 44.555.666/0001-77',
    status: 'frozen',
    riskScore: 92,
    cnae: 'Comércio atacadista de matérias-primas e intermediários',
    cidade: 'Santos',
    uf: 'SP',
    capitalSocial: 'R$ 15.000,00',
    porte: 'Microempresa',
    abertura: '2025-09-01',
    socios: ['Victor Hugo Mercadante (Sócio-Administrador)'],
  },
  {
    id: 'ent-4',
    name: 'Initech Cloud Services',
    razaoSocial: 'INITECH INFRAESTRUTURA DE DADOS E CLOUD LTDA',
    documentId: 'CNPJ: 22.333.444/0001-55',
    status: 'approved',
    riskScore: 18,
    cnae: 'Tratamento de dados, provedores de serviços de aplicação e hospedagem',
    cidade: 'Florianópolis',
    uf: 'SC',
    capitalSocial: 'R$ 1.200.000,00',
    porte: 'Médio Porte',
    abertura: '2018-11-22',
    socios: ['Pedro Henrique Silva (Sócio-Administrador)'],
  },
  {
    id: 'ent-5',
    name: 'Soylent Insumos Industriais',
    razaoSocial: 'SOYLENT QUIMICA E INSUMOS INDUSTRIAIS LTDA',
    documentId: 'CNPJ: 11.222.333/0001-44',
    status: 'rejected',
    riskScore: 88,
    cnae: 'Fabricação de intermediários para fertilizantes e químicos',
    cidade: 'Campinas',
    uf: 'SP',
    capitalSocial: 'R$ 80.000,00',
    porte: 'Empresa de Pequeno Porte',
    abertura: '2022-04-18',
    socios: ['Eduardo Ramos (Sócio-Administrador)'],
  },
];

const defaultAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    actor: { id: 'usr-123', name: 'Alice Santos', role: 'Compliance Officer' },
    action: 'APPROVED_ENTITY',
    entity: { id: 'ent-2', type: 'Fornecedor KYB', name: 'Acme Logística Integrada' },
    severity: 'info',
    diff: [
      { field: 'status', oldValue: 'pending', newValue: 'approved' },
      { field: 'riskScore', oldValue: 35, newValue: 12 },
    ],
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actor: { id: 'sys-core', name: 'Motor KYB / Receita Federal', role: 'Automação' },
    action: 'SANCTION_FLAGGED',
    entity: { id: 'ent-3', type: 'Fornecedor KYB', name: 'Globex Internacional S.A.' },
    severity: 'critical',
    diff: [
      { field: 'status', oldValue: 'pending', newValue: 'frozen' },
      { field: 'riskScore', oldValue: 45, newValue: 92 },
    ],
  },
  {
    id: 'log-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    actor: { id: 'usr-402', name: 'Gabriel Ziegemann', role: 'Lead Auditor' },
    action: 'ONBOARDED_CNPJ',
    entity: { id: 'ent-4', type: 'Fornecedor KYB', name: 'Initech Cloud Services' },
    severity: 'info',
    diff: [
      { field: 'documentId', oldValue: null, newValue: 'CNPJ: 22.333.444/0001-55' },
      { field: 'status', oldValue: null, newValue: 'approved' },
    ],
  },
];

const defaultContracts: ContractItem[] = [
  {
    id: 'c-001',
    code: 'CTR-2026-089',
    title: 'Acordo de Processamento de Dados (DPA LGPD)',
    entityName: 'TechCorp Solutions Ltda.',
    type: 'Proteção de Dados / LGPD',
    validUntil: '2027-04-30',
    riskLevel: 'medium',
    status: 'in_review',
  },
  {
    id: 'c-002',
    code: 'CTR-2026-042',
    title: 'Contrato de Transporte e SLA Logístico',
    entityName: 'Acme Logística Integrada',
    type: 'Operacional / Logística',
    validUntil: '2027-12-31',
    riskLevel: 'low',
    status: 'active',
  },
  {
    id: 'c-003',
    code: 'CTR-2025-110',
    title: 'Termo de Fornecimento Internacional sob Compliance',
    entityName: 'Globex Internacional S.A.',
    type: 'Importação / Aduaneiro',
    validUntil: '2026-10-15',
    riskLevel: 'high',
    status: 'expired',
  },
  {
    id: 'c-004',
    code: 'CTR-2026-104',
    title: 'Contrato de Hospedagem Cloud e SLA de Segurança',
    entityName: 'Initech Cloud Services',
    type: 'Infraestrutura / TI',
    validUntil: '2028-01-01',
    riskLevel: 'low',
    status: 'active',
  },
];

interface EntitiesContextType {
  entities: Entity[];
  selectedEntity: Entity;
  selectEntity: (id: string) => void;
  addEntity: (newEntity: Omit<Entity, 'id'>) => Entity;
  updateEntityStatus: (id: string, newStatus: Entity['status']) => void;
  removeEntity: (id: string) => void;
  auditLogs: AuditLogEntry[];
  contracts: ContractItem[];
  addContract: (contract: Omit<ContractItem, 'id' | 'code'>) => ContractItem;
}

const EntitiesContext = createContext<EntitiesContextType>({
  entities: defaultEntities,
  selectedEntity: defaultEntities[0],
  selectEntity: () => {},
  addEntity: () => defaultEntities[0],
  updateEntityStatus: () => {},
  removeEntity: () => {},
  auditLogs: defaultAuditLogs,
  contracts: defaultContracts,
  addContract: () => defaultContracts[0],
});

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
  }
  return fallback;
}

function saveStorage<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota errors
    }
  }
}

export function EntitiesProvider({ children }: { children: React.ReactNode }) {
  const [entities, setEntities] = useState<Entity[]>(() =>
    loadStorage('regulatorio_entities_v2', defaultEntities)
  );
  const [selectedEntityId, setSelectedEntityId] = useState<string>(
    () => defaultEntities[0].id
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    loadStorage('regulatorio_audit_v2', defaultAuditLogs)
  );
  const [contracts, setContracts] = useState<ContractItem[]>(() =>
    loadStorage('regulatorio_contracts_v2', defaultContracts)
  );

  const selectedEntity =
    entities.find((e) => e.id === selectedEntityId) || entities[0] || defaultEntities[0];

  const selectEntity = (id: string) => {
    setSelectedEntityId(id);
  };

  const pushAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => {
      const updated = [newEntry, ...prev];
      saveStorage('regulatorio_audit_v2', updated);
      return updated;
    });
  };

  const addEntity = (newEntityData: Omit<Entity, 'id'>): Entity => {
    const newEntity: Entity = {
      ...newEntityData,
      id: `ent-${Date.now()}`,
    };
    setEntities((prev) => {
      const updated = [newEntity, ...prev];
      saveStorage('regulatorio_entities_v2', updated);
      return updated;
    });
    setSelectedEntityId(newEntity.id);

    pushAuditLog({
      actor: { id: 'usr-01', name: 'Analista de Compliance', role: 'KYB Desk' },
      action: 'CNPJ_ONBOARDED',
      entity: { id: newEntity.id, type: 'Entidade PJ', name: newEntity.name },
      severity: newEntity.riskScore >= 70 ? 'warning' : 'info',
      diff: [
        { field: 'documentId', oldValue: null, newValue: newEntity.documentId },
        { field: 'status', oldValue: null, newValue: newEntity.status },
        { field: 'riskScore', oldValue: null, newValue: newEntity.riskScore },
      ],
    });

    return newEntity;
  };

  const updateEntityStatus = (id: string, newStatus: Entity['status']) => {
    const target = entities.find((e) => e.id === id);
    if (!target || target.status === newStatus) return;

    const oldStatus = target.status;
    const adjustedScore =
      newStatus === 'approved'
        ? Math.min(target.riskScore, 25)
        : newStatus === 'frozen' || newStatus === 'rejected'
          ? Math.max(target.riskScore, 85)
          : target.riskScore;

    setEntities((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, status: newStatus, riskScore: adjustedScore } : e
      );
      saveStorage('regulatorio_entities_v2', updated);
      return updated;
    });

    const actionMap: Record<Entity['status'], string> = {
      approved: 'APPROVED_ENTITY',
      frozen: 'FROZEN_ENTITY',
      rejected: 'REJECTED_ENTITY',
      pending: 'REOPENED_REVIEW',
    };

    pushAuditLog({
      actor: { id: 'usr-01', name: 'Analista de Compliance', role: 'Compliance Officer' },
      action: actionMap[newStatus],
      entity: { id: target.id, type: 'Entidade PJ', name: target.name },
      severity: newStatus === 'frozen' || newStatus === 'rejected' ? 'critical' : 'info',
      diff: [
        { field: 'status', oldValue: oldStatus, newValue: newStatus },
        { field: 'riskScore', oldValue: target.riskScore, newValue: adjustedScore },
      ],
    });
  };

  const removeEntity = (id: string) => {
    const target = entities.find((e) => e.id === id);
    if (!target) return;

    setEntities((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveStorage('regulatorio_entities_v2', updated);
      return updated;
    });

    pushAuditLog({
      actor: { id: 'usr-01', name: 'Analista de Compliance', role: 'Compliance Officer' },
      action: 'REMOVED_ENTITY',
      entity: { id: target.id, type: 'Entidade PJ', name: target.name },
      severity: 'warning',
      diff: [{ field: 'status', oldValue: target.status, newValue: 'deleted' }],
    });
  };

  const addContract = (contractData: Omit<ContractItem, 'id' | 'code'>): ContractItem => {
    const num = Math.floor(100 + Math.random() * 900);
    const newContract: ContractItem = {
      ...contractData,
      id: `c-${Date.now()}`,
      code: `CTR-2026-${num}`,
    };

    setContracts((prev) => {
      const updated = [newContract, ...prev];
      saveStorage('regulatorio_contracts_v2', updated);
      return updated;
    });

    pushAuditLog({
      actor: { id: 'usr-01', name: 'Analista Jurídico', role: 'Legal & Compliance' },
      action: 'CONTRACT_REGISTERED',
      entity: { id: newContract.id, type: 'Contrato', name: `${newContract.code} (${newContract.entityName})` },
      severity: newContract.riskLevel === 'high' ? 'warning' : 'info',
      diff: [
        { field: 'title', oldValue: null, newValue: newContract.title },
        { field: 'validUntil', oldValue: null, newValue: newContract.validUntil },
      ],
    });

    return newContract;
  };

  return (
    <EntitiesContext.Provider
      value={{
        entities,
        selectedEntity,
        selectEntity,
        addEntity,
        updateEntityStatus,
        removeEntity,
        auditLogs,
        contracts,
        addContract,
      }}
    >
      {children}
    </EntitiesContext.Provider>
  );
}

export function useEntities() {
  return useContext(EntitiesContext);
}
