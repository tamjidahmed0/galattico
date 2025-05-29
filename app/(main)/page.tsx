'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import moment from 'moment';
import { createClient } from '@/utils/supabase/client';





type User = {
  email: string,
  avatar?: string
  user_metadata: {
    full_name?: string
    picture?: string
  },
  last_sign_in_at: string

}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [picture, setPicture] = useState<string | null>(null)
  const supabase = createClient()


  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        setPicture(data.user.user_metadata.picture)

        if (data.user.email) setUser({
          ...data.user,
          avatar: data.user.user_metadata.picture,
          email: data.user.email,
          last_sign_in_at: data.user.last_sign_in_at ?? ''
        })
      } else {
        console.log('error:', error)
      }
    }

    fetchUser()
  },[supabase.auth])




  return (
    <div className="min-h-screen bg-[#0d1117] text-white">


      <main className="p-8 space-y-6 lg:mx-52">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={picture || undefined} />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">Welcome, {user?.user_metadata?.full_name}</h1>
            <p className="text-sm text-gray-400">Your personalized dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#161b22] text-white border-0">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2 text-2xl">Account Overview</h2>
              <p className="text-md">Email :</p>
              <p className="text-sm font-medium mb-2">{user?.email}</p>
              <p className="text-md">Last sign in :</p>
              <p className="text-sm font-medium"> {moment(user?.last_sign_in_at).format('D MMM YYYY, h:mm A')}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#161b22] text-white border-0">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2 text-2xl">Security</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm">2FA</span>
                <Badge variant="destructive" className="bg-orange-600 text-white">Not enabled</Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Password</span>
                <Badge className="bg-emerald-600 text-white">Secure</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#161b22] text-white border-0">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4 text-2xl">Recent Activity</h2>
            <ul className="space-y-2">

              <li className="flex items-center text-sm text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                Signin <span className="ml-2 text-gray-400">{moment(user?.last_sign_in_at).fromNow()}</span>
              </li>

            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
