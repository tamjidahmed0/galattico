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
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

//  Zod Schema
const formSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

export default function Signup() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })



  const onSubmit = async (formData: FormData) => {
    setIsLoading(true) // Set loading state
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      console.log(data)

      if (error) {
        console.error('Error signing up:', error.message)
        toast.error(error.message)
        return
      }

      if (data.user?.identities && data.user.identities.length) {
        router.push('/signup/confirmation')
      } else {
        toast.error('User already exists with this email address')
        setIsLoading(false) // Reset loading state
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Suspense fallback={<Loader2 className="size-6 animate-spin" />}>
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <ToastContainer position="top-center" autoClose={3000} />
          <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Create your account</h2>
            <p className="text-sm text-center text-gray-400">Sign up to get started</p>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm mb-1">Full name</label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Email address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm mb-1">Confirm password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className="w-full px-3 py-2 pr-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold cursor-pointer"
              >
                {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Create account
              </button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <hr className="w-full border-gray-600" />
              <span className="absolute bg-gray-800 px-2 text-gray-400 text-sm">Or continue with</span>
            </div>

            <GoogleSignin />

            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-500 underline">Sign in</Link>
            </p>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
