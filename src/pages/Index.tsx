import React, { useState, useEffect } from 'react'
import photoUrl from '@/assets/image-2d172.png'
import logoUrl from '@/assets/image-9b520.png'

export default function Index() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2')
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2})$/, '($1')
    }
    setFormData((prev) => ({ ...prev, telefone: value }))
    if (formErrors.telefone) {
      setFormErrors((prev) => ({ ...prev, telefone: false }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const digitsOnly = formData.telefone.replace(/\D/g, '')

    const errors: { [key: string]: boolean } = {
      nome: formData.nome.trim().length < 3,
      email: !emailRegex.test(formData.email.trim()),
      telefone: digitsOnly.length !== 10 && digitsOnly.length !== 11,
      mensagem: formData.mensagem.trim().length < 10,
    }

    setFormErrors(errors)

    if (Object.values(errors).some(Boolean)) {
      return
    }

    setSubmitSuccess(true)
    const waText = encodeURIComponent(
      `Olá, Naidionara! Meu nome é ${formData.nome}. Vim pelo site Clínica Comportar e gostaria de saber mais sobre os atendimentos.`,
    )
    const waUrl = `https://wa.me/5554997011417?text=${waText}`

    window.open(waUrl, '_blank', 'noopener,noreferrer')

    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' })
    }, 8000)
  }

  const toggleFaq = (index: number) => {
    setActiveFaq((prev) => (prev === index ? null : index))
  }

  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Header Fixo */}
      <header
        className={`fixed top-0 left-0 right-0 h-[72px] z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-blue-100'
            : 'bg-white/80 backdrop-blur-sm border-b border-slate-100'
        }`}
      >
        <div className="max-w-[1140px] mx-auto px-5 h-full flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3 group">
            <img
              src={logoUrl}
              alt="Logo Clínica Comportar - Monograma NM"
              className="w-10 h-10 rounded-lg object-contain shadow-sm bg-white border border-slate-200 p-0.5"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#1e3a5f] leading-tight">
                Clínica Comportar
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
                Psicologia Clínica
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
            {[
              { label: 'Início', href: '#inicio' },
              { label: 'Sobre Mim', href: '#sobre' },
              { label: 'Abordagem', href: '#abordagem' },
              { label: 'Serviços', href: '#servicos' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Contato', href: '#contato' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-[#3b6a9a] transition-colors py-1 relative"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar%20e%20gostaria%20de%20agendar%20minha%20primeira%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full !bg-[#0d9488] hover:!bg-[#0f766e] !text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 select-none"
              style={{ backgroundColor: '#0d9488', color: '#ffffff' }}
            >
              Agendar Consulta
            </a>
          </div>

          {/* Mobile Hamburguer */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10 p-2 rounded-lg bg-blue-50 border border-blue-100 text-[#1e3a5f]"
            aria-label="Abrir menu"
          >
            <span
              className={`block w-full h-0.5 bg-[#1e3a5f] transition-transform ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-full h-0.5 bg-[#1e3a5f] transition-opacity ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-full h-0.5 bg-[#1e3a5f] transition-transform ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-[#1e3a5f]/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl p-6 flex flex-col pt-24 z-50">
            <div className="flex flex-col gap-4 mb-8">
              {[
                { label: 'Início', href: '#inicio' },
                { label: 'Sobre Mim', href: '#sobre' },
                { label: 'Abordagem', href: '#abordagem' },
                { label: 'Serviços', href: '#servicos' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contato', href: '#contato' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-[#1e3a5f] border-b border-slate-100 pb-2.5"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar%20e%20gostaria%20de%20agendar%20minha%20primeira%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full !bg-[#0d9488] hover:!bg-[#0f766e] !text-white font-semibold shadow-md"
              style={{ backgroundColor: '#0d9488', color: '#ffffff' }}
            >
              Agendar Consulta
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-[#eff6ff] to-white"
      >
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texto Hero */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs w-fit">
                <span className="w-2 h-2 rounded-full bg-[#0d9488]" />
                <span className="text-xs font-semibold text-[#1e3a5f]">
                  Atendimento presencial e online
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-[#1e3a5f] leading-[1.15] tracking-tight">
                Cuidar da sua saúde mental é um{' '}
                <span className="text-[#0d9488]">ato de coragem.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Psicoterapia individual para adultos e idosos com base na Análise do Comportamento.
                Atendimento presencial e online com foco no acolhimento e desenvolvimento pessoal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar%20e%20gostaria%20de%20agendar%20minha%20primeira%20consulta."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold shadow-lg shadow-teal-600/25 hover:shadow-xl transition-all"
                >
                  Agendar Primeira Consulta
                </a>
                <a
                  href="#servicos"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white hover:bg-blue-50/60 text-[#1e3a5f] font-semibold border border-slate-200 shadow-xs hover:shadow-md transition-all"
                >
                  Conhecer os Serviços
                </a>
              </div>

              {/* 3 Facts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-6 border-t border-blue-200/70">
                <div>
                  <div className="text-lg font-bold text-[#1e3a5f]">Seg–Sex</div>
                  <div className="text-sm text-slate-500 mt-1">após as 18h</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#1e3a5f]">50min</div>
                  <div className="text-sm text-slate-500 mt-1">por sessão</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#1e3a5f]">100%</div>
                  <div className="text-sm text-slate-500 mt-1">sigiloso</div>
                </div>
              </div>
            </div>

            {/* Card Lateral Hero */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-8 sm:p-9 border border-blue-100 shadow-xl shadow-blue-900/5">
                <blockquote className="text-lg font-semibold text-[#1e3a5f] leading-relaxed">
                  "Um espaço seguro para o seu autoconhecimento e bem-estar emocional."
                </blockquote>

                <div className="mt-6 space-y-4">
                  {[
                    'Escuta ativa, sem julgamentos, no seu ritmo.',
                    'Sessões online com a mesma qualidade do presencial.',
                    'Atendimento baseado na Análise do Comportamento.',
                    'Atendimentos de segunda a sexta, após as 18h.',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <svg
                        className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Mim */}
      <section id="sobre" className="py-20 bg-white">
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 relative">
              <div className="rounded-[24px] overflow-hidden shadow-lg bg-blue-50">
                <img
                  src={photoUrl}
                  alt="Naidionara Maschio — Psicóloga Clínica e Organizacional, CRP 08/42488"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d9488] mb-3">
                Sobre Mim
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-2">
                Naidionara Maschio
              </h2>
              <p className="text-sm font-semibold text-[#0d9488] mb-6">
                CRP 08/42488 — Psicóloga Clínica e Organizacional
              </p>

              <p className="text-slate-600 leading-relaxed text-[15px]">
                Sou psicóloga clínica e organizacional e acredito que o cuidado com a saúde mental
                começa quando existe um espaço realmente livre de julgamentos. Acompanho adultos e
                idosos em processos de ansiedade, autoconhecimento, luto, reconstrução de projetos
                de vida e adaptação às mudanças da vida adulta e da terceira idade.
              </p>

              <p className="text-slate-600 leading-relaxed text-[15px] mt-4">
                Minha prática clínica é fundamentada na Análise do Comportamento, observando como o
                ambiente, as relações e as consequências moldam os comportamentos. Trabalho com
                escuta ativa, respeito ao tempo de cada pessoa e compromisso ético com o sigilo.
              </p>

              <p className="text-slate-600 leading-relaxed text-[15px] mt-4">
                Também atuo como psicóloga organizacional oferecendo consultoria em processos de
                recrutamento e seleção, preparando recrutadores e candidatos para processos mais
                assertivos, humanizados e alinhados às competências de cada vaga.
              </p>

              <div className="mt-7">
                <div className="flex flex-wrap gap-3">
                  {[
                    'Ansiedade',
                    'Autoconhecimento',
                    'Idosos',
                    'Luto',
                    'Estresse e burnout',
                    'Recrutamento e seleção',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full text-sm text-[#1e3a5f] bg-white border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Abordagem Terapêutica */}
      <section id="abordagem" className="py-20 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d9488] mb-3">
              Abordagem Terapêutica
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Análise do Comportamento
            </h2>
            <p className="text-slate-500">
              Uma abordagem baseada em evidências: compreender como o ambiente influencia o
              comportamento e construir, juntos, novas possibilidades de vida.
            </p>
          </div>

          <div className="bg-white border border-slate-200 border-l-4 border-l-[#0d9488] rounded-2xl p-7 sm:p-9 mb-12 text-slate-700 leading-relaxed shadow-xs">
            <p>
              A Análise do Comportamento, desenvolvida por B. F. Skinner, estuda como nossas ações
              são moldadas pelo ambiente, pelas relações e pelas consequências que as seguem. Na
              clínica, isso significa olhar com cuidado para o contexto do sofrimento, identificar
              padrões que se mantêm e promover novos comportamentos mais saudáveis e alinhados ao
              que cada pessoa valoriza — sempre com acolhimento, nunca com cobrança.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '1',
                title: 'Acolhimento',
                desc: 'Um espaço seguro e sigiloso, onde você pode falar sem medo de julgamento. Nas primeiras sessões, entendemos sua história e definimos objetivos claros.',
              },
              {
                num: '2',
                title: 'Análise funcional',
                desc: 'Compreensão do contexto em que os comportamentos acontecem: quais antecedentes e consequências mantêm o sofrimento e o que pode ser modificado.',
              },
              {
                num: '3',
                title: 'Transformação',
                desc: 'Desenvolvimento de habilidades práticas para o dia a dia, fortalecendo comportamentos de autocuidado, comunicação e enfrentamento.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-teal-200 hover:shadow-md transition-all flex flex-col"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#1e3a5f] text-base font-bold flex items-center justify-center mb-6">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-3">{step.title}</h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 bg-white">
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d9488] mb-3">
              SERVIÇOS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Como posso ajudar
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Atendimentos clínicos e consultoria organizacional, presencial e online, para o seu
              momento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                emoji: '🧠',
                title: 'Psicoterapia Individual',
                desc: 'Para adultos, com foco em ansiedade, autoconhecimento, luto, estresse e gestão de conflitos pessoais e profissionais.',
              },
              {
                emoji: '🧡',
                title: 'Atendimento para Idosos',
                desc: 'Acolhimento especializado para as demandas da terceira idade: perdas, mudanças de papel, solidão, memória e qualidade de vida.',
              },
              {
                emoji: '💻',
                title: 'Atendimento Online',
                desc: 'Para pacientes de todo o Brasil e do exterior, por videochamada criptografada, com total segurança e sigilo.',
              },
              {
                emoji: '🎯',
                title: 'Consultoria em R&S',
                desc: 'Para recrutadores e candidatos: processos de recrutamento e seleção mais assertivos, humanizados e alinhados às competências de cada vaga.',
              },
            ].map((srv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-blue-100/90 shadow-sm hover:shadow-md hover:border-teal-200 transition-all flex flex-col"
              >
                <div className="text-3xl mb-5 select-none" aria-hidden="true">
                  {srv.emoji}
                </div>
                <h3 className="text-base font-bold text-[#1e3a5f] mb-3 leading-snug">
                  {srv.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-grow">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-[#eff6ff]">
        <div className="max-w-[760px] mx-auto px-5">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d9488] mb-3">
              DÚVIDAS FREQUENTES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">
              Perguntas frequentes
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Se a sua dúvida não estiver aqui, é só me chamar no WhatsApp.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: 'Como funciona a primeira sessão?',
                a: 'A primeira sessão é um momento de acolhimento e escuta da sua queixa principal. Você pode relatar o que o trouxe ao atendimento, esclarecer dúvidas sobre a Análise do Comportamento e compreender o funcionamento dos encontros. Juntos, traçamos os primeiros objetivos do acompanhamento.',
              },
              {
                q: 'Qual é a duração e a frequência das consultas?',
                a: 'As consultas têm duração de 50 minutos, com frequência habitual semanal — essencial para o vínculo terapêutico e a consistência das intervenções. Em momentos específicos de alta ou acompanhamento pós-processo, a periodicidade pode ser reajustada.',
              },
              {
                q: 'Como funciona a consultoria em recrutamento e seleção?',
                a: 'A consultoria em R&S apoia empresas e recrutadores na condução de processos seletivos mais humanizados, técnicos e alinhados às competências de cada vaga, incluindo alinhamento de perfil, entrevistas por competências e elaboração de pareceres psicológicos.',
              },
              {
                q: 'Como funciona o atendimento online?',
                a: 'O atendimento online acontece por videochamada em plataforma com criptografia de ponta a ponta, com total sigilo e privacidade garantidos pelo Código de Ética do CFP. Você só precisa de conexão estável e um local reservado.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-blue-100/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-[#1e3a5f] hover:text-[#0d9488] transition-colors"
                  aria-expanded={activeFaq === idx}
                >
                  <span className="text-[15px] sm:text-base font-medium text-[#1e3a5f]">
                    {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#e0f2fe] flex items-center justify-center shrink-0 text-[#0284c7] transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-45' : ''
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100/70 pt-3.5">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato e Agendamento */}
      <section id="contato" className="py-20 bg-white">
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d9488] mb-3">
              CONTATO E AGENDAMENTO
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">Vamos conversar?</h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Preencha o formulário ou fale comigo diretamente pelo WhatsApp. Respondo em até 24
              horas úteis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-[980px] mx-auto">
            {/* Esquerda: Formulário em card branco */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-blue-100/90 shadow-sm">
              {submitSuccess && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium">
                  ✓ Mensagem registrada com sucesso! Abrindo o WhatsApp...
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="react-nome"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="react-nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Como você gostaria de ser chamado(a)?"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm ${
                      formErrors.nome
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-slate-200 bg-white focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]'
                    }`}
                  />
                  {formErrors.nome && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">
                      Por favor, informe seu nome.
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="react-email"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="react-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seunome@email.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm ${
                      formErrors.email
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-slate-200 bg-white focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">
                      Por favor, informe um e-mail válido.
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="react-telefone"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="react-telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="+55 (54) 99701-1417"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm ${
                      formErrors.telefone
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-slate-200 bg-white focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]'
                    }`}
                  />
                  {formErrors.telefone && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">
                      Informe um telefone válido com DDD.
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="react-mensagem"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="react-mensagem"
                    name="mensagem"
                    rows={4}
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    placeholder="Conte brevemente o que você busca na terapia e sua disponibilidade de horários."
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none resize-y placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm ${
                      formErrors.mensagem
                        ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                        : 'border-slate-200 bg-white focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]'
                    }`}
                  />
                  {formErrors.mensagem && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">
                      Por favor, escreva uma mensagem com ao menos 10 caracteres.
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold text-sm shadow-sm hover:shadow transition-all"
                  >
                    Enviar mensagem
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-400 inline-flex items-center justify-center gap-1.5">
                    <span>🔒</span>
                    <span>Suas informações são tratadas com total sigilo profissional.</span>
                  </p>
                </div>
              </form>
            </div>

            {/* Direita: Card com mapa e dados de contato */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-blue-100/90 shadow-sm flex flex-col justify-between">
              <div>
                {/* Retângulo azul-claro com link do mapa */}
                <a
                  href="https://maps.google.com/?q=Rua+Esp%C3%ADrito+Santo,+103,+S%C3%A3o+Judas+Tadeu,+Dois+Vizinhos+-+PR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-36 rounded-2xl bg-[#eaf2fd] hover:bg-[#dfeafd] transition-colors flex items-center justify-center text-sm font-medium text-[#2563eb] gap-2 mb-6 group cursor-pointer"
                >
                  <span className="text-base">📍</span>
                  <span className="group-hover:underline">Mapa do consultório</span>
                </a>

                {/* Itens de contato */}
                <div className="space-y-4">
                  {/* Consultório */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 text-rose-500 text-sm mt-0.5">
                      📍
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1e3a5f]">Consultório</div>
                      <div className="text-xs text-slate-500 leading-snug mt-0.5">
                        Rua Espírito Santo, 103
                      </div>
                      <div className="text-xs text-slate-500 leading-snug">
                        São Judas Tadeu, Dois Vizinhos — PR
                      </div>
                      <a
                        href="https://maps.google.com/?q=Rua+Esp%C3%ADrito+Santo,+103,+S%C3%A3o+Judas+Tadeu,+Dois+Vizinhos+-+PR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#2563eb] hover:underline mt-0.5 inline-block"
                      >
                        Ver rota no mapa
                      </a>
                    </div>
                  </div>

                  {/* Horário de atendimento */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 text-slate-500 text-sm mt-0.5">
                      🕒
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1e3a5f]">Horário de atendimento</div>
                      <div className="text-xs text-slate-500 leading-snug mt-0.5">
                        Segunda a sexta, a partir das 18h
                      </div>
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 text-slate-500 text-sm mt-0.5">
                      ✉️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1e3a5f]">E-mail</div>
                      <a
                        href="mailto:naidionaramaschio.psi@gmail.com"
                        className="text-xs text-[#2563eb] hover:underline leading-snug mt-0.5 block"
                      >
                        naidionaramaschio.psi@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 text-slate-500 text-sm mt-0.5">
                      💬
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1e3a5f]">WhatsApp</div>
                      <a
                        href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20atendimentos."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-600 hover:text-[#0d9488] leading-snug mt-0.5 block"
                      >
                        +55 (54) 99701-1417
                      </a>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0 text-slate-500 text-sm mt-0.5">
                      📷
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1e3a5f]">Instagram</div>
                      <a
                        href="https://www.instagram.com/psinaidionaramaschio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#2563eb] hover:underline leading-snug mt-0.5 block"
                      >
                        @psinaidionaramaschio
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão navy escuro largo */}
              <div className="mt-8 pt-2">
                <a
                  href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar%20e%20gostaria%20de%20agendar%20minha%20primeira%20consulta."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-[#1e3a5f] hover:bg-[#152a45] text-white font-semibold text-sm shadow-sm hover:shadow transition-all inline-flex items-center justify-center"
                >
                  Falar agora pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faixa CTA */}
      <section className="py-20 md:py-24 bg-gradient-to-r from-[#173252] via-[#1e3a5f] to-[#2c4e78] text-white text-center">
        <div className="max-w-[760px] mx-auto px-5">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            O primeiro passo pode ser hoje
          </h2>
          <p className="text-blue-100/90 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Se você chegou até aqui, algo em você já está pedindo cuidado. Vamos começar juntos, no
            seu tempo.
          </p>
          <a
            href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar%20e%20gostaria%20de%20agendar%20minha%20primeira%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full !bg-[#0d9488] hover:!bg-[#0f766e] !text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all"
            style={{ backgroundColor: '#0d9488', color: '#ffffff' }}
          >
            Agendar Primeira Consulta
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#172e4c] text-slate-300 py-16 border-t border-white/10">
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-14">
            {/* Marca e Resumo */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logoUrl}
                  alt="Logo Clínica Comportar"
                  className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-white/20 shadow-sm"
                />
                <div className="text-lg font-bold text-white leading-tight">Clínica Comportar</div>
              </div>
              <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed max-w-md">
                Um espaço seguro para o seu autoconhecimento e bem-estar emocional. Psicoterapia
                individual para adultos e idosos, presencial em Dois Vizinhos, PR e online para todo
                o Brasil. Consultoria em recrutamento e seleção.
              </p>
            </div>

            {/* Navegação */}
            <div className="md:col-span-3">
              <div className="text-sm font-bold text-white mb-4">Navegação</div>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-300/90">
                {[
                  { label: 'Sobre Mim', href: '#sobre' },
                  { label: 'Abordagem', href: '#abordagem' },
                  { label: 'Serviços', href: '#servicos' },
                  { label: 'FAQ', href: '#faq' },
                  { label: 'Contato', href: '#contato' },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div className="md:col-span-4">
              <div className="text-sm font-bold text-white mb-4">Contato</div>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-300/90">
                <li>Rua Espírito Santo, 103</li>
                <li>São Judas Tadeu, Dois Vizinhos — PR</li>
                <li>
                  <a
                    href="mailto:naidionaramaschio.psi@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    naidionaramaschio.psi@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    +55 (54) 99701-1417
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/psinaidionaramaschio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    @psinaidionaramaschio
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Clínica Comportar — Naidionara Maschio, CRP 08/42488.
            Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Botão Flutuante do WhatsApp */}
      <a
        href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#1eb956] text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
        aria-label="Falar com Naidionara no WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </div>
  )
}
