
import { Check } from 'lucide-react'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Professional navy accents and clean sections.',
    accent: '#173B5E',
    background: '#EAF4FC',
    label: 'POPULAR',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Elegant black-and-white layout.',
    accent: '#252525',
    background: '#F1F1F1',
    label: null,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Subtle colors with a distinctive style.',
    accent: '#E97863',
    background: '#FCEDE9',
    label: null,
  },
]

export default function InvoiceTemplateSelector({
  selectedTemplate,
  onSelect,
}) {
  return (
    <section className="rounded-2xl border border-[#DCE7EF] bg-white p-6 shadow-sm md:p-7">
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold tracking-[0.15em] text-[#E97863]">
          PERSONALIZE YOUR INVOICE
        </p>

        <h2
          className="text-xl font-semibold text-[#173B5E]"
          style={{ fontFamily: 'Musont, sans-serif' }}
        >
          Choose a template
        </h2>

        <p className="mt-2 text-sm text-[#8293A1]">
          Select the design that best represents your business.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              aria-pressed={isSelected}
              className={`relative rounded-xl border-2 p-3 text-left transition ${
                isSelected
                  ? 'border-[#173B5E] bg-[#F5FAFE]'
                  : 'border-[#DCE7EF] hover:border-[#9BB2C5]'
              }`}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#173B5E] text-white">
                  <Check size={15} />
                </span>
              )}

              <div
                className="mb-4 aspect-[4/5] overflow-hidden rounded-md border border-[#DCE7EF] bg-white p-3"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="h-5 w-5 rounded-sm"
                    style={{ backgroundColor: template.accent }}
                  />
                  <div
                    className="text-[9px] font-bold tracking-wider"
                    style={{ color: template.accent }}
                  >
                    INVOICE
                  </div>
                </div>

                <div className="mt-5 h-1.5 w-3/4 rounded-full bg-slate-200" />
                <div className="mt-2 h-1 w-1/2 rounded-full bg-slate-100" />

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <div className="h-8 rounded-sm" style={{ backgroundColor: template.background }} />
                  <div className="h-8 rounded-sm bg-slate-50" />
                </div>

                <div className="mt-5 space-y-2">
                  <div className="h-1 w-full rounded-full bg-slate-200" />
                  <div className="h-1 w-full rounded-full bg-slate-100" />
                  <div className="h-1 w-4/5 rounded-full bg-slate-100" />
                </div>

                <div
                  className="mt-5 ml-auto h-5 w-2/5 rounded-sm"
                  style={{ backgroundColor: template.accent }}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#173B5E]">
                  {template.name}
                </span>

                {template.label && (
                  <span className="rounded-full bg-[#EAF4FC] px-2 py-1 text-[9px] font-semibold text-[#173B5E]">
                    {template.label}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs leading-5 text-[#8293A1]">
                {template.description}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
