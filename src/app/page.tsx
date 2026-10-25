'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Activity,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { KycProfileCard } from '@/components/compliance/KycProfileCard';
import { AuditTimeline } from '@/components/compliance/AuditTimeline';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { KycOnboardingForm } from '@/components/compliance/KycOnboardingForm';
import { useEntities } from '@/context/EntitiesContext';
import { AmlTransactionChart } from '@/components/analytics/AmlTransactionChart';
import { RiskDistributionChart } from '@/components/analytics/RiskDistributionChart';

export default function DashboardPage() {
  const { entities, selectedEntity, auditLogs, contracts } = useEntities();
  const [sheetOpen, setSheetOpen] = useState(false);

  const highRiskCount = entities.filter((e) => e.riskScore >= 70 || e.status === 'frozen').length;
  const activeContractsCount = contracts.filter((c) => c.status === 'active').length;
  const pendingContractsCount = contracts.filter(
    (c) => c.status === 'in_review' || c.status === 'pending_signature'
  ).length;

  return (
    <main className="p-6 md:p-8 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Central de Homologação KYB & Risco de Terceiros
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Due diligence automatizada de CNPJ na Receita Federal, monitoramento de QSA, contratos e trilha de auditoria.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2 shadow-sm">
                  <Plus className="h-4 w-4" />
                  Homologar CNPJ
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[420px] sm:w-[560px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Triagem & Onboarding de CNPJ (KYB)</SheetTitle>
                  <SheetDescription>
                    Digite o CNPJ para validar pelo Módulo 11 e consultar dados oficiais, Capital Social e Sócios (QSA) na Receita Federal.
                  </SheetDescription>
                </SheetHeader>
                <KycOnboardingForm onSuccess={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/entidades"
            className="bg-card border border-border p-5 rounded-xl shadow-xs hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Fornecedores / PJ
              </span>
              <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{entities.length}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Base ativa monitorada</span>
            </div>
          </Link>

          <Link
            href="/entidades"
            className="bg-card border border-border p-5 rounded-xl shadow-xs hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Alertas / Alto Risco
              </span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{highRiskCount}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <span>Exigem revisão ou bloqueio</span>
            </div>
          </Link>

          <Link
            href="/contratos"
            className="bg-card border border-border p-5 rounded-xl shadow-xs hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contratos Vigentes
              </span>
              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{activeContractsCount}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <span>{pendingContractsCount} em revisão / assinatura</span>
            </div>
          </Link>

          <Link
            href="/auditoria"
            className="bg-card border border-border p-5 rounded-xl shadow-xs hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Eventos Auditados
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{auditLogs.length}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Trilha imutável ativa</span>
            </div>
          </Link>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AmlTransactionChart />
          </div>
          <div>
            <RiskDistributionChart />
          </div>
        </div>

        {/* Highlighted KYC Profile */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Dossiê KYB em Foco ({selectedEntity.name})
              </h2>
              <p className="text-xs text-muted-foreground">
                Dados oficiais sincronizados e verificação de quadro societário.
              </p>
            </div>
            <Link
              href="/entidades"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Gerenciar todas as entidades <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <KycProfileCard entity={selectedEntity} />
        </section>

        {/* Recent Audit Trail */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Últimas Decisões na Trilha de Auditoria</h2>
            </div>
            <Link
              href="/auditoria"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Ver histórico completo <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
            <AuditTimeline logs={auditLogs.slice(0, 4)} />
          </div>
        </section>
      </div>
    </main>
  );
}
