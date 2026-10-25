'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Activity, 
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard, 
      active: pathname === '/' 
    },
    { 
      name: 'Entidades (KYC)', 
      href: '/entidades', 
      icon: Users, 
      active: pathname.startsWith('/entidades') 
    },
    { 
      name: 'Contratos', 
      href: '/contratos', 
      icon: FileText, 
      active: pathname.startsWith('/contratos') 
    },
    { 
      name: 'Auditoria', 
      href: '/auditoria', 
      icon: Activity, 
      active: pathname.startsWith('/auditoria') 
    },
    { 
      name: 'Configurações', 
      href: '/configuracoes', 
      icon: Settings, 
      active: pathname.startsWith('/configuracoes') 
    },
  ];

  const isSupportActive = pathname.startsWith('/suporte');

  return (
    <aside className={cn("w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 transition-all duration-300 border-r border-slate-800", className)}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-slate-200 transition-colors">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-base leading-tight block">KybGuard</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Due Diligence PJ</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Módulos Principais
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                item.active 
                  ? "bg-slate-800 text-white font-semibold shadow-sm border border-slate-700/60" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0 transition-colors", item.active ? "text-emerald-400" : "text-slate-400")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Support */}
      <div className="p-3 border-t border-slate-800/80">
        <Link 
          href="/suporte" 
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isSupportActive
              ? "bg-slate-800 text-white font-semibold border border-slate-700/60"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          )}
        >
          <HelpCircle className={cn("h-4 w-4 shrink-0", isSupportActive ? "text-emerald-400" : "text-slate-400")} />
          <span>Central de Suporte</span>
        </Link>
      </div>
    </aside>
  );
}
