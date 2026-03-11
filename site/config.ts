export interface SiteConfig {
  author: string;
  desc: string;
  title: string;
  ogImage: string;
  lang: string;
  base: string;
  website: string;
  social: Record<string, string>;
  googleAnalyticsId?: string;
  homeHeroDescription: string;
  blogDescription: string;
  projectsDescription: string;

  // Homepage post counts
  featuredPostsCount: number;
  latestPostsCount: number;

  // Homepage projects
  homeProjects: {
    enabled: boolean;
    count: number;
  };

  // CTA (Call-to-Action) block for blog posts
  cta: {
    enabled: boolean;
    filePath: string;
  };

  // Homepage Hero block
  hero: {
    enabled: boolean;
    filePath: string;
  };

  // Giscus comments configuration
  comments: {
    enabled: boolean;
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
    reactionsEnabled: boolean;
    emitMetadata: boolean;
    inputPosition: 'top' | 'bottom';
    theme: string;
    lang: string;
  };
}

export const SITE: SiteConfig = {
  author: 'Russell Brenner',
  desc: 'Infrastructure architect and law student building AI tools for legal practice.',
  title: 'Russell Brenner',
  ogImage: 'og.png',
  lang: 'en-AU',
  base: '/',
  website: 'https://russellbrenner.com',
  social: {
    linkedin: 'https://www.linkedin.com/in/russellbrenner/',
    github: 'https://github.com/russellbrenner',
  },
  googleAnalyticsId: '',
  homeHeroDescription:
    '25 years of infrastructure and pre-sales. Now building AI tools for legal practice and studying law at Swinburne. The code is AI-assisted. The architecture, judgment, and operations are mine.',
  blogDescription:
    'Thinking out loud on infrastructure, AI agents, and building legal tools while studying law.',
  projectsDescription:
    'Tools I build and operate. Some are live. Some are in development. All are real.',

  featuredPostsCount: 2,
  latestPostsCount: 3,

  homeProjects: {
    enabled: true,
    count: 4,
  },

  cta: {
    enabled: true,
    filePath: 'site/cta.md',
  },

  hero: {
    enabled: true,
    filePath: 'site/hero.md',
  },

  comments: {
    enabled: false,
    repo: 'russellbrenner/russellbrenner.com',
    repoId: '',
    category: 'General',
    categoryId: '',
    mapping: 'pathname',
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: 'bottom',
    theme: 'preferred_color_scheme',
    lang: 'en',
  },
};
