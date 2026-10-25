'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Building, ChevronDown, Check, Plus } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  badge: string;
  cnpj: string;
}

const availableTenants: Tenant[] = [
  { id: 't1', name: 'TechCorp Matriz (SP)', badge: 'Principal', cnpj: '12.345.678/0001-90' },
  { id: 't2', name: 'TechCorp Distribuição (RJ)', badge: 'Filial', cnpj: '12.345.678/0002-71' },
  { id: 't3', name: 'TechCorp Global Holdings (US)', badge: 'Offshore', cnpj: 'EIN: 84-291039' },
];

export function TenantSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant>(availableTenants[0]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Suporte a acessibilidade de teclado (Esc fecha)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Alternar organização ativa"
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted/70 transition-colors text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <Building className="h-3.5 w-3.5 text-primary" />
        <span className="font-semibold max-w-[140px] truncate">{selectedTenant.name}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div 
            role="menu"
            aria-label="Organizações auditadas"
            className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-40 p-1.5 text-xs animate-in fade-in zoom-in-95"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Alternar Organização / Filial
            </div>

            <div className="space-y-1 my-1">
              {availableTenants.map((t) => (
                <button
                  key={t.id}
                  role="menuitem"
                  onClick={() => {
                    setSelectedTenant(t);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    selectedTenant.id === t.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted/60 text-foreground'
                  }`}
                >
                  <div>
                    <div className="font-medium text-xs">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{t.cnpj}</div>
                  </div>
                  {selectedTenant.id === t.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-1 mt-1">
              <button
                type="button"
                onClick={() => {
                  alert('Onboarding multi-tenant: cadastre novas entidades no menu Entidades (KYC).');
                  setIsOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md hover:bg-muted/40 transition-colors"
              >
                <Plus className="h-3 w-3" /> Adicionar nova empresa auditada
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
