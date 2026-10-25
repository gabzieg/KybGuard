'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, KeyRound, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('alice.santos@empresa.com.br');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-muted/20 font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-1">
            <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Regulatório UI
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Plataforma Corporativa de Compliance, Auditoria Imutável e Gestão de Riscos (BACEN / LGPD).
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com.br"
                  className="pl-9 h-10 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Senha de Acesso
                </label>
                <a href="#" className="text-[11px] text-primary hover:underline font-medium">
                  Recuperar senha?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-10 text-xs"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-10 gap-2 font-semibold shadow-xs">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Entrar no Sistema <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Single-Click Instant Demo Access */}
          <div className="pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full h-10 gap-2 text-xs font-medium border-dashed hover:border-primary/50"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Acesso Rápido de Demonstração (1 Clique)
            </Button>
          </div>

          {/* SSO Mock */}
          <div className="space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-border w-full"></div>
              <span className="bg-card px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                ou autentique via SSO Corporativo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button 
                variant="outline" 
                size="sm" 
                type="button" 
                onClick={handleDemoLogin}
                className="h-9 text-[11px] gap-1.5"
              >
                <KeyRound className="h-3.5 w-3.5 text-blue-500" /> Microsoft Entra ID
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                type="button" 
                onClick={handleDemoLogin}
                className="h-9 text-[11px] gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Google Workspace
              </Button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center space-y-1 text-[11px] text-muted-foreground">
          <p>Ambiente seguro com criptografia de ponta a ponta (TLS 1.3 & SHA-256).</p>
          <p>© 2026 Regulatório UI • Todos os direitos reservados.</p>
        </div>

      </div>
    </div>
  );
}
