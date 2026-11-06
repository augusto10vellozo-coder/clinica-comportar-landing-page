import React, { useState, useEffect } from 'react'

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
              src="/images/logo.jpg"
              alt="Logo Clínica Comportar"
              className="w-10 h-10 rounded-lg object-cover shadow-sm bg-blue-50 border border-slate-200"
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
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
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
              className="w-full text-center py-3 rounded-full bg-[#0d9488] text-white font-semibold shadow-md"
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
                  src="/images/psicologa.jpg"
                  alt="Naidionara Maschio"
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
      <section id="servicos" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#3b6a9a] bg-blue-50 border border-blue-200 rounded-full inline-block mb-3">
              Modalidades de Atendimento
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Serviços</h2>
            <p className="text-slate-600">
              Atendimento clínico ético e consultoria organizacional focados em adultos, idosos e
              empresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Psicoterapia Individual',
                desc: 'Espaço semanal estruturado para adultos enfrentarem questões como ansiedade, estresse, luto, autoconhecimento e dificuldades de relacionamento.',
                features: [
                  'Sessões de 50 minutos',
                  'Foco nas contingências do dia a dia',
                  'Público adulto',
                ],
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
              },
              {
                title: 'Atendimento para Idosos',
                desc: 'Acompanhamento especializado para as demandas da terceira idade: transições de rotina, luto, perda de autonomia, aposentadoria e fortalecimento emocional.',
                features: [
                  'Escuta atenta e ritmo adaptado',
                  'Preservação da dignidade e sentido de vida',
                  'Apoio a fases de transição',
                ],
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ),
              },
              {
                title: 'Atendimento Online',
                desc: 'Sessões com a mesma eficácia e sigilo do presencial, com flexibilidade de horários para todo o Brasil e brasileiros residentes no exterior.',
                features: [
                  'Plataforma segura com criptografia',
                  'Conforto da sua própria casa',
                  'Sem deslocamentos no trânsito',
                ],
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
              },
              {
                title: 'Consultoria em R&S',
                desc: 'Recrutamento e Seleção de profissionais com avaliação de perfil comportamental e alinhamento cultural, estruturado para empresas de diversos portes.',
                features: [
                  'Mapeamento de competências',
                  'Entrevistas comportamentais por competência',
                  'Redução de turnover organizacional',
                ],
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                ),
              },
            ].map((srv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0d9488] flex items-center justify-center mb-6">
                  {srv.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{srv.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">{srv.desc}</p>
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {srv.features.map((feat, fidx) => (
                    <div
                      key={fidx}
                      className="flex items-center gap-2 text-xs font-semibold text-[#1e3a5f]"
                    >
                      <span className="text-[#0d9488] text-base leading-none">•</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-[820px] mx-auto px-5">
          <div className="text-center mb-14">
            <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#3b6a9a] bg-blue-50 border border-blue-200 rounded-full inline-block mb-3">
              Dúvidas Frequentes
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Perguntas Comuns</h2>
            <p className="text-slate-600">
              Informações claras sobre o funcionamento das consultas, modalidades e consultoria.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Como funciona a primeira sessão?',
                a: 'A primeira sessão é um momento de conhecimento mútuo e acolhimento da sua queixa principal. Você terá espaço para relatar o que o levou a procurar apoio profissional, esclarecer suas dúvidas sobre a Análise do Comportamento e compreender o formato de trabalho. Juntos, alinhamos as expectativas e os primeiros objetivos do acompanhamento.',
              },
              {
                q: 'Qual é a duração e a frequência das sessões?',
                a: 'Cada sessão tem a duração de 50 minutos. A frequência usual é semanal, o que garante a continuidade necessária para o processo analítico e as mudanças práticas. Em fases de manutenção ou situações avaliadas conjuntamente, o intervalo pode ser ajustado para quinzenal.',
              },
              {
                q: 'Como funciona a consultoria em R&S para empresas?',
                a: 'A consultoria em Recrutamento e Seleção é estruturada de acordo com o perfil da vaga e a cultura da organização. Conduzo o alinhamento de perfil, a divulgação estratégica, a triagem técnica, entrevistas com foco em competências e dinâmicas comportamentais, entregando à empresa um parecer psicológico completo dos candidatos mais alinhados ao cargo.',
              },
              {
                q: 'Como funciona o atendimento psicológico online?',
                a: 'O atendimento online ocorre por meio de videochamadas em ambiente seguro e criptografado, regulamentado pelo Conselho Federal de Psicologia. Você só precisa de uma conexão estável à internet, fones de ouvido e um local privativo onde se sinta à vontade para conversar sem interrupções. Atende pessoas de qualquer região do Brasil ou no exterior.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  activeFaq === idx
                    ? 'border-blue-200 shadow-md bg-white'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-[#1e3a5f] hover:text-[#0d9488] transition-colors"
                  aria-expanded={activeFaq === idx}
                >
                  <span className="text-base sm:text-lg">{item.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      activeFaq === idx ? 'rotate-180 bg-blue-100 text-[#1e3a5f]' : 'text-slate-500'
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato e Agendamento */}
      <section id="contato" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#3b6a9a] bg-blue-50 border border-blue-200 rounded-full inline-block mb-3">
              Agendamento e Dúvidas
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Contato e Agendamento
            </h2>
            <p className="text-slate-600">
              Dê o primeiro passo em direção ao seu cuidado emocional. Envie uma mensagem ou fale
              diretamente pelo WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Informações do Consultório */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-blue-100 shadow-md flex flex-col justify-between gap-8">
              <div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-6">
                  Informações do Consultório
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b6a9a] flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Endereço Presencial
                      </div>
                      <div className="text-sm font-semibold text-[#1e3a5f] leading-snug mt-0.5">
                        Rua Espírito Santo, 103 — São Judas Tadeu, Dois Vizinhos — PR
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b6a9a] flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Horários de Atendimento
                      </div>
                      <div className="text-sm font-semibold text-[#1e3a5f] leading-snug mt-0.5">
                        Segunda a sexta, a partir das 18h
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b6a9a] flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        E-mail
                      </div>
                      <a
                        href="mailto:naidionaramaschio.psi@gmail.com"
                        className="text-sm font-semibold text-[#1e3a5f] hover:text-[#0d9488] leading-snug mt-0.5 block"
                      >
                        naidionaramaschio.psi@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b6a9a] flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Telefone / WhatsApp
                      </div>
                      <a
                        href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20atendimentos."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#1e3a5f] hover:text-[#0d9488] leading-snug mt-0.5 block"
                      >
                        +55 (54) 99701-1417
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b6a9a] flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Instagram
                      </div>
                      <a
                        href="https://www.instagram.com/psinaidionaramaschio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#1e3a5f] hover:text-[#0d9488] leading-snug mt-0.5 block"
                      >
                        @psinaidionaramaschio
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box de Localização */}
              <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#3b6a9a] shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1e3a5f]">
                    Consultório em Dois Vizinhos / PR
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Espaço reservado, confortável e com fácil acesso
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário Interativo */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-1">Envie uma Mensagem</h3>
              <p className="text-sm text-slate-500 mb-6">
                Preencha os campos abaixo e responderei com a brevidade possível.
              </p>

              {submitSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                  ✓ Mensagem enviada com sucesso! O WhatsApp foi aberto para prosseguir com o
                  agendamento.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="react-nome"
                    className="block text-xs font-bold text-[#1e3a5f] uppercase tracking-wider mb-2"
                  >
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="react-nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex.: Maria da Silva"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                      formErrors.nome
                        ? 'border-red-500 bg-red-50/50 focus:border-red-500'
                        : 'border-slate-200 bg-white focus:border-[#3b6a9a] focus:ring-2 focus:ring-[#3b6a9a]/20'
                    }`}
                  />
                  {formErrors.nome && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">
                      Por favor, informe seu nome com pelo menos 3 caracteres.
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="react-email"
                    className="block text-xs font-bold text-[#1e3a5f] uppercase tracking-wider mb-2"
                  >
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="react-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seuemail@exemplo.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                      formErrors.email
                        ? 'border-red-500 bg-red-50/50 focus:border-red-500'
                        : 'border-slate-200 bg-white focus:border-[#3b6a9a] focus:ring-2 focus:ring-[#3b6a9a]/20'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">
                      Por favor, insira um e-mail válido.
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="react-telefone"
                    className="block text-xs font-bold text-[#1e3a5f] uppercase tracking-wider mb-2"
                  >
                    Telefone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="react-telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                      formErrors.telefone
                        ? 'border-red-500 bg-red-50/50 focus:border-red-500'
                        : 'border-slate-200 bg-white focus:border-[#3b6a9a] focus:ring-2 focus:ring-[#3b6a9a]/20'
                    }`}
                  />
                  {formErrors.telefone && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">
                      Informe um telefone válido com DDD (10 ou 11 dígitos).
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="react-mensagem"
                    className="block text-xs font-bold text-[#1e3a5f] uppercase tracking-wider mb-2"
                  >
                    Mensagem <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="react-mensagem"
                    name="mensagem"
                    rows={4}
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    placeholder="Conte brevemente o motivo do contato ou qual modalidade você busca..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none resize-y ${
                      formErrors.mensagem
                        ? 'border-red-500 bg-red-50/50 focus:border-red-500'
                        : 'border-slate-200 bg-white focus:border-[#3b6a9a] focus:ring-2 focus:ring-[#3b6a9a]/20'
                    }`}
                  />
                  {formErrors.mensagem && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">
                      Por favor, escreva uma mensagem com ao menos 10 caracteres.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Faixa CTA */}
      <section className="py-16 bg-gradient-to-r from-[#1e3a5f] to-[#172c47] text-white text-center">
        <div className="max-w-[720px] mx-auto px-5">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O primeiro passo pode ser hoje</h2>
          <p className="text-blue-100 text-base mb-8 max-w-xl mx-auto">
            Priorize sua saúde mental. Agende um horário conveniente e comece seu processo de
            autoconhecimento e transformação.
          </p>
          <a
            href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar%20e%20gostaria%20de%20agendar%20minha%20primeira%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#1e3a5f] font-bold text-sm shadow-xl hover:bg-blue-50 transition-all"
          >
            Agendar Consulta via WhatsApp
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#0f1d30] text-slate-400 py-16 border-t border-white/10">
        <div className="max-w-[1140px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            <div className="md:col-span-5">
              <div className="text-xl font-bold text-white mb-1">Clínica Comportar</div>
              <div className="text-xs font-semibold text-blue-200 mb-4">
                Naidionara Maschio · CRP 08/42488
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Psicoterapia com base na Análise do Comportamento para adultos e idosos. Atendimento
                humanizado presencial em Dois Vizinhos/PR e online para todo o Brasil e exterior.
              </p>
            </div>

            <div className="md:col-span-3">
              <div className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                Navegação
              </div>
              <ul className="space-y-2 text-sm">
                {[
                  { label: 'Início', href: '#inicio' },
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

            <div className="md:col-span-4">
              <div className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                Atendimento
              </div>
              <ul className="space-y-2.5 text-sm">
                <li>Rua Espírito Santo, 103 — Dois Vizinhos/PR</li>
                <li>Segunda a sexta, a partir das 18h</li>
                <li>
                  WhatsApp:{' '}
                  <a
                    href="https://wa.me/5554997011417?text=Ol%C3%A1%2C%20Naidionara!%20Vim%20pelo%20site%20Cl%C3%ADnica%20Comportar."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors font-medium text-slate-300"
                  >
                    +55 (54) 99701-1417
                  </a>
                </li>
                <li>
                  E-mail:{' '}
                  <a
                    href="mailto:naidionaramaschio.psi@gmail.com"
                    className="hover:text-white transition-colors font-medium text-slate-300"
                  >
                    naidionaramaschio.psi@gmail.com
                  </a>
                </li>
                <li>
                  Instagram:{' '}
                  <a
                    href="https://www.instagram.com/psinaidionaramaschio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors font-medium text-slate-300"
                  >
                    @psinaidionaramaschio
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Clínica Comportar — Todos os direitos reservados.
            </div>
            <div>Naidionara Maschio — Psicóloga Clínica e Organizacional (CRP 08/42488)</div>
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
