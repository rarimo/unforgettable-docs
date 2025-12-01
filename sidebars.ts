import { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  sidebar: [
    {
      type: 'doc',
      label: 'What is Unforgettable.?',
      id: 'overview',
    },
    {
      type: 'category',
      label: 'SDK',
      link: {
        type: 'doc',
        id: 'sdk/intro',
      },
      collapsible: true,
      collapsed: false,
      items: [
        'sdk/intro',
        {
          type: 'category',
          label: 'Getting Started',
          collapsible: true,
          collapsed: false,
          items: [
            'sdk/getting-started/installation',
            'sdk/getting-started/quick-start',
          ],
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
      ],
    },
    {
      type: 'html',
      value: `
        <div class="menu__splitter"></div>
      `,
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
