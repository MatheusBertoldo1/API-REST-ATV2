export type BudgetStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXCEEDED"

// A API usa DECIMAL no banco e o Sequelize devolve esses valores como string (ex: "150000.00").
export interface Budget {
  id: number
  movieTitle: string
  department: string
  allocatedAmount: string
  spentAmount: string
  status: BudgetStatus
  createdAt: string
  updatedAt: string
}

// Corpo enviado no POST e no PUT
export interface BudgetInput {
  movieTitle: string
  department: string
  allocatedAmount: number
  spentAmount: number
  status: BudgetStatus
}

export const statusLabels: Record<BudgetStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  EXCEEDED: "Estourado",
}
