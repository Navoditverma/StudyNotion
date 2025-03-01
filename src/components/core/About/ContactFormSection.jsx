import React from 'react'
import ContactUsForm from '../../ContactPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto  '>
        <h1 className="text-center text-4xl font-semibold">Get in touch</h1>
        <p className="text-center text-richblack-300 mt-3">We’d love to here for you, Please fill out this form.</p>
        <ContactUsForm/>
    </div>
  )
}

export default ContactFormSection