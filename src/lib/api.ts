import type { Budget, BudgetInput } from "@/types/budget"

const API_URL = import.meta.env.VITE_API_URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? `Erro ${response.status} ao comunicar com a API`)
  }

  // DELETE retorna 204 sem corpo
  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function listBudgets() {
  return request<Budget[]>("/budgets")
}

export function createBudget(data: BudgetInput) {
  return request<Budget>("/budgets", { method: "POST", body: JSON.stringify(data) })
}

export function updateBudget(id: number, data: BudgetInput) {
  return request<Budget>(`/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteBudget(id: number) {
  return request<void>(`/budgets/${id}`, { method: "DELETE" })
}

export function errorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return "Não foi possível conectar à API. Verifique se ela está rodando."
  }
  return error instanceof Error ? error.message : "Erro inesperado"
}
