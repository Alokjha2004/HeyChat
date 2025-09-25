import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import assets from './assets/assets'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'



const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.25) 0%, transparent 50%),
                           radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)`,
          backgroundSize: '600px 600px, 500px 500px, 400px 400px, 350px 350px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-teal-500/6 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-green-500/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-emerald-600/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '8s'}}></div>
      </div>

      <div className="relative z-10">
        <Toaster />
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/profile' element={authUser ? <ProfilePage />: <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App








