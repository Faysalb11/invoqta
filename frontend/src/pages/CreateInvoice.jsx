import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {

  ArrowLeft,

  Plus,

  Trash2,

  Download,

  CalendarDays,

  UserRound,

  BriefcaseBusiness,

  FileText,

  Clock3,

  LoaderCircle,

} from 'lucide-react'



const Field = ({ label, children, className = '' }) => (

  <div className={className}>

    <label className="mb-2 block text-sm font-medium text-[#173B5E]">

      {label}

    </label>

    {children}

  </div>

)



const SectionHeading = ({ icon: Icon, title, description }) => (

  <div className="mb-6 flex items-center gap-3">

    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FC] text-[#173B5E]">

      <Icon size={20} />

    </div>

    <div>

      <h2

        className="text-lg font-semibold text-[#173B5E]"

        style={{ fontFamily: 'Musont, sans-serif' }}

      >

        {title}

      </h2>

      {description && (

        <p className="mt-1 text-xs text-[#6B7D8D]">{description}</p>

      )}

    </div>

  </div>

)



export default function CreateInvoice() {

  const navigate = useNavigate()



  const [business, setBusiness] = useState('Faysal Studio')

  const [email, setEmail] = useState('hello@faysalstudio.com')

  const [client, setClient] = useState('')

  const [clientEmail, setClientEmail] = useState('')

  const [invoiceNumber, setInvoiceNumber] = useState('INV-001')

  const [issueDate, setIssueDate] = useState('2026-11-21')

  const [dueDate, setDueDate] = useState('2026-12-05')

  const [currency, setCurrency] = useState('USD')

  const [notes, setNotes] = useState('Thank you for trusting my work!')

  const [isGenerating, setIsGenerating] = useState(false)



  const [items, setItems] = useState([

    {

      id: 1,

      description: 'Website development',

      rate: 25,

      hours: 20,

    },

    {

      id: 2,

      description: 'UI/UX design',

      rate: 30,

      hours: 10,

    },

  ])



  const inputClass =

    'w-full rounded-xl border border-[#DCE7EF] bg-white px-4 py-3 text-sm text-[#173B5E] outline-none transition placeholder:text-[#A0AFBC] focus:border-[#173B5E] focus:ring-4 focus:ring-[#EAF4FC]'



  const subtotal = items.reduce(

    (sum, item) =>

      sum +

      Number(item.rate || 0) * Number(item.hours || 0),

    0

  )



  const formatMoney = (amount) =>

    new Intl.NumberFormat('en-US', {

      style: 'currency',

      currency,

    }).format(amount)



  const updateItem = (id, field, value) => {

    setItems((previousItems) =>

      previousItems.map((item) =>

        item.id === id ? { ...item, [field]: value } : item

      )

    )

  }



  const addWorkItem = () => {

    setItems((previousItems) => [

      ...previousItems,

      {

        id: Date.now(),

        description: '',

        rate: 0,

        hours: 1,

      },

    ])

  }



  const removeWorkItem = (id) => {

    setItems((previousItems) =>

      previousItems.filter((item) => item.id !== id)

    )

  }



  const handleDownloadPDF = async () => {

    setIsGenerating(true)



    try {

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/generate-invoice`,

        {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json',

          },

          body: JSON.stringify({

            business_name: business,

            business_email: email,

            client_name: client,

            client_email: clientEmail,

            invoice_number: invoiceNumber,

            issue_date: issueDate,

            due_date: dueDate,

            currency,

            items: items.map((item) => ({

              description: item.description,

              rate: Number(item.rate),

              hours: Number(item.hours),

            })),

            notes,

          }),

        }

      )



      if (!response.ok) {

        throw new Error('PDF generation failed')

      }



      const pdfBlob = await response.blob()

      const downloadUrl = window.URL.createObjectURL(pdfBlob)

      const link = document.createElement('a')



      link.href = downloadUrl

      link.download = `${invoiceNumber || 'invoice'}-invoice.pdf`



      document.body.appendChild(link)

      link.click()

      link.remove()



      window.URL.revokeObjectURL(downloadUrl)

    } catch (error) {

      console.error(error)

      alert('Could not generate PDF. Please check that your backend server is running.')

    } finally {

      setIsGenerating(false)

    }

  }



  return (

    <div

      className="min-h-screen bg-[#EAF4FC] text-[#173B5E]"

      style={{ fontFamily: 'Inter, sans-serif' }}

    >

      {/* Header */}

      <header className="sticky top-0 z-30 border-b border-[#DCE7EF] bg-[#EAF4FC]/95 backdrop-blur-md">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10">

          <div className="flex items-center gap-4">

            <button

              onClick={() => navigate('/')}

              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE7EF] bg-white transition hover:bg-[#F5FAFE]"

              aria-label="Back to homepage"

            >

              <ArrowLeft size={19} />

            </button>



            <div className="flex items-center gap-2">

              <div

                className="flex h-9 w-9 items-center justify-center rounded-md bg-[#173B5E] text-xl text-white"

                style={{ fontFamily: 'Mending, serif' }}

              >

                I

              </div>



              <span

                className="text-2xl text-[#173B5E]"

                style={{ fontFamily: 'Musont, sans-serif' }}

              >

                Invoqta

              </span>

            </div>

          </div>



          <div className="flex items-center gap-3">

            <span className="hidden text-sm text-[#6B7D8D] sm:block">

              Invoice workspace

            </span>



            <button

              onClick={handleDownloadPDF}

              disabled={isGenerating}

              className="flex items-center gap-2 rounded-xl bg-[#173B5E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#244F75] disabled:cursor-not-allowed disabled:opacity-60"

            >

              {isGenerating ? (

                <LoaderCircle size={17} className="animate-spin" />

              ) : (

                <Download size={17} />

              )}

              <span>

                {isGenerating ? 'Generating...' : 'Download PDF'}

              </span>

            </button>

          </div>

        </div>

      </header>



      <main className="mx-auto max-w-[1500px] px-5 py-9 md:px-10">

        {/* Page introduction */}

        <div className="mb-9">

          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#E97863]">

            YOUR INVOICING WORKSPACE

          </p>



          <h1

            className="text-4xl leading-tight text-[#173B5E] md:text-5xl"

            style={{ fontFamily: 'Musont, sans-serif' }}

          >

            Create your invoice.

          </h1>



          <p className="mt-3 max-w-xl text-sm leading-7 text-[#6B7D8D]">

            Add your work, set your rates, and create a professional invoice

            ready to send to your client.

          </p>

        </div>



        <div className="grid items-start gap-8 xl:grid-cols-[1fr_0.95fr]">

          {/* LEFT: EDITOR */}

          <div className="space-y-6">



            {/* Business information */}

            <section className="rounded-2xl border border-[#DCE7EF] bg-white p-6 shadow-sm md:p-7">

              <SectionHeading

                icon={BriefcaseBusiness}

                title="Your business"

                description="Tell your client who is providing the service."

              />



              <div className="grid gap-5 sm:grid-cols-2">

                <Field label="Business / freelancer name">

                  <input

                    className={inputClass}

                    value={business}

                    onChange={(e) => setBusiness(e.target.value)}

                    placeholder="Your business name"

                  />

                </Field>



                <Field label="Your email address">

                  <input

                    type="email"

                    className={inputClass}

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    placeholder="you@example.com"

                  />

                </Field>

              </div>

            </section>



            {/* Client information */}

            <section className="rounded-2xl border border-[#DCE7EF] bg-white p-6 shadow-sm md:p-7">

              <SectionHeading

                icon={UserRound}

                title="Client information"

                description="Who are you creating this invoice for?"

              />



              <div className="grid gap-5 sm:grid-cols-2">

                <Field label="Client name">

                  <input

                    className={inputClass}

                    value={client}

                    onChange={(e) => setClient(e.target.value)}

                    placeholder="Client or company name"

                  />

                </Field>



                <Field label="Client email">

                  <input

                    type="email"

                    className={inputClass}

                    value={clientEmail}

                    onChange={(e) => setClientEmail(e.target.value)}

                    placeholder="client@example.com"

                  />

                </Field>

              </div>

            </section>



            {/* Invoice details */}

            <section className="rounded-2xl border border-[#DCE7EF] bg-white p-6 shadow-sm md:p-7">

              <SectionHeading

                icon={CalendarDays}

                title="Invoice details"

                description="Set your invoice number, currency and dates."

              />



              <div className="grid gap-5 sm:grid-cols-2">

                <Field label="Invoice number">

                  <input

                    className={inputClass}

                    value={invoiceNumber}

                    onChange={(e) => setInvoiceNumber(e.target.value)}

                    placeholder="INV-001"

                  />

                </Field>



                <Field label="Currency">

                  <select

                    className={inputClass}

                    value={currency}

                    onChange={(e) => setCurrency(e.target.value)}

                  >

                    <option value="USD">USD — US Dollar</option>

                    <option value="EUR">EUR — Euro</option>

                    <option value="GBP">GBP — British Pound</option>

                    <option value="PKR">PKR — Pakistani Rupee</option>

                    <option value="AED">AED — UAE Dirham</option>

                  </select>

                </Field>



                <Field label="Issue date">

                  <input

                    type="date"

                    className={inputClass}

                    value={issueDate}

                    onChange={(e) => setIssueDate(e.target.value)}

                  />

                </Field>



                <Field label="Due date">

                  <input

                    type="date"

                    className={inputClass}

                    value={dueDate}

                    onChange={(e) => setDueDate(e.target.value)}

                  />

                </Field>

              </div>

            </section>



            {/* Work and services */}

            <section className="rounded-2xl border border-[#DCE7EF] bg-white p-6 shadow-sm md:p-7">

              <div className="mb-6 flex items-start justify-between gap-3">

                <SectionHeading

                  icon={Clock3}

                  title="Work & services"

                  description="Add each service, your hourly rate and hours worked."

                />

                <span className="rounded-full bg-[#EAF4FC] px-3 py-1.5 text-xs font-semibold text-[#173B5E]">

                  {items.length} items

                </span>

              </div>



              <div className="space-y-4">

                {items.map((item, index) => (

                  <div

                    key={item.id}

                    className="rounded-xl border border-[#DCE7EF] bg-[#F8FBFE] p-4 md:p-5"

                  >

                    <div className="mb-4 flex items-center justify-between">

                      <span className="text-xs font-semibold tracking-wider text-[#6B7D8D]">

                        WORK ITEM {String(index + 1).padStart(2, '0')}

                      </span>



                      <button

                        type="button"

                        onClick={() => removeWorkItem(item.id)}

                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#B66A61] transition hover:bg-[#FCEDEA]"

                        title="Remove work item"

                      >

                        <Trash2 size={17} />

                      </button>

                    </div>



                    <Field label="What work did you complete?">

                      <input

                        className={inputClass}

                        value={item.description}

                        onChange={(e) =>

                          updateItem(item.id, 'description', e.target.value)

                        }

                        placeholder="e.g. Website development"

                      />

                    </Field>



                    <div className="mt-4 grid grid-cols-2 gap-4">

                      <Field label="Hourly rate">

                        <div className="relative">

                          <input

                            type="number"

                            min="0"

                            className={inputClass}

                            value={item.rate}

                            onChange={(e) =>

                              updateItem(item.id, 'rate', e.target.value)

                            }

                          />

                        </div>

                      </Field>



                      <Field label="Total hours">

                        <input

                          type="number"

                          min="0"

                          step="0.5"

                          className={inputClass}

                          value={item.hours}

                          onChange={(e) =>

                            updateItem(item.id, 'hours', e.target.value)

                          }

                        />

                      </Field>

                    </div>



                    <div className="mt-5 flex items-center justify-between border-t border-[#DCE7EF] pt-4">

                      <span className="text-sm text-[#6B7D8D]">

                        {Number(item.hours || 0)} hours × {formatMoney(Number(item.rate || 0))}

                      </span>



                      <span className="text-lg font-semibold text-[#173B5E]">

                        {formatMoney(

                          Number(item.rate || 0) *

                          Number(item.hours || 0)

                        )}

                      </span>

                    </div>

                  </div>

                ))}

              </div>



              <button

                type="button"

                onClick={addWorkItem}

                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#173B5E]/40 bg-[#F8FBFE] px-4 py-4 text-sm font-semibold text-[#173B5E] transition hover:border-[#173B5E] hover:bg-[#EAF4FC]"

              >

                <Plus size={18} />

                Add another work item

              </button>



              <div className="mt-6 rounded-xl bg-[#173B5E] p-5 text-white">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-white/75">

                    Invoice subtotal

                  </span>

                  <span className="text-2xl font-semibold">

                    {formatMoney(subtotal)}

                  </span>

                </div>

                <p className="mt-2 text-xs text-white/60">

                  Automatically calculated from your work entries.

                </p>

              </div>

            </section>



            {/* Notes */}

            <section className="rounded-2xl border border-[#DCE7EF] bg-white p-6 shadow-sm md:p-7">

              <SectionHeading

                icon={FileText}

                title="Additional notes"

                description="Add a personal message or payment instructions."

              />



              <textarea

                className={`${inputClass} min-h-[110px] resize-y`}

                rows="4"

                value={notes}

                onChange={(e) => setNotes(e.target.value)}

                placeholder="Add a thank-you message or payment instructions..."

              />

            </section>



            {/* Mobile download button */}

            <button

              onClick={handleDownloadPDF}

              disabled={isGenerating}

              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E97863] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#D96754] disabled:cursor-not-allowed disabled:opacity-60 xl:hidden"

            >

              {isGenerating ? (

                <LoaderCircle size={18} className="animate-spin" />

              ) : (

                <Download size={18} />

              )}

              {isGenerating ? 'Generating your invoice...' : 'Download invoice PDF'}

            </button>

          </div>



          {/* RIGHT: LIVE PREVIEW */}

          <div className="xl:sticky xl:top-24">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold tracking-[0.15em] text-[#E97863]">

                  YOUR DOCUMENT

                </p>

                <h2

                  className="mt-1 text-2xl text-[#173B5E]"

                  style={{ fontFamily: 'Musont, sans-serif' }}

                >

                  Live preview

                </h2>

              </div>



              <span className="flex items-center gap-2 rounded-full border border-[#DCE7EF] bg-white px-3 py-2 text-xs font-medium text-[#477B65]">

                <span className="h-2 w-2 rounded-full bg-[#6DAB87]" />

                Updating live

              </span>

            </div>



            {/* Invoice document */}

            <div

              id="invoice-preview"

              className="overflow-hidden rounded-2xl border border-[#DCE7EF] bg-white p-5 shadow-lg sm:p-8"

            >

              {/* Invoice heading */}

              <div className="flex items-start justify-between gap-3 border-b border-[#DCE7EF] pb-7">

                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <div

                      className="flex h-9 w-9 items-center justify-center rounded-md bg-[#173B5E] text-xl text-white"

                      style={{ fontFamily: 'Mending, serif' }}

                    >

                      I

                    </div>

                    <span

                      className="text-2xl text-[#173B5E]"

                      style={{ fontFamily: 'Musont, sans-serif' }}

                    >

                      Invoqta

                    </span>

                  </div>



                  <p className="text-sm font-semibold text-[#173B5E]">

                    {business || 'Your business name'}

                  </p>

                  <p className="mt-1 break-all text-xs text-[#8293A1]">

                    {email || 'Your email address'}

                  </p>

                </div>



                <div className="text-right">

                  <h2

                    className="text-3xl text-[#173B5E]"

                    style={{ fontFamily: 'Musont, sans-serif' }}

                  >

                    INVOICE

                  </h2>

                  <p className="mt-2 text-xs text-[#8293A1]">

                    {invoiceNumber || 'INV-001'}

                  </p>

                </div>

              </div>



              {/* Client and dates */}

              <div className="grid grid-cols-2 gap-4 border-b border-[#DCE7EF] py-7">

                <div>

                  <p className="mb-3 text-[10px] font-semibold tracking-[0.15em] text-[#E97863]">

                    BILLED TO

                  </p>

                  <p className="break-words text-sm font-semibold text-[#173B5E]">

                    {client || 'Client name'}

                  </p>

                  <p className="mt-1 break-all text-xs text-[#8293A1]">

                    {clientEmail}

                  </p>

                </div>



                <div className="text-right">

                  <p className="mb-3 text-[10px] font-semibold tracking-[0.15em] text-[#E97863]">

                    INVOICE DATES

                  </p>

                  <p className="text-xs text-[#6B7D8D]">

                    Issue: {issueDate || '—'}

                  </p>

                  <p className="mt-2 text-xs text-[#6B7D8D]">

                    Due: {dueDate || '—'}

                  </p>

                </div>

              </div>



              {/* Work table */}

              <div className="overflow-x-auto py-6">

                <table className="w-full min-w-[390px] text-left">

                  <thead>

                    <tr className="border-b border-[#DCE7EF] text-[10px] font-semibold tracking-wider text-[#8293A1]">

                      <th className="pb-3 pr-2">DESCRIPTION</th>

                      <th className="px-2 pb-3 text-right">RATE</th>

                      <th className="px-2 pb-3 text-right">HOURS</th>

                      <th className="pb-3 pl-2 text-right">AMOUNT</th>

                    </tr>

                  </thead>



                  <tbody>

                    {items.map((item) => (

                      <tr

                        key={item.id}

                        className="border-b border-[#EDF2F6]"

                      >

                        <td className="py-4 pr-2 text-xs font-medium text-[#173B5E]">

                          {item.description || 'Work description'}

                        </td>

                        <td className="px-2 py-4 text-right text-xs text-[#6B7D8D]">

                          {formatMoney(Number(item.rate || 0))}

                        </td>

                        <td className="px-2 py-4 text-right text-xs text-[#6B7D8D]">

                          {item.hours || 0}

                        </td>

                        <td className="py-4 pl-2 text-right text-xs font-semibold text-[#173B5E]">

                          {formatMoney(

                            Number(item.rate || 0) *

                            Number(item.hours || 0)

                          )}

                        </td>

                      </tr>

                    ))}



                    {items.length === 0 && (

                      <tr>

                        <td

                          colSpan="4"

                          className="py-8 text-center text-xs text-[#8293A1]"

                        >

                          Your work items will appear here.

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>



              {/* Total */}

              <div className="ml-auto max-w-[250px] border-t border-[#DCE7EF] pt-5">

                <div className="flex items-center justify-between text-xs text-[#6B7D8D]">

                  <span>Subtotal</span>

                  <span>{formatMoney(subtotal)}</span>

                </div>



                <div className="mt-4 flex items-center justify-between">

                  <span className="text-sm font-semibold text-[#173B5E]">

                    Total due

                  </span>

                  <span

                    className="text-2xl text-[#E97863]"

                    style={{ fontFamily: 'Musont, sans-serif' }}

                  >

                    {formatMoney(subtotal)}

                  </span>

                </div>

              </div>



              {/* Footer notes */}

              <div className="mt-10 border-t border-[#DCE7EF] pt-6">

                <p className="text-sm font-semibold text-[#173B5E]">

                  Thank you for your business.

                </p>

                <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-[#8293A1]">

                  {notes}

                </p>



                <div className="mt-8 flex items-center justify-between border-t border-[#EDF2F6] pt-4">

                  <span

                    className="text-sm text-[#173B5E]"

                    style={{ fontFamily: 'Musont, sans-serif' }}

                  >

                    Your work. Your worth. Invoiced.

                  </span>

                  <span className="text-[10px] text-[#A0AFBC]">

                    Powered by Invoqta

                  </span>

                </div>

              </div>

            </div>



            <p className="mt-4 text-center text-xs leading-6 text-[#8293A1]">

              Your preview updates automatically as you edit your invoice.

              Download your PDF when it is ready.

            </p>



            <button

              onClick={handleDownloadPDF}

              disabled={isGenerating}

              className="mt-5 hidden w-full items-center justify-center gap-2 rounded-xl bg-[#E97863] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#D96754] disabled:cursor-not-allowed disabled:opacity-60 xl:flex"

            >

              {isGenerating ? (

                <LoaderCircle size={18} className="animate-spin" />

              ) : (

                <Download size={18} />

              )}

              {isGenerating ? 'Generating your invoice...' : 'Download invoice PDF'}

            </button>

          </div>

        </div>

      </main>

    </div>

  )

}