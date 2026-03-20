import React from 'react'
import PersonalInformationForm from './_components/personal-information-form'
import ProfilePicture from './_components/profile-picture'

const PersonalInformationPage = () => {
  return (
    <div className='container grid col-span-1 md:col-span-3 gap-6 py-10 md:py-14'>
        <ProfilePicture/>
        <PersonalInformationForm/>
    </div>
  )
}

export default PersonalInformationPage