(function () {
  "use strict";

  var WPP_NUMBER = "556184179578";
  var WPP_DEFAULT_URL =
    "https://wa.me/556184179578?text=Ol%C3%A1!+Vim+pelo+site+e+gostaria+de+solicitar+um+or%C3%A7amento+para+um+projeto+de+m%C3%B3veis+planejados.";

  var pushLeadEvent = function (channel) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "generate_lead",
      lead_channel: channel,
      page_path: window.location.pathname,
    });
  };

  var tinyslider = function () {
    var el = document.querySelectorAll(".testimonial-slider");

    if (el.length > 0 && typeof window.tns === "function") {
      window.tns({
        container: ".testimonial-slider",
        items: 1,
        axis: "horizontal",
        controlsContainer: "#testimonial-nav",
        swipeAngle: false,
        speed: 700,
        nav: true,
        controls: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3500,
        autoplayButtonOutput: false,
      });
    }
  };
  tinyslider();

  // Pré-carregamento sutil das páginas internas no hover para transição instantânea
  var initSmoothPageTransitions = function () {
    var prefetched = {};
    document.querySelectorAll('a[href$=".html"]').forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        var href = link.getAttribute("href");
        if (!href || prefetched[href]) return;
        prefetched[href] = true;
        var prefetchLink = document.createElement("link");
        prefetchLink.rel = "prefetch";
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
      });
    });
  };
  initSmoothPageTransitions();

  // Máscaras e higienização de inputs + Envio estruturado para o WhatsApp
  var formatPhoneBR = function (value) {
    var digits = value.replace(/\D/g, "");
    if (digits.length > 11 && digits.startsWith("55")) {
      digits = digits.slice(2);
    }
    digits = digits.slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 2) return "(" + digits;
    if (digits.length <= 6) {
      return "(" + digits.slice(0, 2) + ") " + digits.slice(2);
    }
    if (digits.length <= 10) {
      return (
        "(" +
        digits.slice(0, 2) +
        ") " +
        digits.slice(2, 6) +
        "-" +
        digits.slice(6)
      );
    }
    return (
      "(" +
      digits.slice(0, 2) +
      ") " +
      digits.slice(2, 7) +
      "-" +
      digits.slice(7)
    );
  };

  var initInputMasks = function () {
    document.querySelectorAll('input[type="tel"]').forEach(function (input) {
      input.addEventListener("input", function (e) {
        e.target.value = formatPhoneBR(e.target.value);
      });
    });

    document.querySelectorAll('input[name="fname"]').forEach(function (input) {
      input.addEventListener("input", function (e) {
        e.target.value = e.target.value
          .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, "")
          .replace(/\s{2,}/g, " ");
      });
    });

    document.querySelectorAll('input[type="email"]').forEach(function (input) {
      input.addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\s+/g, "").toLowerCase();
      });
    });
  };
  initInputMasks();

  var initWhatsAppForms = function () {
    document.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    var wppButtons = document.querySelectorAll("a.wpp");
    wppButtons.forEach(function (btn) {
      btn.href = WPP_DEFAULT_URL;
      btn.addEventListener("click", function () {
        pushLeadEvent("whatsapp_floating");
      });
    });

    var forms = document.querySelectorAll(".js-wpp-form");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var fname = (form.querySelector('[name="fname"]')?.value || "").trim();
        var contato = (form.querySelector('[name="lname"]')?.value || "").trim();
        var email = (form.querySelector('[name="email"]')?.value || "").trim();
        var message = (form.querySelector('[name="message"]')?.value || "").trim();

        var linhas = [
          "Olá! Vim pelo site e gostaria de solicitar um orçamento para um projeto de móveis planejados.",
          "",
          "*Nome:* " + (fname || "Não informado"),
        ];

        if (contato) {
          linhas.push("*Contato:* " + contato);
        }
        if (email) {
          linhas.push("*E-mail:* " + email);
        }
        if (message) {
          linhas.push("*Mensagem:* " + message);
        }

        var url =
          "https://wa.me/" +
          WPP_NUMBER +
          "?text=" +
          encodeURIComponent(linhas.join("\n"));

        pushLeadEvent("whatsapp_form");
        window.open(url, "_blank", "noopener,noreferrer");

        var modalEl = form.closest(".modal");
        if (modalEl && window.bootstrap) {
          var modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }
        form.reset();
      });
    });
  };
  initWhatsAppForms();

  // Revelação suave de imagens abaixo da dobra em CSS puro (sem ocultar o Hero LCP e sem CDN externo)
  var initScrollImageAnimations = function () {
    if (
      !("IntersectionObserver" in window) ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }

    var targets = Array.from(
      document.querySelectorAll(
        ".why-choose-section .img-wrap img, .why-choose-section .feature .icon img, .we-help-section .imgs-grid .grid img, .card-section .post-entry .post-thumbnail img"
      )
    );
    if (targets.length === 0) return;

    // Separa leituras de geometria das escritas de classe para evitar layout thrashing
    var belowFold = targets.filter(function (el) {
      return el.getBoundingClientRect().top >= window.innerHeight;
    });

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }
    );

    belowFold.forEach(function (el) {
      el.classList.add("js-reveal");
      observer.observe(el);
    });
  };
  initScrollImageAnimations();
})();
