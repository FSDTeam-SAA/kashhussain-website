import React, { Suspense } from 'react'
import PaymentSuccessContainer from './_components/payment-success-container'

const PaymentSuccessPage = () => {
  return (
    <div>
       <Suspense fallback={<div>Loading...</div>}>
         <PaymentSuccessContainer />
       </Suspense>
    </div>
  )
}

export default PaymentSuccessPage