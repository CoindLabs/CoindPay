import PaymentsLayout from '@/components/layout/payments'
import PaymentLink from '@/components/dapp/landing/base/pay/link'

export default function PayLinkPage() {
  return (
    <PaymentsLayout navTitle="Create Payment Link">
      <PaymentLink />
    </PaymentsLayout>
  )
}
