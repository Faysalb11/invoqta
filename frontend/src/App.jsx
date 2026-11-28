
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Dashboard from './Dashboard'
import CreateInvoice from './pages/CreateInvoice'

import WorkspaceLayout from './pages/workspace/WorkspaceLayout'
import Overview from './pages/workspace/Overview'
import InvoiceHistory from './pages/workspace/InvoiceHistory'
import ChooseTemplate from './pages/workspace/ChooseTemplate'

function ComingSoon({ title }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#173B5E]">{title}</h1>
      <p className="mt-3 text-[#173B5E]/60">
        This section is coming soon.
      </p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Dashboard />} />

        {/* Keep old links working */}
        <Route
          path="/create-invoice"
          element={<Navigate to="/workspace/choose-template" replace />}
        />

        {/* Workspace */}
        <Route path="/workspace" element={<WorkspaceLayout />}>
          <Route index element={<Overview />} />

          <Route path="choose-template" element={<ChooseTemplate />} />

          <Route path="create-invoice" element={<CreateInvoice />} />

          <Route path="invoices" element={<InvoiceHistory />} />

          <Route path="clients" element={<ComingSoon title="Clients" />} />

          <Route path="settings" element={<ComingSoon title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
