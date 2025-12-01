import { Options } from '@docusaurus/preset-classic'
import npm2yarn from '@docusaurus/remark-plugin-npm2yarn'
import { Config } from '@docusaurus/types'
import { themes } from 'prism-react-renderer'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

const config: Config = {
  title: 'Unforgettable Docs',
  tagline:
    'User-friendly recovery solution based on ERC-7947 for secure, seedless smart account recovery with visual keys(face, objects), short password, and PoW challenge.',
  url: process.env.URL || 'http://localhost:3000',
  baseUrl: process.env.BASE_URL || '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'favicon.ico',
  noIndex: process.env.STAGING === 'true',
  trailingSlash: true,
  customFields: {
    whitepaperUrl:
      'https://docs.unforgettable.app/files/Rarimo_whitepaper_v3.pdf',
  },
  organizationName: 'rarimo',
  projectName: 'unforgettable-docs',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          breadcrumbs: false,
          showLastUpdateTime: true,
          editUrl: 'https://github.com/rarimo/unforgettable-docs/blob/main',
          remarkPlugins: [[npm2yarn, { sync: true }], remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: { customCss: './src/css/custom.css' },
        gtag: { trackingID: 'G-N54453MXBJ' },
      } as Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: 'Rarimo Logo',
        src: 'img/logo-black.png',
        srcDark: 'img/logo-white.png',
      },
      items: [
        {
          href: 'https://t.me/+pWugh5xgDiE3Y2Jk',
          html: `
              <span class="header__social-link">
              Telegram <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <mask id="mask0_1217_16813" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20"><rect width="20" height="20" fill="currentColor"/></mask><g mask="url(#mask0_1217_16813)"><path d="M5.33329 15L4.16663 13.8333L12.1666 5.83329H4.99996V4.16663H15V14.1666H13.3333V6.99996L5.33329 15Z" fill="currentColor"/></g></svg>
              </span>`,
          position: 'right',
        },
        {
          href: 'https://github.com/rarimo',
          html: `
              <span class="header__social-link">
              GitHub <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <mask id="mask0_1217_16813" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20"><rect width="20" height="20" fill="currentColor"/></mask><g mask="url(#mask0_1217_16813)"><path d="M5.33329 15L4.16663 13.8333L12.1666 5.83329H4.99996V4.16663H15V14.1666H13.3333V6.99996L5.33329 15Z" fill="currentColor"/></g></svg>
              </span>`,
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          items: [
            {
              html: `
                  <img class="footer__logo" src="/img/logo-white.png" alt="Rarimo Logo"/>
                  <img class="footer__logo footer__logo--black" src="/img/logo-black.png" alt="Rarimo Logo"/>
                `,
            },
            {
              html: `<span style="color: var(--primary-text-color)">© ${new Date().getFullYear()}</span>`,
            },
          ],
        },
        {
          items: [
            {
              html: `
                <span style="font-weight: 500">Learn about Rarimo</span>`,
            },
          ],
        },
        {
          items: [
            {
              html: `
                <span style="font-weight: 500">Get in touch</span>`,
            },
            {
              html: `
                <a href="https://t.me/+pWugh5xgDiE3Y2Jk" class="footer__social-link" target="_blank" rel="nofollow noreferrer noopener" aria-label="Telegram">
                Telegram <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <mask id="mask0_1217_16813" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20"><rect width="20" height="20" fill="currentColor"/></mask><g mask="url(#mask0_1217_16813)"><path d="M5.33329 15L4.16663 13.8333L12.1666 5.83329H4.99996V4.16663H15V14.1666H13.3333V6.99996L5.33329 15Z" fill="currentColor"/></g></svg>
                </a>
                `,
            },
            {
              html: `
                <a href="https://x.com/Rarimo_protocol" class="footer__social-link" target="_blank" rel="nofollow noreferrer noopener" aria-label="X">
                X <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <mask id="mask0_1217_16813" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20"><rect width="20" height="20" fill="currentColor"/></mask><g mask="url(#mask0_1217_16813)"><path d="M5.33329 15L4.16663 13.8333L12.1666 5.83329H4.99996V4.16663H15V14.1666H13.3333V6.99996L5.33329 15Z" fill="currentColor"/></g></svg>
                </a>
                `,
            },
          ],
        },
      ],
    },
    algolia: {
      apiKey: 'bec99a178b6435e0f44497971c3a3f35',
      indexName: 'docs_unforgettable_app_v7z0y22hzw_pages',
      appId: 'V7Z0Y22HZW',
      contextualSearch: false,
      searchPagePath: 'search',
      debug: true,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      defaultLanguage: 'javascript',
      additionalLanguages: [
        'json',
        'solidity',
        'bash',
        'rust',
        'tsx',
        'typescript',
        'kotlin',
        'swift',
        'groovy',
        'java',
      ],
    },

    metadata: [
      {
        property: 'og:image',
        content: 'https://docs.unforgettable.app/img/og-img.png',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'og:locale',
        content: 'en_GB',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
  },
  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        max: 1920,
        min: 720,
        steps: 3,
        disableInDev: false,
      },
    ],
    'docusaurus-plugin-llms',
  ],
}

export default config
