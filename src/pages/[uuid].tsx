import { useEffect, useState } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { useRouter } from 'next/router'
import LandingLayout from '@/components/layout/landing'
import { PayeeContext } from '@/components/context/payee'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { bigintFactory } from '@/lib/prisma/common'
import prisma from '@/lib/prisma'
import { useIsLoggedIn } from '@/lib/hooks'
import StudioLayout from '@/components/layout/studio'

interface Params extends ParsedUrlQuery {
  uuid: string
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  if (!prisma) throw new Error('prisma client not initialized ˙◠˙')

  try {
    const { uuid } = context.params as Params

    if (!uuid) throw new Error('uuid must be provided ˙◠˙')

    let user = await prisma.user.findUnique({
      where: {
        id: uuid,
      },
    })

    if (!user) {
      return {
        notFound: true,
      }
    }

    user = bigintFactory(user)

    let payee = await prisma.payee.findUnique({
      where: {
        uuid,
      },
    })

    payee = bigintFactory(payee)

    return {
      props: {
        user,
        payee,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 10, // In seconds
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      notFound: true,
    }
  }
}

export default function RenderUser({ user, payee }) {
  const router = useRouter()
  const isLoggedIn = useIsLoggedIn({ id: user?.id })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return <NmSpinInfinity absoluteCenter customClass="loading-lg scale-150" />
  }

  return (
    <PayeeContext.Provider value={{ user, payee }}>
      {!isLoggedIn || router.query?.newtab ? (
        <LandingLayout payee={payee} user={user} />
      ) : (
        <StudioLayout>
          <LandingLayout payee={payee} user={user} />
        </StudioLayout>
      )}
    </PayeeContext.Provider>
  )
}
