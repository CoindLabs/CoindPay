import Image from 'next/image'
import LandingCard from '@/components/dapp/landing/base/card'

import config from '@/config'

const { domains } = config

let partners = [
  {
    name: 'ENS',
    pathId: 1,
  },
  {
    name: 'BASE',
    pathId: 2,
  },
  {
    name: 'Coinbase',
    pathId: 3,
  },
  {
    name: 'Solana',
    pathId: 4,
  },
  {
    name: 'Solana Vancouver',
    pathId: 5,
  },
  {
    name: 'Solana Pay',
    pathId: 6,
  },
  {
    name: 'ICP',
    pathId: 8,
  },
  {
    name: 'Optimism',
    pathId: 10,
  },
  {
    name: 'zkSync',
    pathId: 11,
  },
  {
    name: 'Arbitrum',
    pathId: 12,
  },
  {
    name: 'Alchemy',
    pathId: 17,
  },
  {
    name: 'Thirdweb',
    pathId: 19,
  },
  {
    name: 'Rainbow',
    pathId: 21,
  },
  {
    name: 'Blockscout',
    pathId: 24,
  },
  {
    name: 'LiFi',
    pathId: 31,
  },
  {
    name: 'Fuse',
    pathId: 32,
  },
]

const ContentPartners = props => {
  return (
    <section className={props?.customClass}>
      <ul className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {partners.map((row, index) => (
          <LandingCard
            key={`partner-item-${index}`}
            component="li"
            customClass="!my-1 border border-zinc-700/30"
            innerClass="flex items-center justify-center"
            tpls={{ style: 'S003' }}
          >
            <Image
              className="w-full hover:scale-105 transition-all"
              src={`${domains.cdn}/home/partners/light/${row.pathId}.png`}
              width={200}
              height={100}
              sizes="100vw"
              alt=""
              draggable={false}
            />
          </LandingCard>
        ))}
      </ul>
    </section>
  )
}

export default ContentPartners
