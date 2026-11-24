
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import CreateInvoice from './pages/CreateInvoice'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-invoice" element={<CreateInvoice />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
