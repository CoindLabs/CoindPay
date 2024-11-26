import prisma from '@/lib/prisma'
import { bigintFactory } from '@/lib/prisma/common'
import PaymentLanding from '@/components/dapp/landing/base/pay/landing'

export async function getStaticProps(context) {
  const { id } = context.params

  try {
    const [data, user] = await Promise.all([
      prisma.payee.findUnique({ where: { id } }),
      prisma.payee
        .findUnique({
          where: { id },
          select: { uuid: true },
        })
        .then(payee => (payee?.uuid ? prisma.user.findUnique({ where: { id: payee.uuid } }) : null)),
    ])

    if (!data) {
      return { notFound: true }
    }

    const processedData = bigintFactory(data)
    const processedUser = user ? bigintFactory(user) : null

    return {
      props: { data: processedData, user: processedUser },
      revalidate: 10,
    }
  } catch (error) {
    console.error('Error fetching payment link:', error)
    return {
      notFound: true,
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default function PayLinkPageId({ data, user }) {
  return <PaymentLanding data={data} user={user} />
}
