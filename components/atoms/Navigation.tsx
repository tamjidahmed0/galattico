'use client'
import React from 'react'
import { LogOut, Menu, LayoutDashboardIcon, User2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from './MobileMenu'




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

                <Link href={'/'} className="relative w-[120px] h-[70px]">
                    <Image
                        src="/galattico.png"
                        alt="galattico ai logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </Link>


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
                <MobileMenu

                    trigger={
                        <Menu
                            className="text-gray-400 hover:text-white cursor-pointer"
                            size={24}
                        />
                    }
                >
                    {/* Drawer content */}
                    <ul className="mt-6 space-y-4 text-sm">
                        <li>
                            <Link
                                href="/"
                                className={`${pathname === '/' && 'bg-gray-500'} flex items-center gap-3 px-4 py-2  text-white hover:bg-gray-500 hover:text-white transition-all`}
                            >
                                <LayoutDashboardIcon size={20} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/profile"
                                className={`${pathname === '/profile' && 'bg-gray-500'} flex items-center gap-3 px-4 py-2 text-white hover:bg-gray-500 hover:text-white transition-all`}
                            >
                                <User2 size={20} />

                                <span>Profile</span>
                            </Link>
                        </li>

                        <li onClick={handleLogout}>
                            <div

                                className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-gray-500 hover:text-white transition-all"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </div>
                        </li>
                    </ul>

                </MobileMenu>
            </div>




        </nav>
    )
}

export default Navigation