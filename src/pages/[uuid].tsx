import { useEffect, useState } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { useRouter } from 'next/router'
import isEqual from 'lodash.isequal'
import { useDeepCompareEffect } from 'ahooks'
import LandingLayout from '@/components/layout/landing'
import { PayeeContext } from '@/components/context/payee'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { bigintFactory } from '@/lib/prisma/common'
import prisma from '@/lib/prisma'
import { useIsLoggedIn, useUserData } from '@/lib/hooks'
import StudioLayout from '@/components/layout/studio'
import { getPayeeAccountSvc } from '@/services/pay'

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

export default function RenderUser({ user: initialUser, payee: initialPayee }) {
  const router = useRouter()

  const localUser = useUserData()

  const [user, setUser] = useState(initialUser)
  const [payee, setPayee] = useState(initialPayee)

  const isLoggedIn = useIsLoggedIn()
  const [isInProfile, setInProfile] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setInProfile(isLoggedIn && localUser?.id == router?.query?.uuid)
  }, [router?.query?.uuid])

  useDeepCompareEffect(() => {
    if (!user?.id) return

    if (!localUser?.id) {
      setUser(user)
      setInProfile(false)
      return
    }

    setLoading(false)

    let equal = isEqual(localUser, user)
    if (isInProfile && !equal) {
      setUser(localUser)
      const getPayeeAccount = async () => {
        try {
          let res = await getPayeeAccountSvc({
            id: localUser?.id,
          })
          if (res?.ok && res?.data) {
            setPayee(res?.data)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      getPayeeAccount()
    }
  }, [localUser])

  if (loading) {
    return <NmSpinInfinity absoluteCenter customClass="loading-lg scale-150" />
  }

  return (
    <PayeeContext.Provider value={{ user, payee }}>
      {!isInProfile || router.query?.newtab ? (
        <LandingLayout payee={payee} user={{ ...user, isInProfile: router.query?.newtab ? false : isInProfile }} />
      ) : (
        <StudioLayout>
          <LandingLayout payee={payee} user={{ ...user, isInProfile }} />
        </StudioLayout>
      )}
    </PayeeContext.Provider>
  )
}
