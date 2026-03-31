import React, { Suspense } from 'react'
import HeroSection from './_components/hero'
import HowItWorksSection from './_components/how-it-works'

const HomePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection/>
      </Suspense>
      <HowItWorksSection/>
    </div>
  )
}

export default HomePage