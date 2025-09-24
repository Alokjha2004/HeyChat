import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = ({ setShowRightSidebar }) => {
    const {selectedUser, messages} = useContext(ChatContext)

    const {logout, onlineUsers} = useContext(AuthContext)
    const [msgImages,setMsgImages] = useState([])

// Get all the images from the messages and set them to state
useEffect(()=>{
  setMsgImages(
    messages.filter(msg => msg.image && !msg.isDeleted).map(msg => msg.image)
  )
},[messages])

  return selectedUser &&  (
    <div className={`bg-slate-800/90 backdrop-blur-xl text-white w-full relative overflow-y-auto border-l border-slate-700/50 rounded-r-3xl ${selectedUser ? "max-md:hidden" : ""} flex flex-col`}>

        <div className='p-6 pb-4 flex flex-col items-center gap-4 text-center border-b border-slate-700/50'>
          <div className='relative'>
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl'/>
            {onlineUsers.includes(selectedUser._id) && (
              <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-slate-900 animate-pulse'></div>
            )}
          </div>
          
          <div className='space-y-3'>
            <h1 className='text-xl font-bold text-white'>
              {selectedUser.fullName}
            </h1>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${onlineUsers.includes(selectedUser._id) 
              ? 'bg-green-600/20 border border-green-500/40 text-green-300' 
              : 'bg-slate-700/40 border border-slate-600/40 text-gray-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id) ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}</span>
            </div>
            {selectedUser.bio && (
              <p className='text-gray-300 text-sm max-w-48 leading-relaxed'>{selectedUser.bio}</p>
            )}
          </div>
        </div>

        <div className='flex-1 overflow-y-auto' style={{scrollbarWidth: 'none'}}>
          {msgImages.length > 0 && (
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wide'>Shared Media</h3>
                <span className='text-xs bg-emerald-600/30 text-emerald-200 px-2.5 py-1 rounded-full font-medium'>{msgImages.length}</span>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                {msgImages.slice(0, 6).map((url,index)=>(
                    <div key={index} onClick={()=> window.open(url)} className='group cursor-pointer rounded-2xl overflow-hidden border border-slate-700/40 hover:border-emerald-500/50 transition-all duration-300 aspect-square'>
                       <img src={url} alt="" className='w-full h-20 object-cover group-hover:scale-110 transition-transform duration-300' />      
                    </div>
                ))}
                {msgImages.length > 6 && (
                  <div className='group cursor-pointer rounded-2xl overflow-hidden border border-slate-700/40 bg-slate-900/50 flex items-center justify-center aspect-square'>
                    <span className='text-gray-300 text-sm font-medium'>{`+${msgImages.length - 6} more`}</span>
                  </div>
                )}
             </div>
          </div>
          )}
        </div>

        <div className='p-6 pt-4'>
          <button 
            onClick={()=>logout()} 
            className='w-full bg-red-600 hover:bg-red-700 text-white border-none text-sm font-medium py-3.5 px-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2'
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
    </div>
  )
}

export default RightSidebar



