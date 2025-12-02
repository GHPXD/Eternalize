/**
 * Landing page constants
 * Centralized content for easy updates and i18n support
 */

export const LANDING_PAGE = {
  HERO: {
    BADGE: "Preserve Memórias Para Sempre",
    TITLE: "Eternizale",
    SUBTITLE: "Crie Memórias Digitais Eternas",
    DESCRIPTION: "Transforme seus momentos preciosos em belas páginas de memória digital. Perfeito para presentes, celebrações e preservar memórias para sempre. Compartilhe emoções que duram uma vida inteira.",
    CTA_PRIMARY: "Começar Agora",
    CTA_SECONDARY: "Testar Editor",
  },
  
  SOCIAL_PROOF: [
    { icon: "check", text: "Comece Grátis" },
    { icon: "check", text: "Sem Cartão de Crédito" },
    { icon: "check", text: "Teste Completo" },
  ],

  FEATURES: {
    TITLE: "Por que escolher o Eternizale?",
    SUBTITLE: "Crie páginas de memória incríveis com recursos poderosos projetados para contar histórias emocionantes",
    ITEMS: [
      {
        id: "rich-media",
        icon: "Image",
        gradient: "from-violet-500 to-purple-600",
        title: "Suporte a Mídia Rica",
        description: "Faça upload de fotos, vídeos e arquivos de áudio. Todas as imagens são automaticamente otimizadas para WebP para carregamento rápido.",
      },
      {
        id: "music",
        icon: "Music",
        gradient: "from-pink-500 to-rose-600",
        title: "Música de Fundo",
        description: "Adicione profundidade emocional com música de fundo e mensagens de voz para tornar as memórias verdadeiramente especiais.",
      },
      {
        id: "themes",
        icon: "Sparkles",
        gradient: "from-blue-500 to-cyan-600",
        title: "Temas Personalizados",
        description: "Personalize com cores, fontes e layouts customizados para combinar com seu estilo único e sua história.",
      },
      {
        id: "security",
        icon: "Shield",
        gradient: "from-green-500 to-emerald-600",
        title: "Seguro e Privado",
        description: "Suas memórias estão protegidas com segurança de nível empresarial e controles de privacidade.",
      },
      {
        id: "performance",
        icon: "Zap",
        gradient: "from-orange-500 to-amber-600",
        title: "Ultra Rápido",
        description: "Performance otimizada com imagens WebP e CDN global para carregamento instantâneo em qualquer lugar do mundo.",
      },
      {
        id: "love",
        icon: "Heart",
        gradient: "from-red-500 to-pink-600",
        title: "Feito com Amor",
        description: "Criado para ajudá-lo a expressar emoções e criar presentes significativos que tocam corações.",
      },
    ],
  },

  CTA_SECTION: {
    TITLE: "Pronto para criar sua primeira memória?",
    DESCRIPTION: "Junte-se a milhares de pessoas criando belas memórias digitais. Comece gratuitamente, sem cartão de crédito.",
    BUTTON_TEXT: "Começar a Criar Agora",
  },

  STRUCTURED_DATA: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Eternizale",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "100"
    },
    "description": "Crie belas páginas de memória digital com fotos, vídeos, música e mensagens de voz. Perfeito para presentes e celebrações.",
    "url": "https://eternizale.com",
    "screenshot": "https://eternizale.com/og-image.png",
    "featureList": [
      "Suporte a Mídia Rica",
      "Música de Fundo",
      "Temas Personalizados",
      "Seguro e Privado",
      "Performance Ultra Rápida",
      "Otimização de Imagens WebP"
    ]
  }
} as const;
