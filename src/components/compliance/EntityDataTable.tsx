"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle2, Download, Printer, ShieldAlert, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { exportToCsv, printAuditReport } from "@/lib/exportUtils"
import { useEntities } from "@/context/EntitiesContext"

export type Entity = {
  id: string
  name: string
  razaoSocial?: string
  status: "approved" | "pending" | "rejected" | "frozen"
  riskScore: number
  documentId: string
  cnae?: string
  cidade?: string
  uf?: string
  capitalSocial?: string
  porte?: string
  abertura?: string
  socios?: string[]
}

export function EntityDataTable({ data }: { data: Entity[] }) {
  const { selectedEntity, selectEntity, updateEntityStatus, removeEntity } = useEntities()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const columns = React.useMemo<ColumnDef<Entity>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Selecionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
            aria-label="Selecionar linha"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-4 h-8 data-[state=open]:bg-accent text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome da Entidade
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-foreground text-sm">{row.getValue("name")}</div>
            {row.original.cidade && (
              <div className="text-[11px] text-muted-foreground">
                {row.original.cidade}/{row.original.uf} • {row.original.porte || "PJ"}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "documentId",
        header: "Documento / CNPJ",
        cell: ({ row }) => (
          <div className="text-muted-foreground font-mono text-xs">{row.getValue("documentId")}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status KYB",
        cell: ({ row }) => {
          const status = row.getValue("status") as string
          if (status === "approved")
            return <Badge variant="default" className="bg-emerald-600 text-white">Homologado</Badge>
          if (status === "pending")
            return <Badge variant="outline" className="text-amber-600 border-amber-500/50">Em Triagem</Badge>
          if (status === "frozen")
            return <Badge variant="destructive">Bloqueado</Badge>
          return <Badge variant="secondary">Rejeitado</Badge>
        },
      },
      {
        accessorKey: "riskScore",
        header: () => <div className="text-right">Score de Risco</div>,
        cell: ({ row }) => {
          const score = parseFloat(row.getValue("riskScore"))
          const isHighRisk = score >= 70
          return (
            <div
              className={`text-right font-mono font-bold text-xs ${
                isHighRisk ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {score}/100
            </div>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Decisão Rápida</div>,
        cell: ({ row }) => {
          const entity = row.original
          return (
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              {entity.status !== "approved" && (
                <Button
                  variant="ghost"
                  size="sm"
                  title="Aprovar / Homologar Fornecedor"
                  onClick={() => updateEntityStatus(entity.id, "approved")}
                  className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Aprovar
                </Button>
              )}
              {entity.status !== "frozen" && (
                <Button
                  variant="ghost"
                  size="sm"
                  title="Bloquear Fornecedor"
                  onClick={() => updateEntityStatus(entity.id, "frozen")}
                  className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                >
                  <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                  Bloquear
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                title="Remover da base"
                onClick={() => removeEntity(entity.id)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )
        },
      },
    ],
    [updateEntityStatus, removeEntity]
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    if (status === "all") {
      table.getColumn("status")?.setFilterValue(undefined)
    } else {
      table.getColumn("status")?.setFilterValue(status)
    }
  }

  const handleExportCsv = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const rowsToExport =
      selectedRows.length > 0
        ? selectedRows.map((r) => r.original)
        : table.getFilteredRowModel().rows.map((r) => r.original)

    exportToCsv(rowsToExport, "base_entidades_kyb", [
      { header: "ID", accessor: "id" },
      { header: "Nome / Fantasia", accessor: "name" },
      { header: "Razão Social", accessor: (item) => item.razaoSocial || item.name },
      { header: "Documento", accessor: "documentId" },
      { header: "Cidade/UF", accessor: (item) => (item.cidade ? `${item.cidade}/${item.uf}` : "—") },
      { header: "Capital Social", accessor: (item) => item.capitalSocial || "—" },
      { header: "Status de Compliance", accessor: (item) => item.status.toUpperCase() },
      { header: "Score de Risco (0-100)", accessor: "riskScore" },
    ])
  }

  const handlePrintDossier = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const rowsToExport =
      selectedRows.length > 0
        ? selectedRows.map((r) => r.original)
        : table.getFilteredRowModel().rows.map((r) => r.original)

    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>Razão Social / Entidade</th>
            <th>Documento</th>
            <th>Cidade/UF</th>
            <th>Capital Social</th>
            <th>Status KYB</th>
            <th style="text-align: right;">Risk Score</th>
          </tr>
        </thead>
        <tbody>
          ${rowsToExport
            .map(
              (item) => `
            <tr>
              <td><strong>${item.name}</strong><br/><span style="font-size:10px;color:#666;">${item.cnae || ""}</span></td>
              <td style="font-family: monospace;">${item.documentId}</td>
              <td>${item.cidade ? `${item.cidade}/${item.uf}` : "—"}</td>
              <td>${item.capitalSocial || "—"}</td>
              <td>${item.status.toUpperCase()}</td>
              <td style="text-align: right; font-weight: bold;">${item.riskScore} / 100</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `

    printAuditReport(
      "Laudo de Homologação de Fornecedores e Parceiros (Dossiê KYB)",
      `Relatório oficial contendo ${rowsToExport.length} entidade(s) auditada(s).`,
      tableHtml
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Filtrar por empresa..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-56 h-9 text-xs"
          />

          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border text-xs">
            <button
              type="button"
              onClick={() => handleStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-background shadow-xs text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos ({data.length})
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilter("approved")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === "approved"
                  ? "bg-background shadow-xs text-emerald-600 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Homologados
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilter("pending")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === "pending"
                  ? "bg-background shadow-xs text-amber-600 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Em Triagem
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilter("frozen")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === "frozen"
                  ? "bg-background shadow-xs text-destructive font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bloqueados
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-9 text-xs gap-1.5 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintDossier}
            className="h-9 text-xs gap-1.5 shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            Laudo PDF
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs uppercase font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isFocused = selectedEntity?.id === row.original.id
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => selectEntity(row.original.id)}
                    className={`cursor-pointer transition-colors ${
                      isFocused
                        ? "bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3.5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  Nenhuma entidade encontrada para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-1">
        <div className="text-xs text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <span className="font-semibold text-primary">
              {table.getFilteredSelectedRowModel().rows.length} entidade(s) selecionada(s) de{" "}
              {table.getFilteredRowModel().rows.length}
            </span>
          ) : (
            <span>
              Clique em qualquer linha para abrir o Dossiê KYB acima • Total de{" "}
              {table.getFilteredRowModel().rows.length} entidade(s)
            </span>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 text-xs"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 text-xs"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
