let title = 'CoindPay',
  domains = {
    master: 'https://coindpay.xyz',
    docs: 'https://docs.coindpay.xyz',
    dev: 'https://dev.coindpay.xyz',
    cdn: 'https://cdn.coindpay.xyz',
    cdn_test: 'https://test-cdn.coindpay.xyz',
  }

let mission = 'Multichain DEXs、Payments and Compound Finance Infrastructure'

const config = {
  title,
  mission,
  domains,
  host: 'coindpay.xyz',
  prefix: 'coindpay',
  themes: {
    primary: '#3772FF',
    success: '#09bf4b',
    accent: '#570DF8',
    warning: '#f37e00',
    error: '#FD2929',
    secondary: '#F000B8',
    disabled: '#E6E8EC',
    light: '#fff',
    dark: '#000',
    backgroundImage: {
      'create-gradient-001': 'linear-gradient(90deg, #FC6D76 0%, #F320A2 100%)',
      'create-gradient-002': 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
      'create-gradient-003': 'linear-gradient(to right, #F82F9D 0%, #4510F3 100%)',
      'create-gradient-004': 'linear-gradient(135deg,#fc692a,#ffd800 26.04%,#72db5a 49.48%,#6dc4fe 75.52%,#cdb9fa)',
      'badge-gradient-001':
        'radial-gradient(111.89% 213.6% at 24.99% 43.36%, rgba(51, 71, 255, 0.4) 0%, rgba(223, 226, 255, 0.216) 74.98%, rgba(107, 122, 255, 0.4) 100%)',
      'badge-gradient-002': 'linear-gradient(138.43deg, #021918 -0.1%, rgba(40, 80, 225, 0.5) 162.62%)',
      'clip-gradient-001': 'linear-gradient(to right, #2a8af6 0%, #e92a67 100%)',
      'theconvo-gradient-001': "url('https://cdn.coindpay.xyz/status/gradient.webp')",
    },
  },
  logo: {
    light: `${domains.cdn}/stream/brand/logo/light.png`,
    dark: `${domains.cdn}/stream/brand/logo/dark.png`,
    pro_colors: `${domains.cdn}/stream/brand/logo/pro_colors.svg`,
  },
  images: {
    placeholder: 'https://picsum.photos/256/256/?blur=5',
    nft_placeholder: `${domains.cdn}/status/nft_placeholder.png`,
    banner: {
      cover: `${domains.cdn}/stream/brand/banner/brand_banner_01.jpg`,
    },
  },
  footer: {
    links: [
      {
        menu: 'Resources',
        list: [
          {
            name: 'Docs',
            url: domains.docs,
            target: '_blank',
          },
          {
            name: 'Brands',
            url: `${domains.docs}/landing/brand`,
            target: '_blank',
          },
        ],
      },
      {
        menu: 'Governance',
        list: [
          {
            name: 'DAO',
          },
          {
            name: 'Feedback',
            url: 'mailto:support@coindpay.xyz',
          },
        ],
      },
      {
        menu: 'Legal',
        list: [
          {
            name: 'Terms of Service',
            url: '/user/terms',
            target: '_blank',
          },
          {
            name: 'Privacy Policy',
            url: '/user/privacy',
            target: '_blank',
          },
        ],
      },
    ],
    media: [
      {
        icon: 'x',
        name: 'Twitter',
        url: '//x.com/CoindPay',
      },
      {
        icon: 'farcaster',
        name: 'Farcaster',
        url: '//warpcast.com/CoindPay',
      },
      {
        icon: 'github',
        name: 'GitHub',
        url: '//github.com/CoindLabs',
      },
      {
        icon: 'discord',
        name: 'Discord',
      },
      {
        icon: 'telegram',
        name: 'Telegram',
      },
      {
        icon: 'email',
        name: 'Email',
        url: 'mailto:contact@coindpay.xyz',
      },
    ],
  },
  organization: {
    name: 'Coind Labs',
  },
}

export default config
