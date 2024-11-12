

import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom'
import './App.css'
import {Button}from './components/ui/button'
import Auth from './pages/auth'
import { Chat } from './pages/chat'
import Profile from './pages/profile'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/auth'/>}/>

        <Route path='/auth' element={<Auth/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/profile' element={<Profile/>}/>


      </Routes>
    </BrowserRouter>
  )
}

export default App
