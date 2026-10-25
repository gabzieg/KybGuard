'use client';

import React, { useState } from 'react';
import { Users, Plus, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { EntityDataTable } from '@/components/compliance/EntityDataTable';
import { KycProfileCard } from '@/components/compliance/KycProfileCard';
import { KycOnboardingForm } from '@/components/compliance/KycOnboardingForm';
import { Button } from '@/components/ui/button';
import { useEntities } from '@/context/EntitiesContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function EntidadesPage() {
  const { entities, selectedEntity } = useEntities();
  const [sheetOpen, setSheetOpen] = useState(false);

  const approvedCount = entities.filter((e) => e.status === 'approved').length;
  const pendingCount = entities.filter((e) => e.status === 'pending').length;
  const alertCount = entities.filter(
    (e) => e.status === 'rejected' || e.status === 'frozen'
  ).length;

  return (
    <main className="p-6 md:p-8 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              <span>Módulos</span>
              <span>/</span>
              <span className="text-primary font-bold">Entidades (KYB)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Homologação de Fornecedores & Due Diligence (KYB)
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Clique em qualquer empresa na tabela abaixo para inspecionar seu Dossiê Receita Federal, QSA e aprovar ou bloquear.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2 shadow-sm">
                  <Plus className="h-4 w-4" />
                  Consultar & Cadastrar CNPJ
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[420px] sm:w-[560px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Triagem & Onboarding de CNPJ</SheetTitle>
                  <SheetDescription>
                    Digite o CNPJ para buscar automaticamente Razão Social, CNAE, Capital Social e Sócios (QSA) na Receita Federal.
                  </SheetDescription>
                </SheetHeader>
                <KycOnboardingForm onSuccess={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Total Monitorado
              </span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{entities.length}</p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Base ativa no sistema
            </span>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Homologadas
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{approvedCount}</p>
            <span className="text-xs text-muted-foreground">Aptas para contratação</span>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Em Triagem
              </span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{pendingCount}</p>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Aguardando decisão do analista
            </span>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Bloqueadas / Rejeitadas
              </span>
              <ShieldAlert className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{alertCount}</p>
            <span className="text-xs text-destructive font-medium">
              Restrição cadastral ou risco elevado
            </span>
          </div>
        </div>

        {/* Live Selected Entity Dossier */}
        <section className="space-y-3">
          <KycProfileCard entity={selectedEntity} />
        </section>

        {/* Interactive Data Grid */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            Base de Fornecedores e Parceiros Monitorados
          </h2>
          <EntityDataTable data={entities} />
        </section>
      </div>
    </main>
  );
}
