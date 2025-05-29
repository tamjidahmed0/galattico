import React from 'react'
import { createClient } from '@/utils/supabase/client'

const page = () => {

    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            console.log('Session:', session)
        } else {
            console.log('No active session found.')
        }
    }).catch(error => {
        console.error('Error fetching session:', error)
    })


  return (
    <div>page</div>
  )
}

export default page