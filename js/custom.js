(function () {
  "use strict";

  var WPP_NUMBER = "556184179578";
  var WPP_DEFAULT_URL =
    "https://wa.me/556184179578?text=Ol%C3%A1!+Vim+pelo+site+e+gostaria+de+solicitar+um+or%C3%A7amento+para+um+projeto+de+m%C3%B3veis+planejados.";

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

  // Animações suaves de imagens no scroll com Anime.js (ESM: esm.sh / jsDelivr)
  var initScrollImageAnimations = function () {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    var targets = Array.from(
      document.querySelectorAll(
        ".why-choose-section .img-wrap img, .why-choose-section .feature .icon img, .we-help-section .imgs-grid .grid img, .card-section .post-entry .post-thumbnail img, .footer-section .sofa-img img"
      )
    );

    import("https://esm.sh/animejs")
      .catch(function () {
        return import("https://cdn.jsdelivr.net/npm/animejs/+esm");
      })
      .then(function (anime) {
        var animate = anime.animate;
        var stagger = anime.stagger;
        if (!animate) return;

        // 1. Imagem do Hero (sem alterar o texto do Hero)
        var heroImg = document.querySelector(".hero .hero-img-wrap img");
        if (heroImg) {
          animate(heroImg, {
            opacity: [0, 1],
            translateX: [24, 0],
            scale: [0.97, 1],
            duration: 850,
            ease: "outCubic",
          });
        }

        if (targets.length === 0) return;

        var observer = new IntersectionObserver(
          function (entries, obs) {
            var icons = [];
            var photos = [];
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                if (entry.target.closest(".feature .icon")) {
                  icons.push(entry.target);
                } else {
                  photos.push(entry.target);
                }
                obs.unobserve(entry.target);
              }
            });
            if (icons.length > 0) {
              animate(icons, {
                opacity: [0, 1],
                scale: [0.6, 1],
                delay: stagger ? stagger(70) : 0,
                duration: 550,
                ease: "outCubic",
              });
            }
            if (photos.length > 0) {
              animate(photos, {
                opacity: [0, 1],
                translateY: [28, 0],
                scale: [0.96, 1],
                delay: stagger ? stagger(90) : 0,
                duration: 750,
                ease: "outCubic",
              });
            }
          },
          { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
        );

        targets.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top >= window.innerHeight) {
            el.style.opacity = "0";
          }
          observer.observe(el);
        });
      })
      .catch(function () {
        targets.forEach(function (el) {
          el.style.opacity = "1";
        });
      });
  };
  initScrollImageAnimations();
})();
