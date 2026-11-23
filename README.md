# Darkhorse - Frontend de Orçamentos

SPA em React + TypeScript + shadcn/ui que consome a API REST de orçamentos da AT1 (Darkhorse API) e faz o CRUD completo.

## Tecnologias

- React 19, TypeScript (strict) e Vite
- Tailwind CSS v4 e shadcn/ui (Card, Button, Input, Label, Badge, Dialog, Table, Sonner)
- React Router DOM
- Fetch API

## Pré-requisitos

- Node.js 18+ (e pnpm ou npm)
- API da AT1 rodando em `http://localhost:3000` (veja o README do repositório da API)

## Como executar

```bash
# 1. instalar dependências
pnpm install        # ou: npm install

# 2. criar o arquivo de ambiente
cp .env.example .env

# 3. iniciar o frontend
pnpm dev            # ou: npm run dev
```

Acesse http://localhost:5173.

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API (já com `/api`) | `http://localhost:3000/api` |

## Estrutura

```
src/
  components/
    ui/            componentes do shadcn/ui
    AppLayout.tsx  layout com cabeçalho e navegação
    BudgetForm.tsx formulário (Dialog) de cadastro e edição
  lib/
    api.ts         chamadas à API (GET, POST, PUT, DELETE)
    utils.ts       cn() e formatação de moeda
  pages/
    Dashboard.tsx  métricas, listagem e exclusão
  types/
    budget.ts      interfaces TypeScript do orçamento
```

## Funcionalidades

- Listagem em tabela com métricas (total de orçamentos, alocado, gasto e aprovados)
- Cadastro e edição em modal
- Exclusão com confirmação
- Estados de loading e de lista vazia
- Toasts de sucesso e de erro
