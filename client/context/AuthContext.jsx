import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import {io} from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider =({children})=>{

   const [token,setToken] = useState(localStorage.getItem("token"));
   const [authUser,setAuthUser] = useState(null);
   const [onlineUsers,setOnlineUsers] = useState([]);
   const [socket,setSocket] = useState(null);

//Check if user is authentuicated if so set the user data and connect the socket
    

    const checkAuth = async() =>{
        try {
           const { data } = await axios.get("/api/auth/check") ;
           setAuthUser(data);
           connectSocket(data)      
        }catch (error) {
            console.log("Auth check failed:", error);
        }
    }

    //Login function to handle user authentication and socket connection

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            setAuthUser(data);
            connectSocket(data)
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            setToken(data.token);
            localStorage.setItem("token", data.token)
            toast.success("Login successful")
        }catch(error){
            toast.error(error.response?.data?.message || "Login failed")
        }
    }
    
//Logout function to handle user logout and socket disconnection

   const logout = async()=>{
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["Authorization"] = null;
    toast.success ("Logged out successfully")
    if(socket) socket.disconnect();
   }  


   //Update profile sunction to handle user profile updates
   const updateProfile = async(body)=>{
    try {
        const {data} = await axios.put("/api/auth/update-profile",body)
        setAuthUser(data);  
        toast.success("Profile updated successfully")
    } catch (error) {
        toast.error(error.response?.data?.message || "Update failed")
    }
   }



    //Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData)=>{
        const newSocket = io(backendUrl,{
            query:{
                userId:userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
           axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        checkAuth();
    },[token])







    const value ={
     axios,
     authUser,
     onlineUsers,
     socket,
     login,logout,
     updateProfile
    }
    return(
        <AuthContext.Provider value ={value}>
            {children}
        </AuthContext.Provider>
    )
}