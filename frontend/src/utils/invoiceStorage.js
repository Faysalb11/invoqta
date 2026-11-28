
const STORAGE_KEY = 'invoqta_invoices'

export const getInvoices = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export const saveInvoice = (invoice) => {
  const invoices = getInvoices()

  const updatedInvoices = [
    invoice,
    ...invoices.filter(
      (item) => item.id !== invoice.id
    ),
  ]

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedInvoices)
  )

  return updatedInvoices
}


export const updateInvoiceStatus = (id, status) => {
  const invoices = getInvoices()

  const updatedInvoices = invoices.map((invoice) =>
    invoice.id === id
      ? { ...invoice, status }
      : invoice
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedInvoices)
  )

  return updatedInvoices
}
