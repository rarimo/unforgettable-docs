import { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  sidebar: [
    {
      type: 'doc',
      label: 'What is Unforgettable.?',
      id: 'overview',
    },
    {
      type: 'html',
      value: `<div class="menu__splitter"></div>`,
    },
    {
      type: 'html',
      value: `<span class="menu__section-header">Embedded Wallets</span>`,
    },
    {
      type: 'doc',
      label: 'Overview',
      id: 'embedded-wallets/overview',
    },
    {
      type: 'doc',
      label: 'Architecture',
      id: 'embedded-wallets/achitecture',
    },
    {
      type: 'doc',
      label: 'Smart account',
      id: 'embedded-wallets/smart-account',
    },
    {
      type: 'doc',
      label: 'Passkeys',
      id: 'embedded-wallets/passkeys',
    },
    {
      type: 'doc',
      label: 'Policy Engine',
      id: 'embedded-wallets/policy-engine',
    },
    {
      type: 'doc',
      label: 'Recovery',
      id: 'embedded-wallets/recovery',
    },
    {
      type: 'html',
      value: `<div class="menu__splitter"></div>`,
    },
    {
      type: 'html',
      value: `<span class="menu__section-header">SDK</span>`,
    },
    {
      type: 'doc',
      label: 'Introduction',
      id: 'sdk/intro',
    },
    {
      type: 'doc',
      label: 'Getting Started',
      id: 'sdk/getting-started',
    },
    {
      type: 'category',
      label: 'Platform Guides',
      collapsible: true,
      collapsed: true,
      items: [
        'sdk/platforms/web',
        'sdk/platforms/react',
        'sdk/platforms/react-native',
        'sdk/platforms/android',
        'sdk/platforms/ios',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsible: true,
      collapsed: true,
      items: [
        'sdk/advanced/architecture',
        'sdk/advanced/encryption',
        'sdk/advanced/data-transfer',
        'sdk/advanced/url-generation',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsible: true,
      collapsed: true,
      items: [
        'sdk/api/unforgettable-sdk',
        'sdk/api/recovery-factors',
        'sdk/api/errors',
      ],
    },
    {
      type: 'link',
      label: 'GitHub',
      href: 'https://github.com/rarimo/unforgettable-sdk',
      customProps: {
        target: '_blank',
        rel: 'noopener',
      },
    },
    {
      type: 'html',
      value: `<div class="menu__splitter"></div>`,
    },
    {
      type: 'doc',
      label: 'Benchmarks',
      id: 'benchmarks',
    },
    {
      type: 'link',
      label: 'Whitepaper',
      href: 'https://unforgettable.app/fuzzy_extractor.pdf',
      customProps: {
        target: '_blank',
        rel: 'noopener',
      },
    },

    // {
    //   type: 'doc',
    //   label: 'Unforgettable Bitcoin',
    //   id: 'bitcoin',
    // },
    // {
    //   type: 'html',
    //   value: `
    //     <div class="menu__splitter"></div>
    //   `,
    // },
    // {
    //   type: 'doc',
    //   label: 'For wallet developers',
    //   id: 'for-wallet-devs',
    // },
    // {
    //   type: 'doc',
    //   label: 'Smart contracts',
    //   id: 'smart-contracts',
    // }
    // {
    //   type: 'html',
    //   value: `
    //     <span class="menu__link menu__link--no-hover">Resources</span>
    //   `,
    // },
    //'resources/glossary',
  ],
}

export default sidebars
