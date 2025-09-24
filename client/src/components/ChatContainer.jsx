import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime , formatMessageText, formatLastSeen} from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'


const ChatContainer = ({ showRightSidebar, setShowRightSidebar }) => {

  const {
    messages, 
    selectedUser,setSelectedUser,
    sendMessage, getMessages, 
    typingUsers, emitTyping,
    lastSeen,
    deleteMessage
  } = useContext(ChatContext);

  const { authUser, onlineUsers }= useContext(AuthContext)

  const [input, setInput] = useState('');
  const [activeMessageId, setActiveMessageId] = useState(null);
  const longPressTimer = useRef(null);
  const scrollEnd=useRef()



  const handleSendMessage = async(e)=>{
       e.preventDefault();
       if(input.trim() === "") return null;
       await sendMessage({text: input.trim()});
       setInput("")
  }


 //Hande sending an image
 const handleSendImage = async(e) =>{
  const file = e.target.files[0];
  if(!file || !file.type.startsWith("image/")){
    toast.error("Select an image file")
    return;
  }
  const reader = new FileReader();
  reader.onloadend = async ()=>{
    await sendMessage({image : reader.result})
    e.target.value = ""
  }
  reader.readAsDataURL(file)
 }

 const toggleDeleteOption = (messageId, e) => {
        e.stopPropagation(); // Prevent container click
        setActiveMessageId(activeMessageId === messageId ? null : messageId);
    };

    // Add this function to handle message clicks
const handleMessageClick = (msg, e) => {
  if (msg.senderId === authUser._id) {
    toggleDeleteOption(msg._id, e);
  }
};

    // Handle long press for small screens
    const handleTouchStart = (messageId,e) => {
        e.stopPropagation();
        longPressTimer.current = setTimeout(() => {
            toggleDeleteOption(messageId, e);
        }, 500); // 500ms for long press
    };

    const handleTouchEnd = (e) => {
        e.stopPropagation();
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };


    const handleContainerClick = (e) => {
    // Don't hide if clicking delete button
    if (e.target.tagName.toLowerCase() === 'button') {
        return;
    }
    // Hide active delete option
    setActiveMessageId(null);
};


useEffect(() => {
  if (selectedUser) {
    getMessages(selectedUser._id)
  }
}, [selectedUser])

  useEffect(()=>{
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior : "smooth"})
    }
  },[messages])


  return selectedUser ? (
    <div className ='h-full overflow-hidden relative bg-slate-800/70 backdrop-blur-xl flex flex-col'
    onClick={handleContainerClick}
        onTouchStart={() => {
            if (activeMessageId) {
                setActiveMessageId(null);
            }
        }}
    >
      {/*-------Header------- */}
      <div className='flex items-center gap-4 py-4 px-6 border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-xl'>
            <button 
              onClick={()=>setSelectedUser(null)}
              className='flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/80 hover:bg-slate-600/80 transition-all duration-300 backdrop-blur-sm border border-slate-600/50 hover:border-emerald-500/50 group'
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-emerald-200 transition-colors">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div 
              className='flex items-center gap-4 flex-1 cursor-pointer hover:bg-slate-700/20 rounded-xl p-2 -m-2 transition-colors'
              onClick={() => setShowRightSidebar(!showRightSidebar)}
            >
              <div className='relative'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-12 h-12 rounded-xl object-cover border-2 border-white/20' />
                {onlineUsers.includes(selectedUser._id) && (
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse'></div>
                )}
              </div>
              
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                  {selectedUser.fullName}
                </h3>
                <p className="text-sm text-gray-400">
                  {onlineUsers.includes(selectedUser._id) ? (
                    <span className='text-green-400'>Online</span>
                  ) : (
                    `Last seen: ${formatLastSeen(lastSeen)}`
                  )}
                </p>
              </div>
              
              <div className='text-gray-400 hover:text-emerald-300 transition-colors'>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
      </div>

      {/* Chat Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4' style={{scrollbarWidth: 'none'}}>
        {messages.map((msg,index)=>(
            <div 
            key={index} 
            className={`flex items-end gap-3 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'} relative group`}
             onClick={(e) => window.innerWidth >= 768 && handleMessageClick(msg, e)}
             onTouchStart={(e) => window.innerWidth < 768 && msg.senderId === authUser._id && handleTouchStart(msg._id, e)}
             onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'manipulation' }}
            >
            {msg.senderId !== authUser._id && (
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} className='w-8 h-8 rounded-full object-cover border border-white/20' alt="" />
            )}

            {msg.isDeleted ? (
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.senderId === authUser._id ? 'bg-slate-900/60 rounded-br-md' : 'bg-slate-800/60 rounded-bl-md'} border border-slate-700/40`}>
                  <p className="text-gray-400 italic text-sm">This message was deleted</p>
                  <span className='text-xs text-gray-500 mt-1 block'>{formatMessageTime(msg.createdAt)}</span>
                </div>
              ) :
                msg.image ? (
                  <div className="relative max-w-xs">
                    <img
                      className="rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      src={msg.image}
                      alt=""
                      onClick={() => window.open(msg.image)}
                    />
                    <div className='absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg'>
                      <span className='text-xs text-white'>{formatMessageTime(msg.createdAt)}</span>
                    </div>
                    {msg.senderId === authUser._id && (
                      <div className={`absolute top-2 -left-16 bg-red-600/90 backdrop-blur-sm text-white text-xs rounded-lg p-2 transition-all duration-200 ${activeMessageId === msg._id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <button onClick={(e) =>{e.stopPropagation();deleteMessage(msg._id)}} className='hover:text-red-200'>Delete</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative max-w-xs">
                    <div className={`px-4 py-3 rounded-2xl shadow-lg ${msg.senderId === authUser._id 
                      ? 'bg-emerald-600 text-white rounded-br-md' 
                      : 'bg-slate-800/90 backdrop-blur-sm text-white border border-slate-700/40 rounded-bl-md'
                    }`}>
                      {/\b((https?:\/\/)?(www\.)?[\w-]+\.[\w.-]+(\S*)?)/gi.test(msg.text) ? (
                        <span
                          className="break-words text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }}
                        ></span>
                      ) : (
                        <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                      )}
                      <span className={`text-xs mt-2 block ${msg.senderId === authUser._id ? 'text-emerald-100' : 'text-gray-400'}`}>
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                    {msg.senderId === authUser._id && (
                      <div className={`absolute top-0 -left-16 bg-red-600/90 backdrop-blur-sm text-white text-xs rounded-lg p-2 transition-all duration-200 ${activeMessageId === msg._id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <button onClick={(e) => {e.stopPropagation();deleteMessage(msg._id)}} className='hover:text-red-200'>Delete</button>
                      </div>
                    )}
                  </div>
                )}

             {msg.senderId === authUser._id && (
               <img src={authUser?.profilePic || assets.avatar_icon} className='w-8 h-8 rounded-full object-cover border border-white/20' alt="" />
             )}
            </div> 
          ))}

        {/* Typing Indicator */}
        {typingUsers[selectedUser?._id] && (
          <div className="flex items-center gap-3">
            <img src={selectedUser?.profilePic || assets.avatar_icon} className='w-8 h-8 rounded-full object-cover border border-white/20' alt="" />
            <div className="bg-slate-800/90 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-md border border-slate-700/40">
              <div className='flex space-x-1'>
                <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollEnd}></div>
      </div>

       {/* Message Input */}
       <div className='border-t border-slate-700/50 p-4 bg-slate-900/60 backdrop-blur-xl'>
        <div className='flex items-end gap-3'>
          <div className='flex-1 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/40 focus-within:border-emerald-500/60 transition-all duration-300'>
            <div className='flex items-center px-4 py-3'>
              <input 
                onChange={(e)=> {setInput(e.target.value); emitTyping(selectedUser._id);}} 
                value={input} 
                onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e) : null} 
                className='flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm resize-none' 
                placeholder='Type a message...'
                rows={1}
              />

              <input onChange={handleSendImage} type="file" id="image" accept='image/png, image/jpeg' hidden/>
              <label htmlFor="image" className='ml-3 p-2 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 transition-colors cursor-pointer'>
                <img src={assets.gallery_icon} className='w-5 h-5 opacity-80' />
              </label>
            </div>
          </div>

          <button 
            onClick={handleSendMessage}
            className='w-12 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50'
            disabled={!input.trim()}
          >
            <img src={assets.send_button} alt="" className='w-6 h-6'/>
          </button>
        </div>
       </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-6 text-gray-400 bg-slate-800/50 backdrop-blur-xl max-md:hidden h-full'>
      <div className='w-24 h-24 bg-emerald-600/20 rounded-full flex items-center justify-center border border-slate-700/40'>
        <img className='w-12 h-12 opacity-60' src={assets.logo_icon} alt="" />
      </div>
      <div className='text-center'>
        <p className='text-xl font-semibold text-white mb-2'>Welcome to HeyChat</p>
        <p className='text-gray-400'>Select a conversation to start messaging</p>
      </div>
    </div>
  )
}

export default ChatContainer
