/**
 * Landing page constants
 * Centralized content for easy updates and i18n support
 */

export const LANDING_PAGE = {
  HERO: {
    BADGE: "Preserve Memories Forever",
    TITLE: "Eternizale",
    SUBTITLE: "Create Eternal Digital Memories",
    DESCRIPTION: "Transform your precious moments into beautiful digital memory pages. Perfect for gifts, celebrations, and preserving memories forever. Share emotions that last a lifetime.",
    CTA_PRIMARY: "Get Started",
    CTA_SECONDARY: "Try Editor",
  },
  
  SOCIAL_PROOF: [
    { icon: "check", text: "Comece Grátis" },
    { icon: "check", text: "Sem Cartão de Crédito" },
    { icon: "check", text: "Teste Completo" },
  ],

  FEATURES: {
    TITLE: "Why Choose Eternizale?",
    SUBTITLE: "Create stunning memory pages with powerful features designed for emotional storytelling",
    ITEMS: [
      {
        id: "rich-media",
        icon: "Image",
        gradient: "from-violet-500 to-purple-600",
        title: "Rich Media Support",
        description: "Upload photos, videos, and audio files. All images automatically optimized to WebP for fast loading.",
      },
      {
        id: "music",
        icon: "Music",
        gradient: "from-pink-500 to-rose-600",
        title: "Background Music",
        description: "Add emotional depth with background music and voice messages to make memories truly special.",
      },
      {
        id: "themes",
        icon: "Sparkles",
        gradient: "from-blue-500 to-cyan-600",
        title: "Custom Themes",
        description: "Personalize with custom colors, fonts, and layouts to match your unique style and story.",
      },
      {
        id: "security",
        icon: "Shield",
        gradient: "from-green-500 to-emerald-600",
        title: "Secure & Private",
        description: "Your memories are protected with enterprise-grade security and privacy controls.",
      },
      {
        id: "performance",
        icon: "Zap",
        gradient: "from-orange-500 to-amber-600",
        title: "Lightning Fast",
        description: "Optimized performance with WebP images and global CDN for instant loading worldwide.",
      },
      {
        id: "love",
        icon: "Heart",
        gradient: "from-red-500 to-pink-600",
        title: "Made with Love",
        description: "Crafted to help you express emotions and create meaningful gifts that touch hearts.",
      },
    ],
  },

  CTA_SECTION: {
    TITLE: "Ready to Create Your First Memory?",
    DESCRIPTION: "Join thousands creating beautiful digital memories. Start for free, no credit card required.",
    BUTTON_TEXT: "Start Creating Now",
  },

  STRUCTURED_DATA: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Eternizale",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "100"
    },
    "description": "Create beautiful digital memory pages with photos, videos, music, and voice messages. Perfect for gifts and celebrations.",
    "url": "https://eternizale.com",
    "screenshot": "https://eternizale.com/og-image.png",
    "featureList": [
      "Rich Media Support",
      "Background Music",
      "Custom Themes",
      "Secure & Private",
      "Lightning Fast Performance",
      "WebP Image Optimization"
    ]
  }
} as const;
