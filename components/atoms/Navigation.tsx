'use client'
import React from 'react'
import { LogOut, Menu } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'



const Navigation = () => {
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()

    console.log(pathname)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/signin') // redirect after logout


    }
    return (
        <nav className="flex items-center lg:justify-around justify-between px-6 py-4 bg-[#161b22] border-b border-[#30363d]">
            <div className="flex items-center lg:space-x-6">
                <span className="text-blue-500 font-semibold text-lg">Galattico Ai</span>

                <div className="hidden lg:flex space-x-4 text-sm text-gray-300">
                    <Link href="/" className={`${pathname === '/' && 'border-b-2 border-blue-500'} text-white font-medium  pb-1`}>Dashboard</Link>
                    <Link href="/profile" className={`${pathname === '/profile' && 'border-b-2 border-blue-500'} hover:text-white`}>Profile</Link>
                </div>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
                <div className='flex gap-3 cursor-pointer text-white' onClick={handleLogout}>
                    <p>Logout</p>
                    <LogOut />
                </div>
    
            </div>
            <div className='lg:hidden'>
                <Menu className="text-gray-400 hover:text-white cursor-pointer" size={24} />
            </div>
        </nav>
    )
}

export default Navigation