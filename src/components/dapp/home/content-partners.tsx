import Image from 'next/image'
import LandingCard from '@/components/dapp/landing/base/card'
import { logoChains } from '@/lib/chains/logo'

import config from '@/config'
import classNames from 'classnames'

const { domains } = config

let partners = [
  {
    name: 'SOON',
    image: logoChains.soon_text,
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
    name: 'Metis',
    image: logoChains.metis_text,
    class: 'px-5',
  },
  {
    name: 'BASE',
    pathId: 2,
  },
  {
    name: 'Optimism',
    pathId: 10,
  },
  {
    name: 'Arbitrum',
    pathId: 12,
  },
  {
    name: 'zkSync',
    pathId: 11,
  },
  {
    name: 'Glo Dollar',
    image:
      'https://cdn.prod.website-files.com/62289d6493efe7c3b765d6bd/664493c24e3e18ecf0cc6b53_Glo%20Dollar%20(1).svg',
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
            innerClass={classNames('flex items-center justify-center', row?.class)}
            tpls={{ style: 'S003' }}
          >
            <Image
              className="w-full hover:scale-105 transition-all"
              src={row?.image || `${domains.cdn}/home/partners/light/${row.pathId}.png`}
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
