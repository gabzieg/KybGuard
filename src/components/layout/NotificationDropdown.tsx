'use client';

import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'aml' | 'contract' | 'kyc';
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Alerta AML em Transação',
    desc: 'Transação atípica de R$ 450.000 identificada para Globex Internacional.',
    time: 'Há 12 min',
    type: 'aml',
    read: false
  },
  {
    id: 'n-2',
    title: 'Contrato Assinado Digitalmente',
    desc: 'DPA LGPD com TechCorp Solutions finalizado com sucesso.',
    time: 'Há 1 hora',
    type: 'contract',
    read: false
  },
  {
    id: 'n-3',
    title: 'Triagem PEP Concluída',
    desc: 'Verificação em listas sancionatórias OFAC concluída sem inconformidades.',
    time: 'Há 3 horas',
    type: 'kyc',
    read: true
  }
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-full hover:bg-accent"
        aria-label="Notificações de Compliance"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div 
            role="menu"
            aria-label="Notificações de auditoria e compliance"
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-40 overflow-hidden animate-in fade-in zoom-in-95"
          >
            <div className="p-3.5 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-foreground uppercase tracking-wider">
                  Notificações de Compliance
                </span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                    {unreadCount} nova(s)
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Marcar lidas
                </button>
              )}
            </div>

            <div className="divide-y divide-border max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  role="menuitem"
                  className={`p-3.5 text-xs transition-colors hover:bg-muted/40 flex items-start gap-3 ${
                    !n.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {n.type === 'aml' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    {n.type === 'contract' && <FileText className="h-4 w-4 text-primary" />}
                    {n.type === 'kyc' && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-border bg-muted/20 text-center">
              <span className="text-[10px] text-muted-foreground italic">
                Feed sincronizado com o motor de auditoria contínua.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
