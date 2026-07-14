(function () {
  "use strict";

  // Numero do WhatsApp que recebe os leads (mesmo conectado no whatsapp-service do Cerebro CRM).
  var WHATSAPP_NUMBER = "5521985252944";

  // Stub de analytics: nao inventamos IDs de GA4/Meta Pixel. Quando o Pablo colar o
  // gtag.js/fbq real no <head> do index.html, esses eventos passam a ser capturados
  // automaticamente (dataLayer.push funciona com GA4; fbq('track', ...) precisa do
  // pixel real carregado -- ajustar aqui se o pixel for a ferramenta escolhida).
  function trackEvent(name, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
  }

  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      trackEvent("cta_click", { cta_id: el.getAttribute("data-cta") });
    });
  });

  var form = document.getElementById("lead-form");
  var successMsg = document.getElementById("lead-form__success");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var nome = (data.get("nome") || "").trim();
      var whatsapp = (data.get("whatsapp") || "").trim();
      var email = (data.get("email") || "").trim();
      var empresa = (data.get("empresa") || "").trim();
      var produto = (data.get("produto") || "").trim();

      trackEvent("generate_lead", { form_id: "lead-form" });

      var texto = [
        "Olá! Quero minha análise gratuita de licitação.",
        "",
        "Nome: " + nome,
        "WhatsApp: " + whatsapp,
        "E-mail: " + email,
        "Empresa/CNPJ: " + empresa,
        "O que vende: " + produto
      ].join("\n");

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);

      form.hidden = true;
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

      window.open(url, "_blank", "noopener");
    });
  }
})();
