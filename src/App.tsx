import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import AppLayout from "@/components/AppLayout"
import { Toaster } from "@/components/ui/sonner"
import Dashboard from "@/pages/Dashboard"

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </>
  )
}
