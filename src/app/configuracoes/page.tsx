'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { RbacMatrix } from '@/components/compliance/RbacMatrix';
import { RbacRole, RbacResource, RbacMapping } from '@/types/rbac';
import { Badge } from '@/components/ui/badge';

const mockRoles: RbacRole[] = [
  { id: 'admin', name: 'Administrador', description: 'Acesso total a relatórios e configurações' },
  { id: 'auditor', name: 'Auditor Externo', description: 'Leitura global imutável para compliance' },
  { id: 'manager', name: 'Gerente de Compliance', description: 'Aprovações e triagem de risco' },
  { id: 'viewer', name: 'Analista Júnior', description: 'Acesso restrito para consulta' }
];

const mockResources: RbacResource[] = [
  { id: 'contracts', name: 'Contratos & Termos', description: 'Documentos jurídicos e DPAs' },
  { id: 'transactions', name: 'Transações & AML', description: 'Monitoramento financeiro' },
  { id: 'users', name: 'Gestão de Usuários', description: 'Controle de acessos e cargos' },
  { id: 'logs', name: 'Trilha de Auditoria', description: 'Registros imutáveis de segurança' }
];

const mockMappings: RbacMapping[] = [
  { roleId: 'admin', resourceId: 'contracts', level: 'full' },
  { roleId: 'admin', resourceId: 'transactions', level: 'full' },
  { roleId: 'admin', resourceId: 'users', level: 'full' },
  { roleId: 'admin', resourceId: 'logs', level: 'read' },
  { roleId: 'auditor', resourceId: 'contracts', level: 'read' },
  { roleId: 'auditor', resourceId: 'transactions', level: 'read' },
  { roleId: 'auditor', resourceId: 'users', level: 'read' },
  { roleId: 'auditor', resourceId: 'logs', level: 'read' },
  { roleId: 'manager', resourceId: 'contracts', level: 'write' },
  { roleId: 'manager', resourceId: 'transactions', level: 'full' },
  { roleId: 'manager', resourceId: 'users', level: 'none' },
  { roleId: 'manager', resourceId: 'logs', level: 'read' },
  { roleId: 'viewer', resourceId: 'contracts', level: 'none' },
  { roleId: 'viewer', resourceId: 'transactions', level: 'read' },
  { roleId: 'viewer', resourceId: 'users', level: 'none' },
  { roleId: 'viewer', resourceId: 'logs', level: 'none' }
];

export default function ConfiguracoesPage() {
  return (
    <main className="p-6 md:p-8 lg:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <span>Módulos</span>
            <span>/</span>
            <span className="text-primary font-bold">Configurações</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Governança, Políticas e Acessos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie perfis de permissão RBAC, diretrizes regulatórias e parâmetros de segurança da informação.
          </p>
        </div>

        {/* RBAC Matrix Section */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              Matriz de Controle de Acesso Baseado em Funções (RBAC)
            </h2>
            <p className="text-xs text-muted-foreground">
              Define os níveis de privilégio (Total, Escrita, Leitura ou Nenhum) para cada papel do sistema.
            </p>
          </div>
          <RbacMatrix 
            roles={mockRoles} 
            resources={mockResources} 
            mappings={mockMappings} 
          />
        </section>

        {/* Policies and Governance */}
        <section className="bg-card border border-border rounded-xl shadow-xs p-6 space-y-6">
          <h2 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            Políticas de Conformidade Regulamentar Ativas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border p-4 rounded-lg bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-sm">Resolução BACEN 3.978 (PLD/CFT)</span>
                <Badge variant="default" className="bg-emerald-600 text-white">Ativa</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Regras de checagem compulsória de PEP, listas OFAC e guarda de logs por prazo mínimo de 5 anos.
              </p>
            </div>

            <div className="border border-border p-4 rounded-lg bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-sm">LGPD (Lei 13.709/2018)</span>
                <Badge variant="default" className="bg-emerald-600 text-white">Ativa</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Anonimização de dados de titulares após encerramento do contrato e auditoria contínua de acessos.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
