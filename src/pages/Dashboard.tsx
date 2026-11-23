import { useEffect, useState } from "react"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import BudgetForm from "@/components/BudgetForm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteBudget, errorMessage, listBudgets } from "@/lib/api"
import { formatBRL } from "@/lib/utils"
import type { Budget, BudgetStatus } from "@/types/budget"
import { statusLabels } from "@/types/budget"

const statusVariants: Record<BudgetStatus, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "outline",
  EXCEEDED: "destructive",
}

export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Budget | null>(null)
  const [toDelete, setToDelete] = useState<Budget | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setBudgets(await listBudgets())
      } catch (error) {
        toast.error(errorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(budget: Budget) {
    setEditing(budget)
    setFormOpen(true)
  }

  function handleSaved(saved: Budget) {
    if (editing) {
      setBudgets(budgets.map((b) => (b.id === saved.id ? saved : b)))
    } else {
      setBudgets([...budgets, saved])
    }
    setFormOpen(false)
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteBudget(toDelete.id)
      setBudgets(budgets.filter((b) => b.id !== toDelete.id))
      toast.success("Orçamento excluído com sucesso")
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setToDelete(null)
    }
  }

  const totalAllocated = budgets.reduce((sum, b) => sum + Number(b.allocatedAmount), 0)
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spentAmount), 0)
  const approvedCount = budgets.filter((b) => b.status === "APPROVED").length

  const metrics = [
    { title: "Orçamentos", value: String(budgets.length) },
    { title: "Total alocado", value: formatBRL(totalAllocated) },
    { title: "Total gasto", value: formatBRL(totalSpent) },
    { title: "Aprovados", value: String(approvedCount) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">Orçamentos por departamento de cada filme.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> Novo orçamento
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader>
              <CardTitle>{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" /> Carregando orçamentos...
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">Nenhum orçamento cadastrado</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Clique em "Novo orçamento" para cadastrar o primeiro.
            </p>
            <Button onClick={openCreate}>
              <Plus /> Novo orçamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filme</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Alocado</TableHead>
                <TableHead>Gasto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.movieTitle}</TableCell>
                  <TableCell>{budget.department}</TableCell>
                  <TableCell>{formatBRL(budget.allocatedAmount)}</TableCell>
                  <TableCell>{formatBRL(budget.spentAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[budget.status]}>{statusLabels[budget.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="icon" onClick={() => openEdit(budget)}>
                      <Pencil />
                      <span className="sr-only">Editar</span>
                    </Button>{" "}
                    <Button variant="destructive" size="icon" onClick={() => setToDelete(budget)}>
                      <Trash2 />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <BudgetForm open={formOpen} onOpenChange={setFormOpen} budget={editing} onSaved={handleSaved} />

      <Dialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir orçamento</DialogTitle>
            <DialogDescription>
              Deseja excluir o orçamento de {toDelete?.department} do filme {toDelete?.movieTitle}? Essa ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
