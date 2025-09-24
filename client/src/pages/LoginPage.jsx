import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import PasswordInput from '../components/PasswordInput'

const LoginPage = () => {
   const [currState,setCurrState] = useState("Login")
   const [fullName,setFullName] = useState("")
   const [email,setEmail] = useState("")
   const [password,setPassword] = useState("")
   const [bio,setBio] = useState("")
   const [isDataSubmitted,setIsDataSubmitted] = useState(false)

   const {login} = useContext(AuthContext)

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currState === "Sign up" ? 'signup' :'login' ,{fullName,email,password,bio})
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.25) 0%, transparent 50%),
                           radial-gradient(circle at 25% 75%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`,
          backgroundSize: '400px 400px, 300px 300px, 350px 350px, 250px 250px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-teal-500/4 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-cyan-500/3 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className='w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative z-10'>
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983V5.983Zm5.706 3.809a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Zm2.585.002a1 1 0 1 1 .003 1.414 1 1 0 0 1-.003-1.414Zm5.415-.002a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Z" clipRule="evenodd"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">HeyChat</h1>
          <p className="text-gray-400 text-sm">Connect with friends and family</p>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
          <div className="text-center mb-4">
            <h2 className='text-xl font-semibold text-white mb-1'>
              {currState}
              {isDataSubmitted && (
                <button 
                  type="button"
                  onClick={()=>setIsDataSubmitted(false)}
                  className='ml-3 p-1 rounded-full hover:bg-slate-700/50 transition-colors'
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </h2>
            <p className="text-gray-400 text-xs">
              {currState === "Login" ? "Welcome back!" : isDataSubmitted ? "Tell us about yourself" : "Create your account"}
            </p>
          </div>

          {currState === "Sign up" && !isDataSubmitted && (
            <div className="space-y-3">
              <input 
                onChange={(e)=>setFullName(e.target.value)}
                type="text" 
                className='w-full p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-gray-400 transition-all duration-200 text-sm' 
                placeholder='Full Name' 
                required
              />
            </div>
          )}

          {!isDataSubmitted && (
            <div className="space-y-3">
              <input 
                onChange={(e)=>setEmail(e.target.value)} 
                value={email}
                type="email" 
                placeholder="Email Address" 
                required 
                className='w-full p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-gray-400 transition-all duration-200 text-sm'
              />

              <PasswordInput 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Password"
                required
                className='w-full p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-gray-400 transition-all duration-200 text-sm'
              />
            </div>
          )}

          {currState === "Sign up" && isDataSubmitted && (
            <div>
              <textarea 
                onChange={(e)=> setBio(e.target.value)} 
                value={bio}
                rows={3} 
                className='w-full p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-gray-400 resize-none transition-all duration-200 text-sm' 
                placeholder='Write a short bio about yourself...' 
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className='w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-sm'
          >
            {currState === "Sign up" ? (isDataSubmitted ? "Create Account" : "Continue") : "Login Now"}
          </button>

          <div className='text-center'>
            {currState === "Sign up" ? (
              <p className='text-xs text-gray-400'>
                Already have an account? 
                <button
                  type="button"
                  onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}}
                  className='font-medium text-emerald-400 hover:text-emerald-300 ml-1 transition-colors'
                >
                  Login here
                </button>
              </p>
            ) : (
              <p className='text-xs text-gray-400'>
                Don't have an account? 
                <button
                  type="button"
                  onClick={()=>{setCurrState("Sign up")}}
                  className='font-medium text-emerald-400 hover:text-emerald-300 ml-1 transition-colors'
                >
                  Sign up here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
