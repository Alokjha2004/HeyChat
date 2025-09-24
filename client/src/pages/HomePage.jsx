import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
    const {selectedUser} = useContext(ChatContext)
    const [showRightSidebar, setShowRightSidebar] = useState(false)

  return (
    <div className='min-h-screen floating-particles p-2 sm:p-4 lg:p-6 xl:p-8 relative overflow-hidden' >
       {/* Premium background decorations */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute top-3/4 -right-32 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
         <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
       </div>

       <div className={`w-full max-w-[98vw] lg:max-w-6xl xl:max-w-7xl mx-auto h-[96vh] sm:h-[94vh] lg:h-[92vh] glass-morphism rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl grid transition-all duration-300 relative z-10 ${showRightSidebar && selectedUser ? 'grid-cols-1 md:grid-cols-[300px_1fr_280px] lg:grid-cols-[320px_1fr_300px] xl:grid-cols-[350px_1fr_320px]' : 'grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr]'}`}>
          <Sidebar />
          <ChatContainer showRightSidebar={showRightSidebar} setShowRightSidebar={setShowRightSidebar} />
          {showRightSidebar && selectedUser && <RightSidebar setShowRightSidebar={setShowRightSidebar} />}
       </div>
    </div>
  )
}

export default HomePage

