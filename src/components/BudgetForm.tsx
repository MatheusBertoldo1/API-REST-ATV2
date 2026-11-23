import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBudget, errorMessage, updateBudget } from "@/lib/api"
import type { Budget, BudgetInput, BudgetStatus } from "@/types/budget"
import { statusLabels } from "@/types/budget"

interface BudgetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: Budget | null // null = novo orçamento
  onSaved: (budget: Budget) => void
}

interface FormState {
  movieTitle: string
  department: string
  allocatedAmount: string
  spentAmount: string
  status: BudgetStatus
}

const emptyForm: FormState = {
  movieTitle: "",
  department: "",
  allocatedAmount: "",
  spentAmount: "0",
  status: "PENDING",
}

export default function BudgetForm({ open, onOpenChange, budget, onSaved }: BudgetFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  // Preenche o formulário ao abrir (edição) ou limpa (novo)
  useEffect(() => {
    if (!open) return
    setForm(
      budget
        ? {
            movieTitle: budget.movieTitle,
            department: budget.department,
            allocatedAmount: String(Number(budget.allocatedAmount)),
            spentAmount: String(Number(budget.spentAmount)),
            status: budget.status,
          }
        : emptyForm
    )
  }, [open, budget])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const data: BudgetInput = {
      movieTitle: form.movieTitle.trim(),
      department: form.department.trim(),
      allocatedAmount: Number(form.allocatedAmount),
      spentAmount: Number(form.spentAmount),
      status: form.status,
    }

    setSaving(true)
    try {
      const saved = budget ? await updateBudget(budget.id, data) : await createBudget(data)
      toast.success(budget ? "Orçamento atualizado com sucesso" : "Orçamento criado com sucesso")
      onSaved(saved)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? "Editar orçamento" : "Novo orçamento"}</DialogTitle>
          <DialogDescription>Preencha os dados do orçamento do departamento.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="movieTitle">Filme</Label>
            <Input
              id="movieTitle"
              name="movieTitle"
              value={form.movieTitle}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="allocatedAmount">Valor alocado (R$)</Label>
              <Input
                id="allocatedAmount"
                name="allocatedAmount"
                type="number"
                min="0"
                step="0.01"
                value={form.allocatedAmount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="spentAmount">Valor gasto (R$)</Label>
              <Input
                id="spentAmount"
                name="spentAmount"
                type="number"
                min="0"
                step="0.01"
                value={form.spentAmount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {(Object.keys(statusLabels) as BudgetStatus[]).map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
