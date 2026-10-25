'use client';

import React from 'react';
import { KycProfile, SanctionCheck } from '@/types/kyc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Wallet,
  Users,
  Ban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEntities } from '@/context/EntitiesContext';
import { Entity } from '@/components/compliance/EntityDataTable';

interface KycProfileCardProps {
  profile?: KycProfile;
  entity?: Entity;
  className?: string;
}

export function KycProfileCard({ profile, entity, className }: KycProfileCardProps) {
  const { selectedEntity, updateEntityStatus } = useEntities();
  const activeEntity = entity || selectedEntity;

  const score = activeEntity ? activeEntity.riskScore : profile?.riskScore ?? 20;
  const status = activeEntity ? activeEntity.status : profile?.kycStatus ?? 'pending';
  const name = activeEntity ? activeEntity.name : profile?.fullName ?? 'Entidade';
  const razaoSocial = activeEntity?.razaoSocial || name;
  const documentId = activeEntity ? activeEntity.documentId : profile?.documentId ?? '—';
  const location = activeEntity?.cidade
    ? `${activeEntity.cidade}/${activeEntity.uf} (Brasil)`
    : profile?.countryOfOrigin ?? 'Brasil (BR)';
  const cnae = activeEntity?.cnae || 'Atividade empresarial monitorada';
  const capitalSocial = activeEntity?.capitalSocial || 'R$ —';
  const porte = activeEntity?.porte || 'PJ';
  const socios = activeEntity?.socios && activeEntity.socios.length > 0
    ? activeEntity.socios
    : ['Quadro societário validado via Receita Federal'];

  const riskCategory = score < 40 ? 'Baixo Risco' : score < 70 ? 'Médio Risco' : 'Alto Risco';

  const dynamicChecks: SanctionCheck[] = profile?.sanctionChecks || [
    {
      listName: 'Receita Federal (Situação Cadastral CNPJ)',
      status: score < 70 ? 'clean' : 'flagged',
      lastChecked: new Date().toISOString(),
    },
    {
      listName: 'CEIS / CNEP (Cadastro de Empresas Inidôneas - CGU)',
      status: status === 'frozen' || status === 'rejected' ? 'flagged' : 'clean',
      lastChecked: new Date().toISOString(),
    },
    {
      listName: 'Listas de PEP (Pessoas Politicamente Expostas) & QSA',
      status: score >= 70 ? 'under_review' : 'clean',
      lastChecked: new Date().toISOString(),
    },
    {
      listName: 'OFAC & Listas Restritivas Internacionais',
      status: 'clean',
      lastChecked: new Date().toISOString(),
    },
  ];

  const getRiskColor = (s: number) => {
    if (s < 40) return 'bg-emerald-500';
    if (s < 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getRiskLabelColor = (s: number) => {
    if (s < 40) return 'text-emerald-600 dark:text-emerald-400';
    if (s < 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSanctionBadge = (check: SanctionCheck) => {
    switch (check.status) {
      case 'clean':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> Regular
          </Badge>
        );
      case 'under_review':
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" /> Em Revisão
          </Badge>
        );
      case 'flagged':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertOctagon className="h-3 w-3" /> Alerta
          </Badge>
        );
    }
  };

  const isHighRisk = score >= 70;

  return (
    <Card className={cn('overflow-hidden border-border bg-card', className)}>
      <CardHeader className="bg-muted/30 border-b border-border pb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                Dossiê KYB Selecionado
              </span>
              {status === 'approved' && (
                <Badge className="bg-emerald-600 text-white text-[10px]">Homologado</Badge>
              )}
              {status === 'pending' && (
                <Badge variant="outline" className="text-amber-600 border-amber-500/50 text-[10px]">
                  Em Triagem
                </Badge>
              )}
              {status === 'frozen' && (
                <Badge variant="destructive" className="text-[10px]">
                  Bloqueado
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <CardTitle className="text-lg text-foreground">{name}</CardTitle>
              {status === 'approved' ? (
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              ) : status === 'frozen' ? (
                <ShieldAlert className="h-5 w-5 text-red-600" />
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{razaoSocial}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono mt-2">
              <span>{documentId}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-sans">
                <MapPin className="h-3 w-3" /> {location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-sans">
                <Wallet className="h-3 w-3" /> Capital: {capitalSocial} ({porte})
              </span>
            </div>
          </div>

          {activeEntity && (
            <div className="flex items-center gap-2">
              {status !== 'approved' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => updateEntityStatus(activeEntity.id, 'approved')}
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                  Homologar Entidade
                </Button>
              )}
              {status !== 'frozen' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateEntityStatus(activeEntity.id, 'frozen')}
                  className="h-8 text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
                >
                  <Ban className="h-3.5 w-3.5 mr-1.5" />
                  Bloquear
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Coluna 1: Risk Score & CNAE */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Score de Risco KYB</span>
                <span className={cn('text-lg font-bold font-mono', getRiskLabelColor(score))}>
                  {score}/100
                </span>
              </div>
              <Progress
                value={score}
                className="h-2 mb-2 bg-muted"
                indicatorColor={getRiskColor(score)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Classificação: <strong className="uppercase text-foreground">{riskCategory}</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>Atividade Principal (CNAE)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{cnae}</p>
            </div>

            {isHighRisk && (
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs p-2.5 rounded-lg border border-red-500/20 flex items-start gap-1.5">
                <AlertOctagon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>
                  Exige aprovação manual de segundo nível ou bloqueio preventivo antes da assinatura de contratos.
                </span>
              </div>
            )}
          </div>

          {/* Coluna 2 & 3: QSA + Listas Restritivas */}
          <div className="p-6 md:col-span-2 space-y-5">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                Quadro Societário e Administradores (QSA — Receita Federal)
              </h4>
              <div className="flex flex-wrap gap-2">
                {socios.map((socio, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-muted/60 border border-border px-2.5 py-1 rounded-md text-foreground font-medium"
                  >
                    {socio}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                Checagem Automatizada de Conformidade & Listas Restritivas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dynamicChecks.map((check, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/20"
                  >
                    <div className="flex flex-col pr-2">
                      <span className="text-xs font-medium text-foreground">{check.listName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        Verificado: {new Date(check.lastChecked).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {getSanctionBadge(check)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
