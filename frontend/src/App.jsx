import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SubdomainHome from './pages/SubdomainHome'
import CreatorOnboarding from './pages/CreatorOnboarding'
import ProfilePage from './pages/ProfilePage'
import WatchPage from "./pages/WatchPage";              // NEW


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<SubdomainHome />}/>
        <Route path='/create' element={<CreatorOnboarding />}/>
        <Route path='/profile/:videoId' element={<ProfilePage />}/>
        <Route path="/watch/:videoId" element={<WatchPage />} />
      </Routes>
    </div>
  )
}

export default App
