'use client'

import { useState , useEffect} from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'




const Profile = () => {

  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [email, setEmail] = useState('')
 

  const supabase = createClient()

  const handleEditToggle = () => setIsEditing(!isEditing)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value)
  }

  const handleSave = async() => {
    
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: displayName,
      }
    })
    if (data?.user) {
      toast.success('Profile updated successfully!')
    }

    

    if (error) {
      console.error('Error updating user:', error)
      return
    }   

    setIsEditing(false)
  }


  useEffect(()=>{

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        setDisplayName(data.user.user_metadata.full_name )
        setAvatar(data.user.user_metadata.picture)
        setEmail(data.user.user_metadata.email)
        
      } else {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()



  },[supabase.auth])



  return (
    <div className='overflow-y-auto pt-10'>
      <div className="max-w-3xl mx-auto bg-[#1f2937] text-white rounded-2xl p-6 shadow-lg">
           <ToastContainer position="top-center" autoClose={3000} />
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

        <div className="flex flex-col items-center gap-4">
       
          {avatar ? (
          <Image
            src={avatar}
            alt="Avatar"
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-3xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

         <h1 className="text-xl font-bold">{displayName}</h1>

       
          <div className="w-full">
            <label className="text-sm mb-1 block">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg bg-[#374151] text-white placeholder-gray-400 border border-gray-600 focus:outline-none ${isEditing ? 'focus:ring focus:ring-blue-500' : 'cursor-not-allowed'
                }`}
              placeholder="Enter display name"
            />
          </div>

         
          <div className="w-full">
            <label className="text-sm mb-1 block">Email address</label>
            <input
              type="text"
              value={email}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-[#374151] text-white cursor-not-allowed border border-gray-600"
            />
          </div>

    
          <div className="w-full flex justify-end mt-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="text-sm text-gray-300 hover:text-white underline"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile