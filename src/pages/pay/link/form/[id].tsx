import PaymentLink from '@/components/dapp/landing/base/pay/link'
import PaymentsLayout from '@/components/layout/payments'
import prisma from '@/lib/prisma'
import { bigintFactory } from '@/lib/prisma/common'

export async function getStaticProps(context) {
  const { id } = context.params

  try {
    let data = await prisma.payee.findUnique({
      where: { id },
    })

    if (!data) {
      return { notFound: true }
    }

    data = bigintFactory(data)

    return {
      props: { data },
      revalidate: 10,
    }
  } catch (error) {
    console.error('Error fetching payment link:', error)
    return {
      notFound: true,
      // props: { error: 'Failed to load payment link ˙◠˙' },
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default function PayLinkFormId({ data, error }) {
  return (
    <PaymentsLayout navTitle="Update Payment Link">
      <PaymentLink data={data} />
    </PaymentsLayout>
  )
}
