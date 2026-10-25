'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useEntities } from '@/context/EntitiesContext';

export function RiskDistributionChart() {
  const { entities } = useEntities();

  // Calcula contagens baseadas na lista viva de entidades
  const total = entities.length || 1;
  const lowRisk = entities.filter(e => e.riskScore < 40).length;
  const mediumRisk = entities.filter(e => e.riskScore >= 40 && e.riskScore < 70).length;
  const highRisk = entities.filter(e => e.riskScore >= 70 && e.riskScore < 90).length;
  const criticalRisk = entities.filter(e => e.riskScore >= 90).length;

  const lowPct = Math.round((lowRisk / total) * 100);
  const medPct = Math.round((mediumRisk / total) * 100);
  const highPct = Math.round((highRisk / total) * 100);
  const critPct = 100 - (lowPct + medPct + highPct);

  // Média ponderada da carteira
  const avgScore = Math.round(
    entities.reduce((acc, e) => acc + e.riskScore, 0) / total
  );

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-6 space-y-6 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 rounded-md">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-base text-foreground tracking-tight">
            Distribuição de Risco da Carteira
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Classificação das {total} entidades monitoradas por severidade de conformidade.
        </p>
      </div>

      {/* Visual Risk Gauge / Donut Mockup */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* SVG Donut */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="currentColor"
              className="text-muted/30"
              strokeWidth="10"
            />
            {/* Low Risk Segment (Green) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={`${lowPct * 2.38} 238`}
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            {/* Medium Risk Segment (Yellow) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeDasharray={`${medPct * 2.38} 238`}
              strokeDashoffset={`-${lowPct * 2.38}`}
              className="transition-all duration-700"
            />
            {/* High/Critical Risk Segment (Red) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="10"
              strokeDasharray={`${(highPct + critPct) * 2.38} 238`}
              strokeDashoffset={`-${(lowPct + medPct) * 2.38}`}
              className="transition-all duration-700"
            />
          </svg>

          {/* Center Info */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold font-mono text-foreground leading-none">
              {avgScore}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">
              Score Médio
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              {avgScore < 40 ? 'Saudável' : 'Atenção'}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Legend */}
      <div className="space-y-2.5 pt-2 border-t border-border text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Baixo Risco (Score &lt; 40)</span>
          </span>
          <span className="font-semibold text-foreground font-mono">
            {lowRisk} ({lowPct}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Médio Risco (Score 40-69)</span>
          </span>
          <span className="font-semibold text-foreground font-mono">
            {mediumRisk} ({medPct}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Alto Risco / Bloqueado (70+)</span>
          </span>
          <span className="font-semibold text-destructive font-mono">
            {highRisk + criticalRisk} ({highPct + critPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
