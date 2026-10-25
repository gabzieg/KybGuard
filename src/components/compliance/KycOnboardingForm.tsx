'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Search,
  Loader2,
  CheckCircle2,
  MapPin,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useEntities } from '@/context/EntitiesContext';
import { validateCnpj, formatCnpj } from '@/lib/cnpjValidator';

interface CnpjResult {
  cnpj: string;
  cleanCnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacaoCadastral: string;
  isAtiva: boolean;
  cnae: string;
  cidade: string;
  uf: string;
  porte?: string;
  capitalSocial?: string;
  abertura?: string;
  socios?: string[];
  riskScore: number;
  riskCategory: string;
  source: string;
}

export function KycOnboardingForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addEntity } = useEntities();
  const [cnpjInput, setCnpjInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cnpjData, setCnpjData] = useState<CnpjResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState(false);

  const isMountedRef = useRef(true);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    isMountedRef.current = true;
    const timers = timersRef.current;
    return () => {
      isMountedRef.current = false;
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 14);
    setCnpjInput(formatCnpj(raw));
    setErrorMsg('');
  };

  const handleSearch = async (cnpjToQuery?: string) => {
    const raw = (cnpjToQuery || cnpjInput).replace(/\D/g, '');

    if (raw.length !== 14) {
      setErrorMsg('Informe um CNPJ completo com 14 dígitos numéricos.');
      return;
    }

    if (!validateCnpj(raw)) {
      setErrorMsg('CNPJ inválido (Dígitos verificadores incorretos pelo Módulo 11 da Receita Federal).');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setCnpjData(null);

    try {
      const res = await fetch(`/api/cnpj/${raw}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao consultar CNPJ');
      }

      if (isMountedRef.current) {
        setCnpjData(data);
        if (cnpjToQuery) {
          setCnpjInput(data.cnpj);
        }
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const message = err instanceof Error ? err.message : 'Falha na consulta à base da Receita.';
        setErrorMsg(message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleFinalize = () => {
    if (!cnpjData) return;
    setIsSubmitting(true);

    const timer1 = setTimeout(() => {
      if (!isMountedRef.current) return;

      addEntity({
        name: cnpjData.nomeFantasia || cnpjData.razaoSocial,
        razaoSocial: cnpjData.razaoSocial,
        documentId: `CNPJ: ${cnpjData.cnpj}`,
        status: cnpjData.isAtiva ? 'approved' : 'rejected',
        riskScore: cnpjData.riskScore,
        cnae: cnpjData.cnae,
        cidade: cnpjData.cidade,
        uf: cnpjData.uf,
        capitalSocial: cnpjData.capitalSocial,
        porte: cnpjData.porte,
        abertura: cnpjData.abertura,
        socios: cnpjData.socios,
      });

      setIsSubmitting(false);
      setSuccessState(true);

      const timer2 = setTimeout(() => {
        if (!isMountedRef.current) return;
        setSuccessState(false);
        setCnpjInput('');
        setCnpjData(null);
        if (onSuccess) onSuccess();
      }, 900);

      timersRef.current.push(timer2);
    }, 500);

    timersRef.current.push(timer1);
  };

  const sampleCnpjs = [
    { label: 'Banco do Brasil', cnpj: '00000000000191' },
    { label: 'Petrobras', cnpj: '33000167000101' },
    { label: 'WEG Equipamentos', cnpj: '84429695000111' },
  ];

  if (successState) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">Entidade Homologada & Auditada!</h3>
        <p className="text-xs text-muted-foreground max-w-xs">
          O dossiê completo da Receita Federal (incluindo QSA e Capital Social) foi salvo na base e registrado na Trilha de Auditoria.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Consulta Automatizada na Receita Federal
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="00.000.000/0001-00"
            value={cnpjInput}
            onChange={handleCnpjChange}
            className="font-mono text-sm"
          />
          <Button
            type="button"
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="shrink-0 gap-1.5"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Consultar
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mr-1">
            <Sparkles className="h-3 w-3 text-primary" /> Testar com CNPJ real:
          </span>
          {sampleCnpjs.map((item) => (
            <button
              key={item.cnpj}
              type="button"
              onClick={() => handleSearch(item.cnpj)}
              className="text-[11px] px-2 py-0.5 rounded bg-muted hover:bg-primary/10 hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
            {errorMsg}
          </div>
        )}
      </div>

      {cnpjData && (
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                {cnpjData.source}
              </span>
              <h4 className="font-bold text-foreground text-base leading-snug mt-0.5">
                {cnpjData.nomeFantasia}
              </h4>
              <p className="text-xs text-muted-foreground">{cnpjData.razaoSocial}</p>
            </div>
            <Badge className={cnpjData.isAtiva ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}>
              {cnpjData.situacaoCadastral}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            <div className="flex items-start gap-2">
              <Briefcase className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">CNAE Principal</span>
                <span className="text-foreground font-medium">{cnpjData.cnae}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Localização</span>
                  <span className="text-foreground font-medium">
                    {cnpjData.cidade} / {cnpjData.uf}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Wallet className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Capital Social</span>
                  <span className="text-foreground font-medium">{cnpjData.capitalSocial || '—'}</span>
                </div>
              </div>
            </div>

            {cnpjData.socios && cnpjData.socios.length > 0 && (
              <div className="flex items-start gap-2 pt-1">
                <Users className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Quadro Societário (QSA)
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cnpjData.socios.map((s, i) => (
                      <span key={i} className="text-[11px] bg-background border border-border px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Score Calculado:
              </span>
              <span className="font-mono font-bold text-sm text-emerald-600">
                {cnpjData.riskScore}/100 ({cnpjData.riskCategory.toUpperCase()})
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleFinalize}
            disabled={isSubmitting}
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Building2 className="h-4 w-4" />
                Homologar e Salvar no Dossiê KYB
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
