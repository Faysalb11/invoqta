import { useEffect } from 'react'

import { Link } from 'react-router-dom'

import {

  ArrowRight,

  CheckCircle2,

  Clock3,

  Download,

  Eye,

  FileText,

  Plus,

  Sparkles,

  Zap,

} from 'lucide-react'



function App() {

  useEffect(() => {

    const elements = document.querySelectorAll('.reveal')



    const observer = new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add('is-visible')

            observer.unobserve(entry.target)

          }

        })

      },

      { threshold: 0.12 }

    )



    elements.forEach((element) => observer.observe(element))



    return () => observer.disconnect()

  }, [])



  const handleDemoDownload = async () => {

    const demoInvoice = {

      business_name: 'M Faysal',

      business_email: 'faysal@example.com',

      client_name: 'Bright Studio',

      client_email: 'hello@brightstudio.com',

      invoice_number: 'INV-001',

      issue_date: '2026-11-22',

      due_date: '2026-12-07',

      currency: 'USD',

      items: [

        {

          description: 'Website design',

          rate: 50,

          hours: 10,

        },

        {

          description: 'API development',

          rate: 50,

          hours: 15,

        },

      ],

      notes: 'Thank you for trusting my work!',

    }



    try {

      const response = await fetch(

        'http://127.0.0.1:8000/generate-invoice',

        {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json',

          },

          body: JSON.stringify(demoInvoice),

        }

      )



      if (!response.ok) {

        throw new Error('PDF generation failed')

      }



      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')



      link.href = url

      link.download = 'Invoqta-Demo-Invoice.pdf'

      document.body.appendChild(link)

      link.click()

      link.remove()



      window.URL.revokeObjectURL(url)

    } catch (error) {

      console.error(error)

      alert('Could not download the demo PDF. Please check your backend server.')

    }

  }



  return (

    <div className="min-h-screen overflow-hidden bg-[#EAF4FC] text-[#173B5E]">



      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&display=swap');



        @font-face {

          font-family: 'Telina';

          src: url('/fonts/Telina.woff2') format('woff2');

          font-weight: normal;

          font-display: swap;

        }



        @font-face {

          font-family: 'Mending Regular';

          src: url('/fonts/Mending-Regular.woff2') format('woff2');

          font-weight: normal;

          font-display: swap;

        }



        :root {

          --sky: #EAF4FC;

          --ocean: #173B5E;

          --coral: #E97863;

        }



        .heading-font {
  font-family: "Musont", sans-serif !important;
}



        .body-font {
  font-family: "Inter", sans-serif;
}



        .logo-letter {

          font-family: 'Mending Regular', Georgia, serif;

        }



        .interface-font {

          font-family: Inter, Arial, sans-serif;

        }



        /* Both headline words use the same entrance and exit animation */



        .word-window {

          display: inline-block;

          position: relative;

          height: 1.2em;

          min-width: 100%;

          overflow: hidden;

          vertical-align: bottom;

        }



        .animated-word {

          position: absolute;

          inset: 0;

          white-space: nowrap;

          opacity: 0;

          transform: translateY(110%);

          animation: wordEnterExit 6s ease-in-out infinite;

        }



        .word-two {

          animation-delay: 3s;

        }



        @keyframes wordEnterExit {

          0% {

            opacity: 0;

            transform: translateY(110%);

          }

          9% {

            opacity: 1;

            transform: translateY(0);

          }

          39% {

            opacity: 1;

            transform: translateY(0);

          }

          48% {

            opacity: 0;

            transform: translateY(-110%);

          }

          49%, 100% {

            opacity: 0;

            transform: translateY(110%);

          }

        }



        /* Laptop motion */



        .laptop-float {

          animation: laptopFloat 6s ease-in-out infinite;

        }



        @keyframes laptopFloat {

          0%, 100% {

            transform: translateY(0);

          }

          50% {

            transform: translateY(-12px);

          }

        }



        .notification-float {

          animation: notificationFloat 5s ease-in-out infinite;

        }



        @keyframes notificationFloat {

          0%, 100% {

            transform: translateY(0);

          }

          50% {

            transform: translateY(-7px);

          }

        }



        /* Scroll reveal */



        .reveal {

          opacity: 0;

          transform: translateY(30px);

          transition: opacity 800ms ease, transform 800ms ease;

        }



        .reveal.is-visible {

          opacity: 1;

          transform: translateY(0);

        }



        .reveal-delay-1 {

          transition-delay: 120ms;

        }



        .reveal-delay-2 {

          transition-delay: 240ms;

        }



        .reveal-delay-3 {

          transition-delay: 360ms;

        }



        /* Demo invoice annotation arrows */



        .annotation {

          position: absolute;

          z-index: 10;

          display: flex;

          align-items: center;

          gap: 7px;

          border: 1px solid rgba(23,59,94,.12);

          border-radius: 9px;

          background: white;

          padding: 9px 12px;

          color: #173B5E;

          font: 600 11px Inter, Arial, sans-serif;

          box-shadow: 0 8px 25px rgba(23,59,94,.10);

        }



        .annotation-line {

          position: absolute;

          width: 30px;

          height: 1px;

          background: #E97863;

          transform-origin: left center;

        }



        .annotation-dot {

          width: 7px;

          height: 7px;

          border-radius: 50%;

          background: #E97863;

        }



        .invoice-paper {

          box-shadow: 0 20px 65px rgba(23,59,94,.12);

        }



        @media (prefers-reduced-motion: reduce) {

          .animated-word,

          .laptop-float,

          .notification-float {

            animation: none;

          }



          .animated-word {

            opacity: 1;

            transform: none;

          }



          .word-two {

            display: none;

          }



          .reveal {

            opacity: 1;

            transform: none;

            transition: none;

          }

        }

      `}</style>



      {/* NAVIGATION */}



      <nav className="relative z-30 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 lg:px-10">



        <Link to="/" className="flex shrink-0 items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#173B5E] text-white">

            <span className="logo-letter text-3xl">I</span>

          </div>



          <span className="interface-font text-2xl font-bold tracking-tight">

            Invoqta<span className="text-[#E97863]">.</span>

          </span>

        </Link>



        
<div className="hidden items-center gap-7 rounded-md border border-[#173B5E]/15 bg-white/65 px-7 py-3 text-sm font-semibold md:flex">
  <a href="#features" className="body-font transition hover:text-[#E97863]">
    Features
  </a>

  <a href="#preview" className="body-font transition hover:text-[#E97863]">
    Preview
  </a>

  <a href="#how-it-works" className="body-font transition hover:text-[#E97863]">
    How it works
  </a>

  <a href="#get-started" className="body-font transition hover:text-[#E97863]">
    Get started
  </a>
</div>

<Link
  to="/create-invoice"
  className="body-font flex shrink-0 items-center gap-2 rounded-lg bg-[#173B5E] px-4 py-3 text-xs font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#244F75] sm:px-5 sm:text-sm"
>
  Create invoice
  <ArrowRight size={16} />
</Link>
</nav>




      {/* HERO */}



      <main className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-12 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:pt-16">



        {/* LEFT SIDE */}



        <section className="relative z-10">



          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#173B5E]/10 bg-white/60 px-4 py-2 text-xs font-bold tracking-wide">

            <Sparkles size={15} className="text-[#E97863]" />

            INVOICING MADE SIMPLE

          </div>



          <h1 className="heading-font text-6xl leading-[1.08] sm:text-7xl lg:text-[82px]">

            <span className="block">Made for</span>



            <span className="word-window mt-2 text-[#E97863]">

              <span className="animated-word">Freelancers.</span>

              <span className="animated-word word-two">Professionals.</span>

            </span>

          </h1>



          <h2 className="body-font mt-9 max-w-xl text-2xl leading-snug sm:text-3xl">

            Your work deserves a professional invoice.

          </h2>



          <p className="body-font mt-5 max-w-xl text-[17px] font-medium leading-8 text-[#173B5E]/75 sm:text-lg">

            Create a clean, professional invoice PDF in seconds.

            Enter your work, hours, and rate — Invoqta calculates

            the total and gives you a polished invoice to send

            to your client.

          </p>



          <div className="interface-font mt-9 flex flex-wrap items-center gap-4">



            <Link

              to="/create-invoice"

              className="flex items-center gap-3 rounded-lg bg-[#173B5E] px-7 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#244F75]"

            >

              Create your invoice

              <ArrowRight size={19} />

            </Link>



            <a

              href="#preview"

              className="flex items-center gap-2 rounded-lg border border-[#173B5E]/15 bg-white/60 px-6 py-4 font-bold transition hover:bg-white"

            >

              <Eye size={17} />

              Explore preview

            </a>



          </div>



          <div className="interface-font mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#173B5E]/70">

            <span className="flex items-center gap-2">

              <CheckCircle2 size={17} className="text-[#E97863]" />

              Automatic calculations

            </span>



            <span className="flex items-center gap-2">

              <CheckCircle2 size={17} className="text-[#E97863]" />

              Professional PDF

            </span>

          </div>



        </section>



        {/* RIGHT SIDE: LAPTOP */}



        <section className="relative mx-auto w-full max-w-2xl">



          <div className="absolute -right-10 top-0 h-72 w-72 rounded-full bg-[#E97863]/10 blur-3xl" />

          <div className="absolute -bottom-12 -left-10 h-72 w-72 rounded-full bg-[#173B5E]/10 blur-3xl" />



          <div className="laptop-float relative z-10">



            {/* MacBook-style laptop screen */}
            <div className="mx-auto w-full max-w-[620px] overflow-hidden rounded-t-[18px] border-[7px] border-[#263D50] bg-[#263D50] shadow-2xl shadow-[#173B5E]/20 sm:rounded-t-[22px] sm:border-[9px]">
              {/* Camera and top bezel */}
              <div className="relative flex h-3 items-center justify-center bg-[#263D50] sm:h-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[#71869A] ring-1 ring-[#40586D]" />
              </div>

              {/* Browser bar */}
              <div className="flex h-9 items-center justify-between border-b border-gray-100 bg-white px-3 sm:h-10 sm:px-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#E97863]" />
                  <span className="h-2 w-2 rounded-full bg-[#F3C66A]" />
                  <span className="h-2 w-2 rounded-full bg-[#80B99B]" />
                </div>
                <div className="rounded-md bg-[#F4F7FA] px-8 py-1 text-[9px] text-gray-400 sm:px-16 sm:text-[10px]">
                  invoqta.app
                </div>
                <span className="interface-font text-[10px] font-bold text-[#173B5E]">Invoqta</span>
              </div>

              {/* Simplified invoice workspace */}
              <div className="interface-font aspect-[16/10] bg-[#F5F8FB] p-3 sm:p-5">
                <div className="mx-auto h-full max-w-[520px] rounded-lg border border-[#E7EDF2] bg-white p-3 shadow-sm sm:rounded-xl sm:p-5">
                  <div className="flex items-start justify-between border-b border-[#EAF0F4] pb-3 sm:pb-4">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#8A9AAA] sm:text-[9px]">INVOICE</p>
                      <h3 className="mt-1 text-sm font-bold text-[#173B5E] sm:text-lg">#INV-001</h3>
                      <span className="mt-1 inline-flex rounded-full bg-[#EAF6EF] px-2 py-0.5 text-[8px] font-semibold text-[#478365] sm:text-[9px]">Ready to send</span>
                    </div>
                    <div className="text-right">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#173B5E] text-white sm:h-9 sm:w-9">
                        <span className="logo-letter text-lg sm:text-2xl">I</span>
                      </div>
                      <p className="mt-1 text-[8px] font-bold text-[#173B5E] sm:text-[10px]">Invoqta</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 sm:gap-5 sm:py-4">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-wider text-[#9AA8B5] sm:text-[9px]">From</p>
                      <p className="mt-1 text-[10px] font-bold text-[#173B5E] sm:text-xs">M Faysal</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-wider text-[#9AA8B5] sm:text-[9px]">Bill to</p>
                      <p className="mt-1 text-[10px] font-bold text-[#173B5E] sm:text-xs">Bright Studio</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-md border border-[#EAF0F4] sm:rounded-lg">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-2 bg-[#F7F9FB] px-2 py-2 text-[7px] font-semibold uppercase tracking-wide text-[#91A0AE] sm:gap-4 sm:px-3 sm:text-[8px]">
                      <span>Work description</span><span>Hours × Rate</span><span>Total</span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-t border-[#EDF1F4] px-2 py-2.5 text-[8px] text-[#526B80] sm:gap-4 sm:px-3 sm:py-3 sm:text-[10px]">
                      <span className="font-semibold text-[#173B5E]">Website design</span><span>10 × $50</span><span className="font-semibold text-[#173B5E]">$500</span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-t border-[#EDF1F4] px-2 py-2.5 text-[8px] text-[#526B80] sm:gap-4 sm:px-3 sm:py-3 sm:text-[10px]">
                      <span className="font-semibold text-[#173B5E]">API development</span><span>15 × $50</span><span className="font-semibold text-[#173B5E]">$750</span>
                    </div>
                  </div>

                  <div className="ml-auto mt-3 flex w-full max-w-[220px] items-center justify-between gap-3 border-t border-[#EAF0F4] pt-2 sm:mt-4 sm:max-w-[250px] sm:pt-3">
                    <span className="shrink-0 text-[10px] font-semibold text-[#71869A] sm:text-xs">Total due</span>
                    <span className="shrink-0 whitespace-nowrap text-lg font-extrabold tabular-nums leading-none text-[#173B5E] sm:text-lg">$1,250</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop base */}
            <div className="relative mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-2xl bg-gradient-to-b from-[#B9C7D2] to-[#758A9C] shadow-xl sm:h-4">
              <div className="mx-auto h-1 w-1/5 rounded-b-lg bg-[#8095A5]" />
            </div>



          </div>



          {/* Floating notification */}



          <div className="notification-float absolute -left-3 top-1/3 z-20 hidden rounded-xl border border-gray-100 bg-white p-4 shadow-xl sm:block">



            <div className="flex items-center gap-3">



              <div className="rounded-lg bg-[#EAF4FC] p-2 text-[#173B5E]">

                <CheckCircle2 size={20} />

              </div>



              <div>

                <p className="interface-font text-xs font-bold">

                  Invoice calculated

                </p>

                <p className="interface-font text-[10px] text-gray-400">

                  Your total is ready

                </p>

              </div>



            </div>



          </div>



        </section>



      </main>



      {/* FEATURES */}



      <section

        id="features"

        className="border-t border-[#173B5E]/10 bg-white/55 px-6 py-24"

      >



        <div className="mx-auto max-w-5xl text-center">



          <p className="interface-font text-xs font-bold uppercase tracking-[0.2em] text-[#E97863] reveal">

            BUILT FOR YOUR WORKFLOW

          </p>



          <h2 className="heading-font mt-4 text-4xl sm:text-5xl reveal">

            Less time invoicing. More time creating.

          </h2>



          <p className="body-font mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-[#173B5E]/70 sm:text-lg reveal">

            Turn your completed freelance work into a clean,

            professional invoice without the hassle of manual calculations.

          </p>



          <div className="mt-14 grid gap-5 text-left sm:grid-cols-3">



            <Feature

              icon={<Clock3 size={23} />}

              title="Track your work"

              description="Enter each task, hourly rate, and the time you spent working."

            />



            <Feature

              icon={<CheckCircle2 size={23} />}

              title="Automatic totals"

              description="Invoqta calculates each work item's subtotal and your invoice total."

            />



            <Feature

              icon={<Download size={23} />}

              title="Download PDF"

              description="Generate a polished invoice PDF that you can send to your client."

            />



          </div>



        </div>



      </section>



      {/* INVOICE PREVIEW */}



      <section

        id="preview"

        className="relative overflow-hidden bg-[#EAF4FC] px-6 py-24"

      >



        <div className="mx-auto max-w-7xl">



          <div className="mb-16 text-center">



            <p className="interface-font text-xs font-bold uppercase tracking-[0.2em] text-[#E97863] reveal">

              TAKE A CLOSER LOOK

            </p>



            <h2 className="heading-font mt-4 text-4xl sm:text-5xl reveal">

              Every detail, beautifully presented.

            </h2>



            <p className="body-font mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-[#173B5E]/70 sm:text-lg reveal">

              Explore a sample Invoqta invoice. See how your work,

              rates, hours, and final amount come together in one

              professional document.

            </p>



          </div>



          {/* Invoice and annotations */}



          <div className="relative mx-auto max-w-4xl px-2 py-8 sm:px-16 sm:py-12">



            {/* Annotation: invoice number */}



            <div className="annotation -right-1 top-3 sm:right-0 sm:top-10">

              <span className="annotation-dot" />

              Invoice number

            </div>



            {/* Annotation: freelancer */}



            <div className="annotation -left-2 top-36 sm:-left-2 sm:top-44">

              <span className="annotation-dot" />

              Freelancer details

            </div>



            {/* Annotation: work items */}



            <div className="annotation -right-2 top-[57%] sm:-right-3">

              <span className="annotation-dot" />

              Work and hourly rates

            </div>



            {/* Annotation: total */}



            <div className="annotation -left-1 bottom-12 sm:-left-2 sm:bottom-16">

              <span className="annotation-dot" />

              Final invoice total

            </div>



            {/* Invoice paper */}



            <div className="invoice-paper relative mx-auto max-w-2xl bg-white p-6 sm:p-12">



              <div className="mb-10 flex items-start justify-between border-b border-gray-100 pb-7">



                <div>

                  <div className="mb-2 flex items-center gap-2">

                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#173B5E] text-white">

                      <span className="logo-letter text-2xl">I</span>

                    </div>



                    <span className="interface-font text-xl font-extrabold tracking-tight">

                      Invoqta

                    </span>

                  </div>



                  <p className="interface-font text-[9px] font-semibold tracking-[0.2em] text-gray-400">

                    PROFESSIONAL INVOICE

                  </p>

                </div>



                <div className="text-right">

                  <p className="interface-font text-xs font-bold text-gray-400">

                    INVOICE

                  </p>

                  <p className="interface-font mt-1 text-lg font-extrabold text-[#173B5E]">

                    #INV-001

                  </p>

                </div>



              </div>



              <div className="mb-10 grid grid-cols-2 gap-6">



                <div>

                  <p className="interface-font text-[10px] font-bold uppercase tracking-wider text-gray-400">

                    From

                  </p>



                  <p className="body-font mt-2 text-lg font-bold">

                    M Faysal

                  </p>



                  <p className="body-font mt-1 text-xs text-gray-500">

                    Freelance Developer

                  </p>



                  <p className="body-font mt-1 text-xs text-gray-500">

                    faysal@example.com

                  </p>

                </div>



                <div>

                  <p className="interface-font text-[10px] font-bold uppercase tracking-wider text-gray-400">

                    Bill to

                  </p>



                  <p className="body-font mt-2 text-lg font-bold">

                    Bright Studio

                  </p>



                  <p className="body-font mt-1 text-xs text-gray-500">

                    hello@brightstudio.com

                  </p>

                </div>



              </div>



              <div className="mb-8 grid grid-cols-2 gap-6 border-y border-gray-100 py-5">



                <div>

                  <p className="interface-font text-[9px] font-bold uppercase text-gray-400">

                    Issue date

                  </p>

                  <p className="body-font mt-1 text-sm">

                    November 22, 2026

                  </p>

                </div>



                <div>

                  <p className="interface-font text-[9px] font-bold uppercase text-gray-400">

                    Due date

                  </p>

                  <p className="body-font mt-1 text-sm">

                    December 7, 2026

                  </p>

                </div>



              </div>



              {/* Work table */}



              <div className="overflow-hidden">



                <div className="interface-font grid grid-cols-[1frautoauto] gap-3 border-b border-gray-200 bg-[#F4F8FB] px-3 py-3 text-[9px] font-bold uppercase text-gray-500 sm:grid-cols-[1fr_70px_70px_90px]">



                  <span>Description</span>

                  <span className="text-right">Hours</span>

                  <span className="hidden text-right sm:block">Rate</span>

                  <span className="text-right">Amount</span>



                </div>



                <div className="grid grid-cols-[1frautoauto] items-center gap-3 border-b border-gray-100 px-3 py-5 text-xs sm:grid-cols-[1fr_70px_70px_90px]">



                  <span className="body-font font-bold">

                    Website design

                  </span>



                  <span className="body-font text-right">10</span>



                  <span className="body-font hidden text-right sm:block">

                    $50

                  </span>



                  <span className="body-font text-right font-bold">

                    $500.00

                  </span>



                </div>



                <div className="grid grid-cols-[1frautoauto] items-center gap-3 border-b border-gray-100 px-3 py-5 text-xs sm:grid-cols-[1fr_70px_70px_90px]">



                  <span className="body-font font-bold">

                    API development

                  </span>



                  <span className="body-font text-right">15</span>



                  <span className="body-font hidden text-right sm:block">

                    $50

                  </span>



                  <span className="body-font text-right font-bold">

                    $750.00

                  </span>



                </div>



              </div>



              {/* Total */}



              <div className="ml-auto mt-8 max-w-xs">



                <div className="flex justify-between border-b border-gray-100 py-3 text-sm">

                  <span className="body-font text-gray-500">Subtotal</span>

                  <span className="body-font font-bold">$1,250.00</span>

                </div>



                <div className="mt-3 flex items-center justify-between rounded-lg bg-[#173B5E] px-4 py-4 text-white">

                  <span className="interface-font text-xs font-semibold">

                    Total amount

                  </span>



                  <span className="body-font text-xl font-bold">

                    $1,250.00

                  </span>

                </div>



              </div>



              <div className="mt-12 border-t border-gray-100 pt-6">

                <p className="body-font text-sm italic text-gray-500">

                  Thank you for trusting my work!

                </p>

              </div>



            </div>



          </div>



          <div className="mt-8 flex flex-wrap justify-center gap-4">



            <button

              onClick={handleDemoDownload}

              className="interface-font flex items-center gap-3 rounded-lg bg-[#173B5E] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#244F75]"

            >

              <Download size={17} />

              Download demo PDF

            </button>



            <Link

              to="/create-invoice"

              className="interface-font flex items-center gap-3 rounded-lg border border-[#173B5E]/20 bg-white px-6 py-4 text-sm font-bold transition hover:bg-[#F7FAFC]"

            >

              Create your own

              <ArrowRight size={17} />

            </Link>



          </div>



        </div>



      </section>



      {/* HOW IT WORKS */}



      <section

        id="how-it-works"

        className="bg-[#173B5E] px-6 py-24 text-white"

      >



        <div className="mx-auto max-w-5xl text-center">



          <p className="interface-font text-xs font-bold uppercase tracking-[0.2em] text-[#E97863] reveal">

            SIMPLE BY DESIGN

          </p>



          <h2 className="heading-font mt-4 text-4xl sm:text-5xl reveal">

            Your invoice in three simple steps.

          </h2>



          <div className="mt-14 grid gap-10 text-left sm:grid-cols-3">



            <Step number="01" title="Enter your details">

              Add your freelancer information and your client's details.

            </Step>



            <Step number="02" title="Add your work">

              Enter descriptions, hourly rates, and total hours.

            </Step>



            <Step number="03" title="Download your PDF">

              Let Invoqta calculate everything and generate your invoice.

            </Step>



          </div>



        </div>



      </section>



      {/* FINAL CTA */}



      <section

        id="get-started"

        className="bg-white px-6 py-24 text-center"

      >



        <div className="mx-auto max-w-3xl reveal">



          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#173B5E] text-white">

            <span className="logo-letter text-4xl">I</span>

          </div>



          <p className="interface-font text-xs font-bold uppercase tracking-[0.2em] text-[#E97863]">

            YOUR NEXT INVOICE STARTS HERE

          </p>



          <h2 className="heading-font mt-5 text-4xl sm:text-5xl">

            Make every hour count.

          </h2>



          <p className="body-font mt-5 text-lg font-medium leading-8 text-[#173B5E]/70">

            Your work deserves more than a basic invoice.

            Give it the professional presentation it deserves.

          </p>



          <Link

            to="/create-invoice"

            className="interface-font mt-9 inline-flex items-center gap-3 rounded-lg bg-[#173B5E] px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#244F75]"

          >

            Create your first invoice

            <ArrowRight size={18} />

          </Link>



        </div>



      </section>



      {/* FOOTER */}



      <footer className="bg-[#EAF4FC] px-6 py-8">



        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">



          <Link to="/" className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#173B5E] text-white">

              <span className="logo-letter text-2xl">I</span>

            </div>



            <span className="interface-font text-xl font-bold">

              Invoqta<span className="text-[#E97863]">.</span>

            </span>

          </Link>



          <p className="body-font text-center text-sm text-[#173B5E]/70">

            Your work. Your worth. Invoiced.

          </p>



          <p className="interface-font text-xs text-[#173B5E]/60">

            © 2026 Invoqta. All rights reserved.

          </p>



        </div>



      </footer>



    </div>

  )

}



function Feature({ icon, title, description }) {

  return (

    <div className="reveal rounded-xl border border-[#173B5E]/10 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl">



      <div className="mb-5 inline-flex rounded-lg bg-[#EAF4FC] p-3 text-[#173B5E]">

        {icon}

      </div>



      <h3 className="body-font text-xl font-bold">

        {title}

      </h3>



      <p className="body-font mt-3 text-base font-medium leading-7 text-[#173B5E]/65">

        {description}

      </p>



    </div>

  )

}



function Step({ number, title, children }) {

  return (

    <div className="reveal">



      <p className="interface-font text-4xl font-bold text-[#E97863]">

        {number}

      </p>



      <h3 className="body-font mt-4 text-xl font-bold">

        {title}

      </h3>



      <p className="body-font mt-3 text-base font-medium leading-7 text-white/75">

        {children}

      </p>



    </div>

  )

}



export default App
