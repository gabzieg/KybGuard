'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AuditLogEntry, AuditSeverity } from '@/types/audit';
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronRight, Clock, User, Box } from 'lucide-react';

interface AuditTimelineProps {
  logs: AuditLogEntry[];
  className?: string;
}

const severityConfig: Record<AuditSeverity, { icon: React.ElementType, colorClass: string, bgClass: string, borderClass: string }> = {
  info: { icon: Info, colorClass: 'text-slate-500', bgClass: 'bg-slate-50', borderClass: 'border-slate-200' },
  warning: { icon: AlertTriangle, colorClass: 'text-amber-600', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' },
  critical: { icon: AlertCircle, colorClass: 'text-red-600', bgClass: 'bg-red-50', borderClass: 'border-red-200' },
};

export function AuditTimeline({ logs, className }: AuditTimelineProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className={cn("text-sm text-slate-500 p-4 text-center border border-dashed border-slate-300 rounded-md", className)}>
        Nenhum registro de auditoria encontrado.
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col space-y-0', className)} role="feed" aria-busy="false">
      {logs.map((log, index) => (
        <AuditTimelineItem 
          key={log.id} 
          log={log} 
          isLast={index === logs.length - 1} 
        />
      ))}
    </div>
  );
}

function AuditTimelineItem({ log, isLast }: { log: AuditLogEntry; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[log.severity];
  const Icon = config.icon;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  return (
    <div className="relative flex gap-4 w-full group">
      {/* Indicador visual de linha e ícone */}
      <div className="flex flex-col items-center">
        <div 
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-full border shadow-sm z-10 transition-colors", 
            config.bgClass, 
            config.colorClass, 
            config.borderClass
          )}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </div>
        {!isLast && (
          <div className="w-px h-full bg-slate-200 group-hover:bg-slate-300 transition-colors my-1" />
        )}
      </div>

      {/* Conteúdo do Registro */}
      <div className="flex-1 pb-8 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-slate-900 text-sm tracking-tight">{log.action}</span>
            <span className="text-slate-500 text-sm">em</span>
            <span className="font-medium text-slate-800 text-sm bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
              {log.entity.type}: {log.entity.name}
            </span>
          </div>
          <time className="text-xs text-slate-500 font-mono flex items-center gap-1.5 shrink-0" dateTime={log.timestamp}>
            <Clock className="h-3.5 w-3.5" />
            {new Date(log.timestamp).toLocaleString('pt-BR')}
          </time>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{log.actor.name}</span>
            <span className="text-slate-500">({log.actor.role})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Box className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-mono text-slate-500 truncate max-w-[150px]" title={log.entity.id}>
              ID: {log.entity.id}
            </span>
          </div>
        </div>

        {/* Seção de Diff Expansível */}
        {log.diff && log.diff.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              onKeyDown={handleKeyDown}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 rounded-sm"
              aria-expanded={expanded}
              aria-controls={`diff-${log.id}`}
            >
              {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              {expanded ? 'Ocultar Detalhes' : 'Visualizar Alterações'}
            </button>

            {expanded && (
              <div 
                id={`diff-${log.id}`}
                className="mt-3 rounded-md border border-slate-200 bg-slate-50/50 p-4 overflow-x-auto"
                role="region"
                aria-label="Detalhes das alterações"
              >
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-2 font-semibold text-slate-700">Campo</th>
                      <th className="pb-2 font-semibold text-slate-700">Valor Anterior</th>
                      <th className="pb-2 font-semibold text-slate-700">Novo Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.diff.map((d, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/50 transition-colors">
                        <td className="py-2.5 pr-4 text-slate-800 font-medium whitespace-nowrap">{d.field}</td>
                        <td className="py-2.5 pr-4 text-red-600 line-through decoration-red-300 whitespace-nowrap">
                          {d.oldValue === null ? 'null' : String(d.oldValue)}
                        </td>
                        <td className="py-2.5 text-emerald-600 font-medium whitespace-nowrap">
                          {d.newValue === null ? 'null' : String(d.newValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
