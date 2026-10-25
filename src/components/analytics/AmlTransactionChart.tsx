'use client';

import React, { useState } from 'react';
import { Activity } from 'lucide-react';

interface DataPoint {
  label: string;
  volumeMillion: number; // Volume em R$ Milhões
  alerts: number; // Alertas AML gerados
  blocked: number; // Transações retidas
}

const dataByPeriod: Record<string, DataPoint[]> = {
  '30d': [
    { label: 'Sem 1', volumeMillion: 8.4, alerts: 4, blocked: 1 },
    { label: 'Sem 2', volumeMillion: 11.2, alerts: 7, blocked: 2 },
    { label: 'Sem 3', volumeMillion: 9.8, alerts: 3, blocked: 0 },
    { label: 'Sem 4', volumeMillion: 13.5, alerts: 6, blocked: 1 },
  ],
  '90d': [
    { label: 'Jul', volumeMillion: 28.5, alerts: 14, blocked: 3 },
    { label: 'Ago', volumeMillion: 34.2, alerts: 19, blocked: 4 },
    { label: 'Set', volumeMillion: 42.8, alerts: 12, blocked: 2 },
  ],
  '6m': [
    { label: 'Abr', volumeMillion: 21.0, alerts: 11, blocked: 2 },
    { label: 'Mai', volumeMillion: 24.5, alerts: 15, blocked: 3 },
    { label: 'Jun', volumeMillion: 26.2, alerts: 10, blocked: 1 },
    { label: 'Jul', volumeMillion: 28.5, alerts: 14, blocked: 3 },
    { label: 'Ago', volumeMillion: 34.2, alerts: 19, blocked: 4 },
    { label: 'Set', volumeMillion: 42.8, alerts: 12, blocked: 2 },
  ]
};

export function AmlTransactionChart() {
  const [period, setPeriod] = useState<'30d' | '90d' | '6m'>('6m');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = dataByPeriod[period];
  const maxVolume = Math.max(...data.map(d => d.volumeMillion)) * 1.15;
  const totalVolume = data.reduce((acc, d) => acc + d.volumeMillion, 0);
  const totalAlerts = data.reduce((acc, d) => acc + d.alerts, 0);

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-6 space-y-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-base text-foreground tracking-tight">
              Monitoramento de Transações AML & Volume Suspeito
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Volume liquidado versus alertas do motor de Prevenção à Lavagem de Dinheiro (PLD).
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border text-xs self-start sm:self-auto">
          {(['30d', '90d', '6m'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPeriod(p);
                setHoveredIndex(null);
              }}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                period === p 
                  ? 'bg-background text-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p === '30d' ? '30 dias' : p === '90d' ? '90 dias' : '6 meses'}
            </button>
          ))}
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-muted/20 border border-border p-3.5 rounded-lg text-xs">
        <div>
          <span className="text-muted-foreground block text-[11px] font-medium uppercase">Volume Monitorado</span>
          <span className="text-base font-bold font-mono text-foreground">
            R$ {totalVolume.toFixed(1)}M
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[11px] font-medium uppercase">Alertas Emitidos</span>
          <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
            {totalAlerts} flags
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-muted-foreground block text-[11px] font-medium uppercase">Taxa de Eficácia</span>
          <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
            99.98% clean
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="space-y-2 pt-2">
        <div className="relative h-56 w-full">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-border w-full"></div>
            <div className="border-b border-border w-full"></div>
            <div className="border-b border-border w-full"></div>
            <div className="border-b border-border w-full"></div>
          </div>

          {/* Bars & Interactive Columns */}
          <div className="relative h-full flex items-end justify-around gap-2 px-2 pb-6">
            {data.map((item, idx) => {
              const heightPercent = (item.volumeMillion / maxVolume) * 100;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 z-20 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap border border-border animate-in fade-in zoom-in-95 pointer-events-none">
                      <div className="font-bold">{item.label}</div>
                      <div>Volume: <strong>R$ {item.volumeMillion}M</strong></div>
                      <div className="text-amber-400 dark:text-amber-600 font-semibold">
                        Alertas: {item.alerts} ({item.blocked} retidos)
                      </div>
                    </div>
                  )}

                  {/* Top Alert Indicator dot */}
                  {item.alerts > 0 && (
                    <div 
                      className={`mb-1.5 h-2 w-2 rounded-full transition-transform ${
                        item.alerts > 12 ? 'bg-destructive ring-2 ring-destructive/30' : 'bg-amber-500'
                      } ${isHovered ? 'scale-150' : ''}`}
                    />
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 relative overflow-hidden ${
                      isHovered 
                        ? 'bg-primary opacity-100 shadow-md scale-y-105 origin-bottom' 
                        : 'bg-primary/80 hover:bg-primary opacity-90'
                    }`}
                  >
                    {/* Subtle Gradient shine */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20 pointer-events-none" />
                  </div>

                  {/* X-Axis Label */}
                  <span className={`absolute bottom-0 text-[11px] font-medium transition-colors ${
                    isHovered ? 'text-primary font-bold' : 'text-muted-foreground'
                  }`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-primary inline-block" />
              Volume Total (R$)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
              Alertas AML Identificados
            </span>
          </div>
          <span className="italic text-[10px] hidden sm:inline">
            Passe o mouse sobre as colunas para inspecionar
          </span>
        </div>
      </div>
    </div>
  );
}
