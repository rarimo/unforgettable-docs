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
