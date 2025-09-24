import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'



const Sidebar = () => {
   const {logout, onlineUsers} = useContext(AuthContext);

   const {getUsers, users, selectedUser, setSelectedUser,unseenMessages,typingUsers} = useContext(ChatContext)

   const [input, setInput] = useState(false);
   const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate()

  const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;


  useEffect(()=>{
     getUsers();  
  },[onlineUsers])


  return (
    <div className={`bg-slate-800/90 backdrop-blur-xl h-full p-5 rounded-l-2xl overflow-y-scroll text-white border-r border-slate-700/50 ${selectedUser ? 'max-md:hidden' : '' }`}>

      <div className='pb-6'>
        <div className='flex justify-between items-center mb-6'>
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                 <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983V5.983Zm5.706 3.809a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Zm2.585.002a1 1 0 1 1 .003 1.414 1 1 0 0 1-.003-1.414Zm5.415-.002a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Z" clip-rule="evenodd"/>
</svg>

               </div>
               <h1 className="text-lg font-bold text-white">HeyChat</h1>
             </div>
             
             <div className='relative py-2 group'>
                  <div className='w-10 h-10 rounded-xl bg-slate-700/80 hover:bg-slate-600/80 transition-all duration-300 flex items-center justify-center cursor-pointer border border-slate-600/50 hover:border-emerald-500/50' onClick={() => setMenuOpen(!menuOpen)}>
                    <img src={assets.menu_icon} alt="Menu" className='max-h-4 opacity-80' />
                  </div>

                  <div className={`absolute top-full right-0 z-20 w-40 mt-2 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 text-gray-100 shadow-xl transition-all duration-300 ${menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <div onClick={()=>navigate('/profile')} className='flex items-center gap-3 cursor-pointer text-sm py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors'>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-400">
                        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit Profile
                    </div>
                    <hr className='my-2 border-slate-700/50' />
                    <div onClick={()=>logout()} className='flex items-center gap-3 cursor-pointer text-sm py-2 px-3 rounded-lg hover:bg-red-600/20 hover:text-red-400 transition-colors'>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Logout
                    </div>
                  </div>
             </div>
        </div>

        <div className='relative'>
          <div className='bg-slate-700/60 backdrop-blur-sm rounded-2xl flex items-center gap-3 py-3 px-4 border border-slate-600/40 hover:border-emerald-500/40 focus-within:border-emerald-500/60 transition-all duration-300'>
            <div className='w-5 h-5 rounded-full bg-emerald-600/80 flex items-center justify-center'>
              <img src={assets.search_icon} alt="Search" className='w-3 opacity-90' />
            </div>
            <input onChange={(e)=>setInput(e.target.value)} type='text' className='bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 flex-1' placeholder='Search conversations...'/>
          </div>
        </div>
      </div>

    <div className='flex flex-col space-y-2'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wide'>Messages</h3>
        <span className='text-xs bg-emerald-600/30 text-emerald-200 px-2 py-1 rounded-full'>
          {Object.values(unseenMessages || {}).reduce((total, count) => total + count, 0) || 0}
        </span>
      </div>
      
      {filteredUsers.map((user,index)=>(
        <div key={user._id} onClick={()=>setSelectedUser(user)} className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group hover:bg-slate-700/40 ${selectedUser?._id === user._id ? 'bg-emerald-600/20 border border-emerald-500/40' : 'hover:border hover:border-slate-600/40'}`}>
           <div className='relative'>
             <img src={ user?.profilePic || assets.avatar_icon } alt="" className='w-12 h-12 rounded-xl object-cover border-2 border-white/20' /> 
             {onlineUsers.includes(user._id) && (
               <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse'></div>
             )}
           </div>
           
           <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <p className='font-medium text-white truncate'>{user.fullName}</p>
                  {unseenMessages?.[user._id]>0 && (
                    <div className='w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center'>
                      <span className='text-xs font-bold text-white'>{unseenMessages[user._id]}</span>
                    </div>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  {onlineUsers.includes(user._id) ? (
                    typingUsers[user._id] ? (
                      <div className='flex items-center gap-1'>
                        <div className='flex space-x-1'>
                          <div className='w-1 h-1 bg-green-400 rounded-full animate-bounce'></div>
                          <div className='w-1 h-1 bg-green-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                          <div className='w-1 h-1 bg-green-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className='text-green-400 text-xs'>typing...</span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-1'>
                        <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                        <span className='text-green-400 text-xs'>Online</span>
                      </div>
                    )
                  ) : (
                    <span className='text-gray-400 text-xs'>Offline</span>
                  )}
                </div>
            </div>
        </div> 
      ))}
    </div>
    </div>
  )
}

export default Sidebar

