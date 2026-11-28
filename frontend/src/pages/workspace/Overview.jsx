
import { useState } from 'react'
import {
  FilePlus,
  FileText,
  Clock3,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getInvoices } from '../../utils/invoiceStorage'

function Overview() {
  const [invoices] = useState(() => getInvoices())

  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === 'Paid'
  ).length
  const unpaidInvoices = invoices.filter(
    (invoice) => invoice.status === 'Unpaid'
  ).length

  const recentInvoices = invoices.slice(0, 5)

  const formatAmount = (amount, currency) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(Number(amount || 0))

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-[#173B5E]/50">
          WORKSPACE / OVERVIEW
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#173B5E]">
          Welcome to Invoqta.
        </h1>
        <p className="mt-2 text-[#173B5E]/65">
          Manage your invoices and keep your freelance work organized.
        </p>
      </div>

      {/* Create invoice banner */}
      <div className="flex flex-col justify-between gap-6 rounded-2xl bg-[#173B5E] p-8 text-white md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-white/60">
            READY FOR YOUR NEXT PROJECT?
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            Create a professional invoice.
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Turn your completed work into a polished PDF invoice.
          </p>
        </div>

        <Link
          to="/workspace/create-invoice"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#E97863] px-6 py-3 font-bold text-white transition hover:bg-[#d96854]"
        >
          <FilePlus size={18} />
          Create Invoice
        </Link>
      </div>

      {/* Invoice summary */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-[#173B5E]">
          Your invoices
        </h2>
        <p className="mt-1 text-sm text-[#173B5E]/55">
          A quick look at your invoicing activity.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <SummaryCard
            icon={<FileText size={21} />}
            label="Total invoices"
            value={totalInvoices}
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Paid invoices"
            value={paidInvoices}
          />

          <SummaryCard
            icon={<Clock3 size={21} />}
            label="Unpaid invoices"
            value={unpaidInvoices}
          />
        </div>
      </div>

      {/* Recent invoices */}
      <div className="mt-10 rounded-2xl border border-[#173B5E]/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-[#173B5E]">
              Recent invoices
            </h2>
            <p className="mt-1 text-sm text-[#173B5E]/50">
              Your latest created invoices.
            </p>
          </div>

          <Link
            to="/workspace/invoices"
            className="flex items-center gap-2 text-sm font-bold text-[#173B5E] transition hover:text-[#E97863]"
          >
            View history
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="mt-5 divide-y divide-[#173B5E]/10">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#EAF4FC] p-2 text-[#173B5E]">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#173B5E]">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="mt-1 text-xs text-[#173B5E]/50">
                      {invoice.client || 'No client name'} · {formatDate(invoice.issueDate)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-[#173B5E]">
                    {formatAmount(invoice.amount, invoice.currency)}
                  </p>
                  <p className={`mt-1 text-xs font-semibold ${
                    invoice.status === 'Paid'
                      ? 'text-green-700'
                      : 'text-amber-700'
                  }`}>
                    {invoice.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="rounded-xl bg-[#EAF4FC] p-4 text-[#173B5E]">
              <FileText size={28} />
            </div>

            <h3 className="mt-4 font-bold text-[#173B5E]">
              No invoices yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#173B5E]/55">
              Once you create your first invoice, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#173B5E]/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#173B5E]/60">
          {label}
        </p>
        <div className="rounded-lg bg-[#EAF4FC] p-2 text-[#173B5E]">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-bold text-[#173B5E]">
        {value}
      </p>
    </div>
  )
}

export default Overview
