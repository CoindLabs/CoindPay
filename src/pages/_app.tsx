import { useRouter } from 'next/router'
import Head from 'next/head'
import Script from 'next/script'
import MobileContent from '@/components/card-group/chains-card/mobile-content'
import { GlobalContextProvider } from '@/components/context'
import { Analytics } from '@vercel/analytics/react'
import NmMetaHead from '@/components/nm-meta-head'

import config from '@/config'

import 'animate.css'
import 'swiper/css'
import 'swiper/css/scrollbar'
import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/index.scss'

const { title, mission } = config

export default function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index,follow" />
        <meta property="description" content={mission} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={title} />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={mission} />
      </Head>
      <NmMetaHead userInfo={pageProps} />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#72db5a" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Courgette&family=Poppins&family=Righteous&family=Satisfy&family=Chillax&family=Lato&family=Fira+Sans&display=swap"
      />

      <Script
        id="iframely-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function loadIframelyEmbedJs() {
              // Replace 'iframe.ly' with your custom CDN if available.
              if (document.querySelectorAll("[data-iframely-url]").length === 0
                  && document.querySelectorAll("iframe[src*='iframe.ly']").length === 0) return;
              var iframely = window.iframely = window.iframely || {};
              if (iframely.load) {
                  iframely.load();
              } else {
                  var ifs = document.createElement('script'); ifs.type = 'text/javascript'; ifs.async = true;
                  ifs.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + '//cdn.iframe.ly/embed.js';
                  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ifs, s);
              }
            }
            // Run after DOM ready.
            loadIframelyEmbedJs();
          `,
        }}
      />
      <GlobalContextProvider>
        <Component {...pageProps} />
        <Analytics />
        <MobileContent />
      </GlobalContextProvider>
    </>
  )
}
