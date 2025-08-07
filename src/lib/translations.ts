export const translations = {
  en: {
    // Header
    about: "About",
    services: "Services", 
    blog: "Blog",
    revox: "Revox",
    getInTouch: "Get in Touch",
    tryRevoxFree: "Try Revox Free",
    
    // Hero Section
    heroSubtitle: "Product Owner & SaaS Creator",
    heroTitle: "Building better products through",
    heroTitleHighlight: "user insights",
    heroDescription: "I'm a freelance Product Owner who helps teams build user-centric digital experiences. I also created Revox, a SaaS platform that transforms app store feedback into actionable product insights.",
    
    // Services Section
    servicesTitle: "Product Ownership Services",
    servicesDescription: "Comprehensive support for your product development journey",
    productStrategy: "Product Strategy",
    productStrategyDesc: "Define vision and roadmaps aligned with business goals",
    userResearch: "User Research", 
    userResearchDesc: "Deep user insights through feedback analysis and research",
    dataDecisions: "Data-Driven Decisions",
    dataDecisionsDesc: "Analytics and metrics to guide product choices",
    viewAllServices: "View All Services",
    
    // Revox Section
    introducingRevox: "Introducing Revox",
    revoxTitle: "Turn user feedback into product decisions",
    revoxDescription: "Built from my experience as a Product Owner, Revox automatically analyzes app store reviews to help teams identify issues, prioritize features, and make data-driven product decisions.",
    revoxFeature1: "Automated review collection and analysis",
    revoxFeature2: "AI-powered categorization and insights", 
    revoxFeature3: "Save 10+ hours per week on manual analysis",
    revoxFeature4: "Used by 500+ product teams worldwide",
    exploreRevox: "Explore Revox",
    teamsUsing: "Teams using Revox",
    reviewsAnalyzed: "Reviews analyzed",
    
    // CTA Section
    ctaTitle: "Ready to build better products together?",
    ctaDescription: "Whether you need Product Owner expertise or want to transform your feedback analysis with Revox, I'm here to help.",
    readMyBlog: "Read My Blog",
  },
  fr: {
    // Header
    about: "À propos",
    services: "Services",
    blog: "Blog", 
    revox: "Revox",
    getInTouch: "Contactez-moi",
    tryRevoxFree: "Essayer Revox gratuitement",
    
    // Hero Section
    heroSubtitle: "Product Owner & Créateur SaaS",
    heroTitle: "Créer de meilleurs produits grâce aux",
    heroTitleHighlight: "insights utilisateurs",
    heroDescription: "Je suis un Product Owner freelance qui aide les équipes à créer des expériences digitales centrées sur l'utilisateur. J'ai aussi créé Revox, une plateforme SaaS qui transforme les commentaires des app stores en insights produit exploitables.",
    
    // Services Section
    servicesTitle: "Services de Product Ownership",
    servicesDescription: "Support complet pour votre parcours de développement produit",
    productStrategy: "Stratégie Produit",
    productStrategyDesc: "Définir une vision et des roadmaps alignées avec les objectifs business",
    userResearch: "Recherche Utilisateur",
    userResearchDesc: "Insights utilisateur approfondis grâce à l'analyse de feedback et la recherche",
    dataDecisions: "Décisions Data-Driven",
    dataDecisionsDesc: "Analytics et métriques pour guider les choix produit",
    viewAllServices: "Voir tous les services",
    
    // Revox Section
    introducingRevox: "Découvrez Revox",
    revoxTitle: "Transformez les retours utilisateurs en décisions produit",
    revoxDescription: "Construit à partir de mon expérience de Product Owner, Revox analyse automatiquement les avis des app stores pour aider les équipes à identifier les problèmes, prioriser les fonctionnalités et prendre des décisions produit basées sur la data.",
    revoxFeature1: "Collection et analyse automatisée des avis",
    revoxFeature2: "Catégorisation et insights alimentés par l'IA",
    revoxFeature3: "Économisez 10+ heures par semaine d'analyse manuelle", 
    revoxFeature4: "Utilisé par 500+ équipes produit dans le monde",
    exploreRevox: "Explorer Revox",
    teamsUsing: "Équipes utilisant Revox",
    reviewsAnalyzed: "Avis analysés",
    
    // CTA Section
    ctaTitle: "Prêt à créer de meilleurs produits ensemble ?",
    ctaDescription: "Que vous ayez besoin d'expertise Product Owner ou que vous souhaitiez transformer votre analyse de feedback avec Revox, je suis là pour vous aider.",
    readMyBlog: "Lire mon blog",
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;