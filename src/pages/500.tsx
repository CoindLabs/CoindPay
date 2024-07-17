import NmStatus from '@/components/nm-status'

export default function Page500() {
  return <NmStatus status={500} imageClass="mb-12" text="Server lost！" />
}
