'use client'

import { useState, Suspense } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import GoogleSignin from '@/components/GooleSignIn'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'

// Zod Schema
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type FormData = z.infer<typeof schema>

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true)

    try {
      const { data } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (!data.user) {
        toast.error('Invalid email or password')
        setIsLoading(false)
      } else {
        setIsLoading(false)
        router.push('/')
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Suspense fallback={<Loader2 className="size-6 animate-spin flex items-center justify-center" />}>
        <div className="min-h-dvh flex items-center justify-center bg-gray-900 text-white">
          <ToastContainer position="top-center" autoClose={3000} />
          <div className="w-full max-w-md p-8 space-y-6 lg:bg-gray-800 lg:rounded-lg lg:shadow-md">


            <div className='w-full flex items-center justify-center'>
              <div className="relative w-[180px] h-[70px] ">
                <Image
                  src="/galattico.png"
                  alt="galattico ai logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>





            {/* <h2 className="text-2xl font-bold text-center">Sign in to your account</h2> */}
            <p className="text-sm text-center text-gray-400">Sign in to get started</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full px-3 py-2 pr-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold cursor-pointer"
              >
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Sign in
              </button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <hr className="w-full border-gray-600" />
              <span className="absolute bg-gray-900 lg:bg-gray-800 px-2 text-gray-400 text-sm">
                Or continue with
              </span>
            </div>

            <GoogleSignin text='Sign in with Google' />

            <p className="text-center text-sm text-gray-400 mt-4">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>

    
            <p className="text-sm text-center text-gray-400 mt-15">
              By continuing, you agree to our&nbsp;
              <Link href="/terms" className="text-blue-500 hover:underline">Terms of Use</Link>
              &nbsp;and&nbsp;
              <Link href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
            </p>

          </div>
        </div>
      </Suspense>


    </div>


  )
}

export default SignIn
