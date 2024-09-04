import classNames from 'classnames'
import { Box, Button } from '@mui/material'
import PaymentCard from '.'
import LandingCard from '../card'

const PaymentWidget = ({ payee = null, user = null, component = null, classes = null } = {}) => (
  <LandingCard
    title={payee?.title}
    titleClass="mx-auto"
    component={component}
    customClass={classNames('!my-0 w-full h-fit overflow-x-auto overflow-y-hidden 2xl:max-w-fit xl:mx-auto', classes)}
    tpls={{ style: `S00${payee?.style?.theme || 0}` }}
  >
    <PaymentCard user={user} payee={payee} />
    {!payee?.id && (
      <Box className="w-full px-6 h-40 flex justify-center items-center bg-black/50 backdrop-blur absolute bottom-0 left-0 right-0">
        <Button
          size="large"
          variant="contained"
          className="w-full max-w-md rounded-lg text-lg py-3 shadow-sm transition-all bg-create-gradient-004"
          href="/pay"
        >
          Start Your Payments
        </Button>
      </Box>
    )}
  </LandingCard>
)

export default PaymentWidget
