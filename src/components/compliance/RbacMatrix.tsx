'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { RbacRole, RbacResource, RbacMapping, PermissionLevel } from '@/types/rbac';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, KeySquare, X, Eye, PenLine, Settings2 } from 'lucide-react';

interface RbacMatrixProps {
  roles: RbacRole[];
  resources: RbacResource[];
  mappings: RbacMapping[];
  onPermissionChange?: (roleId: string, resourceId: string, level: PermissionLevel) => void;
  className?: string;
}

export function RbacMatrix({ roles, resources, mappings, onPermissionChange, className }: RbacMatrixProps) {
  // Helper to get current permission level
  const getPermission = (roleId: string, resourceId: string): PermissionLevel => {
    return mappings.find(m => m.roleId === roleId && m.resourceId === resourceId)?.level || 'none';
  };

  const getPermissionBadge = (level: PermissionLevel) => {
    switch (level) {
      case 'full':
        return <Badge variant="success" className="gap-1 px-1.5 py-0"><Shield className="h-3 w-3" /> Total</Badge>;
      case 'write':
        return <Badge variant="warning" className="gap-1 px-1.5 py-0"><PenLine className="h-3 w-3" /> Edição</Badge>;
      case 'read':
        return <Badge variant="secondary" className="gap-1 px-1.5 py-0"><Eye className="h-3 w-3" /> Leitura</Badge>;
      case 'none':
      default:
        return <Badge variant="outline" className="gap-1 px-1.5 py-0 text-slate-400 border-dashed border-slate-200"><X className="h-3 w-3" /> Nulo</Badge>;
    }
  };

  return (
    <div className={cn("w-full border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <KeySquare className="h-5 w-5 text-slate-600" />
          <h3 className="font-semibold text-slate-800 text-sm">Matriz de Acessos (RBAC)</h3>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
          <Settings2 className="h-3.5 w-3.5" />
          Gerenciar Permissões
        </Button>
      </div>
      
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-slate-100/90 backdrop-blur-sm p-3 font-semibold text-slate-700 border-b border-r border-slate-200 min-w-[200px] shadow-[1px_0_0_0_rgba(226,232,240,1)]">
                Recurso do Sistema
              </th>
              {roles.map(role => (
                <th key={role.id} className="p-3 font-semibold text-slate-700 border-b border-slate-200 bg-slate-50/80 min-w-[140px] text-center whitespace-nowrap">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm">{role.name}</span>
                    {role.description && <span className="text-[10px] font-normal text-slate-500">{role.description}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 p-3 border-r border-slate-200 shadow-[1px_0_0_0_rgba(226,232,240,1)]">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 text-xs">{resource.name}</span>
                    {resource.description && <span className="text-[10px] text-slate-500 mt-0.5">{resource.description}</span>}
                  </div>
                </td>
                {roles.map(role => (
                  <td key={`${resource.id}-${role.id}`} className="p-2 text-center border-l border-slate-100/50">
                    <button 
                      className="inline-flex w-full h-full items-center justify-center p-1 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 hover:bg-slate-100 transition-colors"
                      aria-label={`Alterar permissão de ${role.name} em ${resource.name}`}
                      onClick={() => {
                        // Lógica simples de rotação de estado para demonstração
                        if (onPermissionChange) {
                          const current = getPermission(role.id, resource.id);
                          const nextMap: Record<PermissionLevel, PermissionLevel> = {
                            'none': 'read',
                            'read': 'write',
                            'write': 'full',
                            'full': 'none'
                          };
                          onPermissionChange(role.id, resource.id, nextMap[current]);
                        }
                      }}
                    >
                      {getPermissionBadge(getPermission(role.id, resource.id))}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
