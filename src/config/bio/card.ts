/*
 * Copyright (c) 2022 Next Labs. All rights reseved.
 * @fileoverview | 判断 blocks card url类型及数据
 * @version 0.1 | 2022-12-08 // Initial version.
 * @Date: 2022-12-08 00:27:42
 * @Last Modified by: 0x3Anthony
 * @Last Modified time: 2024-02-21 18:01:53
 */
import { isUrl } from '@/lib/utils'
import config from '@/config'

const { domains } = config

let nativeSocialEmbeds = [
  {
    type: 'Twitter',
    image: `${domains.cdn}/static/social/x.svg`,
  },
  {
    type: 'Facebook',
    image: `${domains.cdn}/static/social/facebook.svg`,
  },
  {
    type: 'Calendly',
    image: `${domains.cdn}/static/social/calendly.svg`,
  },
  {
    type: 'Linkedin',
    image: `${domains.cdn}/static/social/linkedin.svg`,
  },
  {
    type: 'Spotify',
    image: `${domains.cdn}/static/social/spotify.svg`,
  },
  {
    type: 'TikTok',
    image: `${domains.cdn}/static/social/tiktok.svg`,
  },
  {
    type: 'YouTube',
    image: `${domains.cdn}/static/social/youtube.svg`,
  },
  {
    type: 'Instagram',
    image: `${domains.cdn}/static/social/instagram.svg`,
  },
  {
    type: 'GitHub',
    image: `${domains.cdn}/static/social/github.svg`,
  },
  {
    type: 'Medium',
    image: `${domains.cdn}/static/social/medium.svg`,
  },
  {
    type: 'Dribbble',
    image: `${domains.cdn}/static/social/dribbble.svg`,
  },
  {
    type: 'Apple Music',
    image: `${domains.cdn}/static/social/apple_music.svg`,
  },
  {
    type: 'Behance',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e2e356c51e9e7a7976_iconbehance.svg',
  },
  {
    type: 'Figma',
    image:
      'https://4.bp.blogspot.com/-LiJZ5I8E7K8/XIe_GeI5glI/AAAAAAAAIuw/4Awu8j8r0P8TKBXzyxyslHEfplOlK9-6QCK4BGAYYCw/s640/icon%2Bfigma%2Bvector.png',
  },
  {
    type: 'Discord',
    image: `${domains.cdn}/static/social/discord.svg`,
  },
  {
    type: 'Pinterest',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e2ed2c69168196fb91_iconpinterest.svg',
  },
  {
    type: 'Reddit',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e257c3c1338e638279_iconreddit.svg',
  },
  {
    type: 'Twitch',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e22e70ce51de717701_icontwitch.svg',
  },
  {
    type: 'Devto',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e2170dc3848f4b014f_icondevto.svg',
  },
  {
    type: 'ProductHunt',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e16e32a22e92c45639_iconproducthunt.svg',
  },
  {
    type: 'Webflow',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e2a46bc01c675922ac_iconwebflow.svg',
  },
  {
    type: 'Mastodon',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e2170dc308e64b014e_iconmastodon.svg',
  },
  {
    type: 'Buy Me a Coffee',
    image: 'https://global-uploads.webflow.com/6335b33630f88833a92915fc/638e17e25033cc36b11a4bda_iconbuymeacoffee.svg',
  },
]

export { nativeSocialEmbeds }

export function getCardUrlFactory(url) {
  if (!isUrl(url)) return
  /**
   * Twitter
   */
  if (
    /https?:\/\/(www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/(\d+)/.test(url) ||
    /https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]+)\/status\/(\d+)/.test(url)
  ) {
    let url_twitters = url.split('?')[0]?.split('status/')
    if (url_twitters[1]) {
      return {
        type: 'twitter',
        id: url_twitters[1],
      }
    }
    return null
  }
  /**
   * YouTube
   */
  if (new RegExp('^(https://)?(www.)?youtube.com|youtu.be/(\\w+)', 'i').test(url)) {
    let url_youtubes = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
    if (url_youtubes[2]) {
      return {
        type: 'youtube',
        id: url_youtubes[2].split(/[^0-9a-z_\-]/i)[0],
      }
    }
    return null
  }
  /**
   * Instagram
   */
  if (new RegExp('^(https://)?(www.)?instagram.com/p/(\\w+)', 'i').test(url)) {
    return {
      type: 'instagram',
    }
  }
  /**
   * Facebook
   */
  if (new RegExp('^(https://)?(www.)?facebook.com/(\\w+)', 'i').test(url)) {
    return {
      type: 'facebook',
    }
  }
  /**
   * LinkedIn
   */
  if (new RegExp('^(https://)?(www.)?linkedin.com/embed/feed/(\\w+)', 'i').test(url)) {
    return {
      type: 'linkedin',
    }
  }
  /**
   * TikTok
   */
  if (new RegExp('^(https://)?(www.)?tiktok.com/@(\\w+)', 'i').test(url)) {
    return {
      type: 'tiktok',
    }
  }
  /**
   * Spotify
   */
  if (new RegExp('^(https://)?(www.)?open.spotify.com/(\\w+)', 'i').test(url)) {
    if (!url.includes('/embed/')) {
      url = url.replace('.com/', '.com/embed/')
    }
    return {
      type: 'spotify',
      url,
    }
  }
  /**
   * Calendly
   */
  if (new RegExp('^(https://)?(www.)?calendly.com/(\\w+)', 'i').test(url)) {
    return {
      type: 'calendly',
      url: url.endsWith('hide_gdpr_banner=1') ? url : `${url}?hide_gdpr_banner=1`,
    }
  }
  /**
   * 网易云音乐
   */
  if (new RegExp('^(https://)?(www.)?music.163.com/(\\w+)', 'i').test(url)) {
    return {
      type: 'music163',
      url,
    }
  }
  return null
}
