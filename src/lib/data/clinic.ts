export const clinic = {
  name: "CardioVale",
  // troca pro domínio próprio assim que ele existir — usado só pra montar
  // links em mensagens (WhatsApp etc), não afeta rotas internas do site
  siteUrl: "https://cardiovale-site-carlos-henrique7.vercel.app",
  legalName: "Instituto de Cardiologia do Vale do Paraíba",
  kicker: "Mais vida para você",
  headline: "Há 32 anos a melhor clínica para o seu coração em São José dos Campos.",
  tagline: "Saúde cardiovascular para uma vida mais completa",
  yearsActive: "mais de 30 anos",
  foundedSince: "Fevereiro de 1993",
  patientsServed: "+100.000",
  examsPerformed: "+400.000",
  address: {
    line: "Av. Nove de Julho, 95 — Sala 13",
    city: "São José dos Campos, SP",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Av. Nove de Julho, 95, São José dos Campos, SP"),
    mapsEmbedSrc:
      "https://www.google.com/maps?q=" +
      encodeURIComponent("Av. Nove de Julho, 95, São José dos Campos, SP") +
      "&output=embed",
  },
  phone: "(12) 3943-4303",
  phoneHref: "tel:+551239434303",
  whatsapp: "(12) 99604-4303",
  whatsappHref: "https://wa.me/5512996044303",
  examsWhatsapp: "(12) 3943-4303",
  examsWhatsappHref: "https://wa.me/551239434303",
  hours: [
    { days: "Segunda a sexta", time: "8h às 18h" },
    { days: "Sábado", time: "9h às 10h30 (retirada de aparelho)" },
  ],
  instagram: "https://www.instagram.com/cardiovale.sjc/",
} as const;
