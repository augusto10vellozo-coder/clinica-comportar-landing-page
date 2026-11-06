/* ==========================================================================
   Clínica Comportar — Psicologia Clínica | Naidionara Maschio
   Script Vanilla Puro (IIFE, 'use strict', sem bibliotecas nem frameworks)
   ========================================================================== */

;(function () {
  'use strict'

  // 1. Atualização dinâmica do ano no rodapé
  function setupFooterYear() {
    const yearSpan = document.getElementById('ano-atual')
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear().toString()
    }
  }

  // 2. Header fixo ganha classe .is-scrolled ao rolar mais de 12px
  function setupHeaderScroll() {
    const header = document.querySelector('.site-header')
    if (!header) return

    function onScroll() {
      if (window.scrollY > 12) {
        header.classList.add('is-scrolled')
      } else {
        header.classList.remove('is-scrolled')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  // 3. Menu Mobile Hambúrguer (is-open, aria-expanded, ESC, clique externo e resize >=900px)
  function setupMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle')
    const mobilePanel = document.getElementById('mobile-menu')
    const mobileOverlay = document.getElementById('mobile-overlay')
    if (!toggleBtn || !mobilePanel || !mobileOverlay) return

    function openMenu() {
      toggleBtn.classList.add('is-open')
      toggleBtn.setAttribute('aria-expanded', 'true')
      mobilePanel.classList.add('is-open')
      mobileOverlay.classList.add('is-open')
      document.body.style.overflow = 'hidden'
    }

    function closeMenu() {
      toggleBtn.classList.remove('is-open')
      toggleBtn.setAttribute('aria-expanded', 'false')
      mobilePanel.classList.remove('is-open')
      mobileOverlay.classList.remove('is-open')
      document.body.style.overflow = ''
    }

    toggleBtn.addEventListener('click', function () {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true'
      if (isOpen) {
        closeMenu()
      } else {
        openMenu()
      }
    })

    mobileOverlay.addEventListener('click', closeMenu)

    // Fechar ao clicar em qualquer link do menu
    const navLinks = mobilePanel.querySelectorAll('a')
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu)
    })

    // Fechar ao pressionar tecla Esc
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu()
      }
    })

    // Fechar se redimensionar a tela para >= 900px
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900 && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu()
      }
    })
  }

  // 4. FAQ: Acordeão acessível (aria-expanded, max-height animado, abre um por vez)
  function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item')
    if (!faqItems.length) return

    faqItems.forEach(function (item) {
      const trigger = item.querySelector('.faq-trigger')
      const panel = item.querySelector('.faq-panel')
      if (!trigger || !panel) return

      trigger.addEventListener('click', function () {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true'

        // Fecha todos os outros itens (abre um por vez)
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            const otherTrigger = otherItem.querySelector('.faq-trigger')
            const otherPanel = otherItem.querySelector('.faq-panel')
            if (otherTrigger && otherPanel) {
              otherItem.classList.remove('is-open')
              otherTrigger.setAttribute('aria-expanded', 'false')
              otherPanel.style.maxHeight = null
            }
          }
        })

        // Alterna o item atual
        if (isExpanded) {
          item.classList.remove('is-open')
          trigger.setAttribute('aria-expanded', 'false')
          panel.style.maxHeight = null
        } else {
          item.classList.add('is-open')
          trigger.setAttribute('aria-expanded', 'true')
          panel.style.maxHeight = panel.scrollHeight + 'px'
        }
      })
    })
  }

  // 5. Formulário de Contato: Máscara, Validação estrita e Feedback acessível
  function setupContactForm() {
    const form = document.getElementById('contato-form')
    if (!form) return

    const nameInput = document.getElementById('form-nome')
    const emailInput = document.getElementById('form-email')
    const phoneInput = document.getElementById('form-telefone')
    const messageInput = document.getElementById('form-mensagem')
    const successBox = document.getElementById('form-sucesso')

    // Máscara dinâmica de telefone brasileiro (11) 98765-4321 ou (11) 8765-4321
    if (phoneInput) {
      phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 11) {
          value = value.slice(0, 11)
        }

        if (value.length > 10) {
          // 11 dígitos: celular com 9 na frente
          value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
        } else if (value.length > 6) {
          // 10 dígitos ou intermediário
          value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
        } else if (value.length > 2) {
          value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2')
        } else if (value.length > 0) {
          value = value.replace(/^(\d{0,2})$/, '($1')
        }
        e.target.value = value
      })
    }

    // Regras de validação
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    function validateField(field, isValid) {
      if (isValid) {
        field.setAttribute('aria-invalid', 'false')
      } else {
        field.setAttribute('aria-invalid', 'true')
      }
      return isValid
    }

    // Limpar erro ao digitar
    ;[nameInput, emailInput, phoneInput, messageInput].forEach(function (field) {
      if (!field) return
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') {
          field.setAttribute('aria-invalid', 'false')
        }
      })
    })

    form.addEventListener('submit', function (e) {
      e.preventDefault()

      let isFormValid = true
      let firstInvalid = null

      // Nome: mínimo 3 caracteres
      const isNameValid = nameInput && nameInput.value.trim().length >= 3
      if (!validateField(nameInput, isNameValid)) {
        isFormValid = false
        if (!firstInvalid) firstInvalid = nameInput
      }

      // E-mail: regex padrão
      const isEmailValid = emailInput && emailRegex.test(emailInput.value.trim())
      if (!validateField(emailInput, isEmailValid)) {
        isFormValid = false
        if (!firstInvalid) firstInvalid = emailInput
      }

      // Telefone: 10 ou 11 dígitos numéricos
      const digitsOnly = phoneInput ? phoneInput.value.replace(/\D/g, '') : ''
      const isPhoneValid = digitsOnly.length === 10 || digitsOnly.length === 11
      if (!validateField(phoneInput, isPhoneValid)) {
        isFormValid = false
        if (!firstInvalid) firstInvalid = phoneInput
      }

      // Mensagem: mínimo 10 caracteres
      const isMsgValid = messageInput && messageInput.value.trim().length >= 10
      if (!validateField(messageInput, isMsgValid)) {
        isFormValid = false
        if (!firstInvalid) firstInvalid = messageInput
      }

      // Se inválido, focar no primeiro campo com erro
      if (!isFormValid) {
        if (firstInvalid) {
          firstInvalid.focus()
        }
        return
      }

      // Se válido: exibe caixa de sucesso com role="status"
      if (successBox) {
        successBox.classList.add('is-success')
        successBox.textContent =
          'Mensagem enviada com sucesso! Naidionara retornará o contato em breve.'
        form.reset()

        // Opcional: abre o WhatsApp com a mensagem pré-preenchida para agilizar o contato
        const rawName = nameInput ? nameInput.value.trim() : ''
        const rawMsg = messageInput ? messageInput.value.trim() : ''
        const waText = encodeURIComponent(
          `Olá, Naidionara! Meu nome é ${rawName || 'Paciente'}. Vim pelo site Clínica Comportar e gostaria de saber mais sobre os atendimentos.`,
        )
        const waUrl = `https://wa.me/5554997011417?text=${waText}`

        // Timeout para sumir a mensagem de sucesso após 8s
        setTimeout(function () {
          successBox.classList.remove('is-success')
          successBox.textContent = ''
        }, 8000)

        // Abre em nova aba opcionalmente após confirmação
        window.open(waUrl, '_blank', 'noopener,noreferrer')
      }
    })
  }

  // 6. Animações de entrada com IntersectionObserver na classe .reveal (com fallback)
  function setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal')
    if (!revealElements.length) return

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              obs.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '0px 0px -50px 0px',
          threshold: 0.15,
        },
      )

      revealElements.forEach(function (el) {
        observer.observe(el)
      })
    } else {
      // Fallback para navegadores muito antigos
      revealElements.forEach(function (el) {
        el.classList.add('is-visible')
      })
    }
  }

  // Inicialização quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  function init() {
    setupFooterYear()
    setupHeaderScroll()
    setupMobileMenu()
    setupFaqAccordion()
    setupContactForm()
    setupRevealAnimations()
  }
})()
