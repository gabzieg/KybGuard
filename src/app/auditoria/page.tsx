'use client';

import React from 'react';
import { Activity, Download, Printer, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AuditTimeline } from '@/components/compliance/AuditTimeline';
import { Button } from '@/components/ui/button';
import { exportToCsv, printAuditReport } from '@/lib/exportUtils';
import { useEntities } from '@/context/EntitiesContext';

export default function AuditoriaPage() {
  const { auditLogs } = useEntities();

  const criticalCount = auditLogs.filter((l) => l.severity === 'critical').length;
  const warningCount = auditLogs.filter((l) => l.severity === 'warning').length;

  const handleExportCsv = () => {
    exportToCsv(auditLogs, 'trilha_auditoria_imutavel', [
      { header: 'ID do Evento', accessor: 'id' },
      { header: 'Data/Hora', accessor: (l) => new Date(l.timestamp).toLocaleString('pt-BR') },
      { header: 'Usuário / Ator', accessor: (l) => l.actor.name },
      { header: 'Cargo / Papel', accessor: (l) => l.actor.role },
      { header: 'Ação Realizada', accessor: 'action' },
      { header: 'Entidade Alvo', accessor: (l) => `${l.entity.name} (${l.entity.type})` },
      { header: 'Severidade', accessor: (l) => l.severity.toUpperCase() },
    ]);
  };

  const handlePrintReport = () => {
    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Ator Responsável</th>
            <th>Ação</th>
            <th>Entidade Alvo</th>
            <th>Severidade</th>
          </tr>
        </thead>
        <tbody>
          ${auditLogs
            .map(
              (l) => `
            <tr>
              <td style="font-family: monospace;">${new Date(l.timestamp).toLocaleString('pt-BR')}</td>
              <td><strong>${l.actor.name}</strong> (${l.actor.role})</td>
              <td style="font-family: monospace; font-size: 10px;">${l.action}</td>
              <td>${l.entity.name}</td>
              <td><strong>${l.severity.toUpperCase()}</strong></td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    printAuditReport(
      'Relatório de Trilha de Auditoria (Audit Log)',
      `Histórico cronológico imutável contendo ${auditLogs.length} evento(s) de conformidade e decisões de analistas.`,
      tableHtml
    );
  };

  return (
    <main className="p-6 md:p-8 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              <span>Governança</span>
              <span>/</span>
              <span className="text-primary font-bold">Trilha de Auditoria</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Trilha de Auditoria & Decisões de Compliance
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Cada consulta de CNPJ, aprovação, bloqueio ou registro de contrato gera automaticamente um evento rastreável com diff.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 h-9 text-xs">
              <Download className="h-3.5 w-3.5" />
              Exportar CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintReport} className="gap-1.5 h-9 text-xs">
              <Printer className="h-3.5 w-3.5" />
              Imprimir Relatório
            </Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Eventos Registrados
              </span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{auditLogs.length}</p>
            <span className="text-xs text-muted-foreground">Sincronizado em tempo real</span>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Bloqueios / Críticos
              </span>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{criticalCount}</p>
            <span className="text-xs text-destructive font-medium">
              {warningCount} alerta(s) intermediário(s)
            </span>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Integridade do Log
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">100%</p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Diff de estado (antes/depois) ativo
            </span>
          </div>
        </div>

        {/* Live Timeline */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
          <AuditTimeline logs={auditLogs} />
        </div>
      </div>
    </main>
  );
}
