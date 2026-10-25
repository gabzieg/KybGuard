'use client';

import React, { useState } from 'react';
import { Download, Printer, Plus, FileCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { exportToCsv, printAuditReport } from '@/lib/exportUtils';
import { useEntities, ContractItem } from '@/context/EntitiesContext';

export default function ContratosPage() {
  const { contracts, entities, addContract } = useEntities();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [entityName, setEntityName] = useState(entities[0]?.name || '');
  const [contractType, setContractType] = useState('Prestação de Serviços / SLA');
  const [validUntil, setValidUntil] = useState('2027-12-31');
  const [riskLevel, setRiskLevel] = useState<ContractItem['riskLevel']>('low');

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addContract({
      title: title.trim(),
      entityName: entityName || entities[0]?.name || 'Fornecedor Homologado',
      type: contractType,
      validUntil,
      riskLevel,
      status: 'active',
    });

    setTitle('');
    setSheetOpen(false);
  };

  const handleExportCsv = () => {
    exportToCsv(contracts, 'relatorio_contratos_regulatorios', [
      { header: 'Código', accessor: 'code' },
      { header: 'Título do Contrato', accessor: 'title' },
      { header: 'Entidade Contratante', accessor: 'entityName' },
      { header: 'Tipo Jurídico', accessor: 'type' },
      { header: 'Vencimento', accessor: 'validUntil' },
      { header: 'Risco Regulatório', accessor: (c) => c.riskLevel.toUpperCase() },
      { header: 'Status', accessor: (c) => c.status.toUpperCase() },
    ]);
  };

  const handlePrintReport = () => {
    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Instrumento / Título</th>
            <th>Entidade</th>
            <th>Vigência</th>
            <th>Risco</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${contracts
            .map(
              (c) => `
            <tr>
              <td style="font-family: monospace;">${c.code}</td>
              <td><strong>${c.title}</strong><br/><span style="font-size:10px;color:#666;">${c.type}</span></td>
              <td>${c.entityName}</td>
              <td>${c.validUntil}</td>
              <td>${c.riskLevel.toUpperCase()}</td>
              <td>${c.status.toUpperCase()}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    printAuditReport(
      'Relatório de Contratos e Instrumentos Jurídicos Vinculados',
      `Total de ${contracts.length} instrumento(s) monitorado(s) sob governança KYB.`,
      tableHtml
    );
  };

  const getStatusBadge = (status: ContractItem['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-600 text-white">Vigente</Badge>;
      case 'in_review':
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-500/50">
            Em Revisão Jurídica
          </Badge>
        );
      case 'pending_signature':
        return <Badge variant="secondary">Aguardando Assinatura</Badge>;
      case 'expired':
        return <Badge variant="destructive">Vencido</Badge>;
    }
  };

  const getRiskBadge = (risk: ContractItem['riskLevel']) => {
    switch (risk) {
      case 'low':
        return <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Baixo</span>;
      case 'medium':
        return <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Médio</span>;
      case 'high':
        return <span className="text-xs font-semibold text-destructive">Alto</span>;
    }
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
              <span className="text-primary font-bold">Contratos & Obrigações</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Gestão de Contratos Vinculados a Fornecedores
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Controle de vigência, SLAs, DPAs (LGPD) e instrumentos jurídicos atrelados às empresas homologadas no KYB.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 h-9 text-xs">
              <Download className="h-3.5 w-3.5" />
              Exportar CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintReport} className="gap-1.5 h-9 text-xs">
              <Printer className="h-3.5 w-3.5" />
              Laudo PDF
            </Button>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="gap-1.5 h-9 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Novo Contrato
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[500px]">
                <SheetHeader>
                  <SheetTitle>Vincular Novo Instrumento Contratual</SheetTitle>
                  <SheetDescription>
                    Registre um contrato ou aditivo vinculado a uma das empresas monitoradas na sua base KYB.
                  </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleCreateContract} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Título do Instrumento / Objeto
                    </label>
                    <Input
                      required
                      placeholder="Ex: Contrato de Fornecimento de Combustível / SLA"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Empresa / Fornecedor Vinculado (Base KYB)
                    </label>
                    <select
                      value={entityName}
                      onChange={(e) => setEntityName(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
                    >
                      {entities.map((ent) => (
                        <option key={ent.id} value={ent.name}>
                          {ent.name} ({ent.documentId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Natureza Jurídica
                    </label>
                    <select
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
                    >
                      <option value="Prestação de Serviços / SLA">Prestação de Serviços / SLA</option>
                      <option value="Proteção de Dados / LGPD (DPA)">Proteção de Dados / LGPD (DPA)</option>
                      <option value="Fornecimento Contínuo / Insumos">Fornecimento Contínuo / Insumos</option>
                      <option value="Confidencialidade / NDA">Confidencialidade / NDA</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Data de Vencimento
                      </label>
                      <Input
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Grau de Risco
                      </label>
                      <select
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value as ContractItem['riskLevel'])}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
                      >
                        <option value="low">Baixo Risco</option>
                        <option value="medium">Médio Risco</option>
                        <option value="high">Alto Risco</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2 mt-4">
                    <FileCheck2 className="h-4 w-4" />
                    Registrar Contrato & Auditar
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Instrumento Contratual</th>
                  <th className="px-4 py-3">Entidade Vinculada</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Risco</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                      {item.code}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.type}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-foreground">{item.entityName}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                      {item.validUntil}
                    </td>
                    <td className="px-4 py-3.5">{getRiskBadge(item.riskLevel)}</td>
                    <td className="px-4 py-3.5 text-right">{getStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
