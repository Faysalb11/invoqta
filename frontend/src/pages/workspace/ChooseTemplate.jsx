
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import InvoiceTemplateSelector from '../../components/InvoiceTemplateSelector'

export default function ChooseTemplate() {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState('modern')

  const handleContinue = () => {
    navigate('/workspace/create-invoice', {
      state: { template: selectedTemplate },
    })
  }

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={() => navigate('/workspace')}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-[#6B7D8D] hover:text-[#173B5E]"
      >
        <ArrowLeft size={17} />
        Back to Workspace
      </button>

      <div className="mb-9">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#E97863]">
          CREATE A NEW INVOICE
        </p>

        <h1
          className="text-4xl text-[#173B5E] md:text-5xl"
          style={{ fontFamily: 'Musont, sans-serif' }}
        >
          Choose your style.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-[#6B7D8D]">
          Select a professional invoice design that represents your work.
          You can review your invoice before downloading it.
        </p>
      </div>

      <InvoiceTemplateSelector
        selectedTemplate={selectedTemplate}
        onSelect={setSelectedTemplate}
      />

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#8293A1]">
          You can change your invoice details on the next page.
        </p>

        <button
          onClick={handleContinue}
          className="flex items-center justify-center gap-3 rounded-xl bg-[#173B5E] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#244F75]"
        >
          Continue to invoice
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
