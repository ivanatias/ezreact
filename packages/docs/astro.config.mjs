// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'EzReact',
      description:
        'Collection of carefully crafted, performant, well-tested, and dependency free React utilities that you can copy and paste in your projects.',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg'
      },
      social: {
        github: 'https://github.com/ivanatias/ezreact'
      },
      sidebar: [
        {
          label: 'EzReact',
          items: [
            {
              label: 'Getting started',
              link: '/getting-started'
            },
            {
              label: 'CLI',
              link: '/cli'
            }
          ]
        },
        {
          label: 'Utilities',
          autogenerate: { directory: 'utilities' }
        }
      ],
      customCss: ['./src/tailwind.css']
    }),
    tailwind({ applyBaseStyles: false })
  ]
})
