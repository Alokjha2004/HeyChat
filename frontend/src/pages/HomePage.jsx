import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

function HomePage() {
  const { authUser } = useAuthStore();
  return (
    <div>HomePage</div>
  )
}

export default HomePage