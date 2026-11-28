
import { useState } from 'react'
import { Search, FileText, Download, Eye, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getInvoices, updateInvoiceStatus } from '../../utils/invoiceStorage'

function InvoiceHistory() {
  const [invoices, setInvoices] = useState(() => getInvoices())
  const [search, setSearch] = useState('')

  const handleStatusChange = (invoice) => {
    const nextStatus = invoice.status === 'Paid' ? 'Unpaid' : 'Paid'

    const updatedInvoices = updateInvoiceStatus(invoice.id, nextStatus)

    setInvoices(updatedInvoices)
  }

  const getDisplayStatus = (invoice) => {
    if (invoice.status === 'Paid') return 'Paid'

    if (
      invoice.dueDate &&
      new Date(`${invoice.dueDate}T23:59:59`) < new Date()
    ) {
      return 'Overdue'
    }

    return 'Unpaid'
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const query = search.toLowerCase()

    return (
      invoice.invoiceNumber?.toLowerCase().includes(query) ||
      invoice.client?.toLowerCase().includes(query)
    )
  })

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(Number(amount || 0))
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#173B5E]/50">
            WORKSPACE / INVOICES
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#173B5E]">
            Invoice History
          </h1>

          <p className="mt-2 text-[#173B5E]/60">
            View and manage your previously created invoices.
          </p>
        </div>

        <Link
          to="/workspace/create-invoice"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173B5E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#244F75]"
        >
          <Plus size={18} />
          Create Invoice
        </Link>
      </div>

      {/* Search */}
      <div className="mt-9 flex items-center gap-3 rounded-xl border border-[#173B5E]/10 bg-white px-4 py-3">
        <Search size={19} className="text-[#173B5E]/40" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice number or client..."
          className="w-full bg-transparent text-sm text-[#173B5E] outline-none placeholder:text-[#173B5E]/40"
        />
      </div>

      {/* Invoice table */}
      <div className="mt-7 overflow-hidden rounded-2xl border border-[#173B5E]/10 bg-white">

        <div className="border-b border-[#173B5E]/10 px-6 py-5">
          <h2 className="font-bold text-[#173B5E]">
            All invoices
          </h2>

          <p className="mt-1 text-sm text-[#173B5E]/50">
            {filteredInvoices.length} invoices
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">

            <thead className="bg-[#F5F8FB] text-xs uppercase tracking-wider text-[#173B5E]/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => {
                const status = getDisplayStatus(invoice)

                return (
                  <tr
                    key={invoice.id}
                    className="border-t border-[#173B5E]/10 transition hover:bg-[#F8FAFC]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#EAF4FC] p-2 text-[#173B5E]">
                          <FileText size={18} />
                        </div>

                        <span className="text-sm font-bold text-[#173B5E]">
                          {invoice.invoiceNumber}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-[#173B5E]">
                      {invoice.client || '—'}
                    </td>

                    <td className="px-6 py-5 text-sm text-[#173B5E]/60">
                      {formatDate(invoice.issueDate)}
                    </td>

                    <td className="px-6 py-5 text-sm font-bold text-[#173B5E]">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={status} />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="View invoice"
                          disabled
                          className="cursor-not-allowed rounded-lg p-2 text-[#173B5E]/30"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Download invoice"
                          disabled
                          className="cursor-not-allowed rounded-lg p-2 text-[#173B5E]/30"
                        >
                          <Download size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(invoice)}
                          className="rounded-lg bg-[#173B5E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#24547F]"
                        >
                          {status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FC] text-[#173B5E]">
                      <FileText size={25} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#173B5E]">
                      {search ? 'No matching invoices' : 'No invoices yet'}
                    </h3>

                    <p className="mt-2 text-sm text-[#173B5E]/50">
                      {search
                        ? 'Try searching with another invoice number or client.'
                        : 'Your generated invoices will appear here.'}
                    </p>

                    {!search && (
                      <Link
                        to="/workspace/create-invoice"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#173B5E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#244F75]"
                      >
                        <Plus size={17} />
                        Create your first invoice
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#173B5E]/45">
        Your invoices are currently saved in this browser.
      </p>

    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Paid: 'bg-green-50 text-green-700',
    Unpaid: 'bg-amber-50 text-amber-700',
    Overdue: 'bg-red-50 text-red-700',
  }

  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${styles[status] || styles.Unpaid}`}>
      {status || 'Unpaid'}
    </span>
  )
}

export default InvoiceHistory
