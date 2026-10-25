'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search, User, LogOut, Shield, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationDropdown } from '@/components/layout/NotificationDropdown';
import { TenantSwitcher } from '@/components/layout/TenantSwitcher';

export function Topbar({ className }: { className?: string }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className={cn("h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0", className)}>
      
      {/* Lado Esquerdo: Seletor de Tenant & Busca Global */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <TenantSwitcher />

        <div className="flex-1 relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <Input 
            type="text" 
            placeholder="Busca global (CNPJ, Razão Social, ID da Transação)..." 
            className="pl-9 bg-muted/40 border-border focus-visible:ring-primary h-9 text-xs"
          />
        </div>
      </div>

      {/* Lado Direito: Ações de Usuário */}
      <div className="flex items-center gap-3 ml-4">
        <ThemeToggle />
        <NotificationDropdown />
        
        <div className="h-6 w-px bg-border mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 focus:outline-none group p-1 rounded-lg hover:bg-muted/40 transition-colors"
          >
            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="font-semibold text-foreground leading-tight">Alice Santos</span>
              <span className="text-[10px] text-muted-foreground">Compliance Officer</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground border-2 border-border shadow-xs group-hover:border-primary/50 transition-colors">
              <User className="h-4 w-4" />
            </div>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-40 p-1 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-border">
                  <p className="font-semibold text-foreground">Alice Santos</p>
                  <p className="text-[11px] text-muted-foreground truncate">alice.santos@empresa.com.br</p>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold uppercase">
                    Acesso DPO / Auditoria
                  </span>
                </div>

                <div className="p-1 space-y-0.5">
                  <Link
                    href="/configuracoes"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5" /> Políticas & Permissões
                  </Link>
                  <Link
                    href="/suporte"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <Key className="h-3.5 w-3.5" /> Chaves de API
                  </Link>
                </div>

                <div className="border-t border-border p-1">
                  <Link
                    href="/login"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors font-medium"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sair do Sistema
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </header>
  );
}
