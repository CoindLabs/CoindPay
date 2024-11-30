import OpenLayout from '@/components/layout/open'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import Banner from '@/components/dapp/home/banner'

import ContentEdge from '@/components/dapp/home/content-edge'
import ContentCoins from '@/components/dapp/home/content-coins'
import ContentMoments from '@/components/dapp/home/content-moments'
import ContentUsers from '@/components/dapp/home/content-users'
import ContentPartners from '@/components/dapp/home/content-partners'

const Index = () => {
  return (
    <OpenLayout>
      <Header customClass="w-full px-4 sm:px-8 pt-4 sm:pt-8 absolute top-0 z-1" buttonClass="text-white" />
      <Banner />
      <ContentEdge />
      <ContentCoins />
      <ContentMoments />
      <ContentUsers />
      <ContentPartners customClass="pb-24 -mt-24 sm:-mt-44 lg:-mt-24 xl:-mt-[28rem] 2xl:-mt-[33rem] px-6 sm:px-14" />
      <Footer />
    </OpenLayout>
  )
}

export default Index
