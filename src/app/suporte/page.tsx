'use client';

import React from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';

export default function SuportePage() {
  return (
    <main className="p-6 md:p-8 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <span>Módulos</span>
            <span>/</span>
            <span className="text-primary font-bold">Central de Suporte</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Suporte & Documentação Técnica
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Recursos de ajuda, canais de contato com o Compliance Officer e documentação do Regulatório UI.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border p-6 rounded-xl shadow-xs space-y-3">
            <div className="p-2.5 bg-primary/10 rounded-lg w-fit">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Documentação do Sistema</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Consulte os guias de instalação, estilização com Tailwind v4 e especificações das APIs dos componentes na pasta /docs.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-primary font-medium block">
                docs/01-installation.md
              </span>
              <span className="text-xs font-mono text-primary font-medium block">
                docs/02-theming-guide.md
              </span>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-xs space-y-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg w-fit">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Encarregado DPO & Auditoria</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Para esclarecimentos regulatórios, solicitações de exclusão LGPD ou auditoria contábil e de segurança.
            </p>
            <div className="pt-2">
              <p className="text-xs text-foreground font-medium">Email: compliance@regulatorio.internal</p>
              <p className="text-xs text-muted-foreground">SLA de Resposta: até 24 horas úteis</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-card border border-border rounded-xl shadow-xs p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Perguntas Frequentes de Conformidade</h2>

          <div className="space-y-3">
            <div className="border border-border p-3.5 rounded-lg">
              <h4 className="font-medium text-sm text-foreground">Como adicionar novos campos na validação de CNPJ?</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Acesse o arquivo src/components/compliance/KycOnboardingForm.tsx e estenda o schema Zod na propriedade cnpjSchema.
              </p>
            </div>

            <div className="border border-border p-3.5 rounded-lg">
              <h4 className="font-medium text-sm text-foreground">Como customizar a paleta de cores para minha marca?</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Edite as variáveis OKLCH em src/app/globals.css no bloco :root e .dark, ou siga o passo a passo em docs/02-theming-guide.md.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
