const social = {
  types: {
    twitter: {
      name: 'Twitter',
      icon: 'x',
      color: '#1D9BF0',
      background: '#000',
      url: 'https://x.com/',
    },
    instagram: {
      name: 'Instagram',
      icon: 'instagram',
      color: '#f5017d',
      background:
        'linear-gradient(315deg, #FBE18A 0.96%, #FCBB45 21.96%, #F75274 38.96%, #D53692 52.96%, #8F39CE 74.96%, #5B4FE9 100.96%)',
      url: 'https://instagram.com/',
    },
    youtube: {
      name: 'YouTube',
      icon: 'youtube_filled',
      color: '#ff0000',
      url: 'https://youtube.com/@',
    },
    tiktok: {
      name: 'TikTok',
      icon: 'tiktok',
      color: '#fe2c55',
      url: 'https://tiktok.com/@',
    },
    telegram: {
      name: 'Telegram',
      icon: 'telegram',
      color: '#26a6e7',
      url: 'https://t.me/',
    },
    facebook: {
      name: 'Facebook',
      icon: 'facebook',
      color: '#057eec',
      url: 'https://facebook.com/',
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: 'whatsapp',
      url: 'https://wa.me//',
    },
    reddit: {
      name: 'Reddit',
      icon: 'reddit',
      color: '#FF4500',
      url: 'http://reddit.com/r/',
    },
    threads: {
      name: 'Threads',
      icon: 'threads',
      url: 'http://threads.net/',
    },
    xiaohongshu: {
      name: '小红书',
      icon: 'xiaohongshu',
      color: '#ff2442',
      url: 'https://www.xiaohongshu.com/user/profile/',
      placeholder: 'user id',
    },
    bilibili: {
      name: 'Bilibili',
      icon: 'bilibili',
      url: 'https://space.bilibili.com/',
    },
    buymeacoffee: {
      name: 'Buy Me a Coffee',
      icon: 'buymeacoffee',
      url: 'https://buymeacoffee.com/',
    },
    discord_personal: {
      name: 'Discord Personal',
      icon: 'discord_personal',
    },
    discord: {
      name: 'Discord Group',
      icon: 'discord',
      color: '#5865F2',
      url: 'https://discord.gg/',
    },
    spotify: {
      name: 'Spotify',
      icon: 'spotify',
      color: '#1ed760',
      url: 'https://open.spotify.com/artist/',
    },
    linkedin: {
      name: 'LinkedIn Personal',
      icon: 'linkedin',
      url: 'https://linkedin.com/in/',
    },
    linked_company: {
      name: 'LinkedIn Company',
      icon: 'linkedin_company',
      color: '#0a66c2',
      url: 'https://linkedin.com/company/',
    },
    email: {
      name: 'Email',
      icon: 'email_filled',
      url: 'mailto:',
      color: '#0ae79d',
      placeholder: 'user mailto number',
    },
    weibo: {
      name: 'Weibo',
      icon: 'weibo',
      color: '#e14123',
      url: 'https://weibo.com/',
    },
    wechat: {
      name: 'WeChat',
      icon: 'wechat',
      color: '#51C332',
      placeholder: 'username、user id',
    },
    qq: {
      name: 'QQ',
      icon: 'qq',
      placeholder: 'user number',
    },
    phone: {
      name: 'Phone',
      icon: 'phone',
      placeholder: 'user number',
      url: 'tel:',
    },
    twitch: {
      name: 'Twitch',
      icon: 'twitch',
      url: 'https://twitch.tv/',
    },
    notion: {
      name: 'Notion',
      icon: 'notion',
      url: 'https://notion.so/',
    },
    snapshot: {
      name: 'Snapshot',
      icon: 'snapshot',
      color: '#f3b04e',
      url: 'https://snapshot.org/',
    },
    opensea: {
      name: 'OpenSea',
      icon: 'opensea',
      color: '#007aff',
      url: 'https://opensea.io/',
    },
    rarible: {
      name: 'Rarible',
      icon: 'rarible',
      color: '#feda03',
      url: 'https://rarible.com/',
    },
    nostr: {
      name: 'Nostr',
      icon: 'nostr',
      placeholder: 'Nostr nPubKey as npub1...',
    },
    farcaster: {
      name: 'Farcaster',
      icon: 'farcaster',
      color: '#472a91',
      url: 'http://warpcast.com/',
    },
    lenster: {
      name: 'Lenster',
      icon: 'lenster',
      color: '#8b5cf6',
      url: 'https://hey.xyz/u/',
    },
    mirror: {
      name: 'Mirror',
      icon: 'mirror',
      color: '#007aff',
      url: 'https://mirror.xyz/',
    },
    wallet: {
      name: 'Wallet',
      icon: 'wallet',
      color: '#f58420',
      url: 'https://etherscan.io/address/',
      placeholder: 'address as 0x...',
    },
    etherscan: {
      name: 'Etherscan',
      icon: 'etherscan',
      url: 'https://etherscan.io/token/',
      placeholder: 'contract or token',
    },
    music_apple: {
      name: 'Apple Music',
      icon: 'music_apple',
      url: 'https://music.apple.com/artist/',
    },
    snapchat: {
      name: 'Snapchat',
      icon: 'snapchat',
      color: '#fffc00',
      url: 'https://snapchat.com/add/',
    },
    pinterest: {
      name: 'Pinterest',
      icon: 'pinterest',
      color: '#e60023',
      url: 'https://pinterest.com/',
    },
    behance: {
      name: 'Behance',
      icon: 'behance',
      color: '#0057ff',
      url: 'https://behance.net/',
    },
    dribbble: {
      name: 'Dribbble',
      icon: 'dribbble',
      color: '#ea4c89',
      url: 'https://dribbble.com/',
    },
    onlyfans: {
      name: 'OnlyFans',
      icon: 'onlyfans',
      url: 'https://onlyfans.com/',
    },
    medium: {
      name: 'Medium',
      icon: 'medium',
      url: 'https://medium.com/@',
    },
    github: {
      name: 'GitHub',
      icon: 'github',
      url: 'https://github.com/',
    },
    amazon: {
      name: 'Amazon',
      icon: 'amazon',
      url: 'https://amazon.com/shop/',
    },
    substack: {
      name: 'Substack',
      icon: 'substack',
      placeholder: 'website as https://you.substack.com',
    },
    website: {
      name: 'Official Website',
      icon: 'website',
      placeholder: 'website as http(s)://',
    },
  },
  colors: ['#EC4899', '#F59E0B', '#10B981', '#0EA5E9', '#6366F1', '#8B5CF6'],
}

export default social