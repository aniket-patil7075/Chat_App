import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ConatctContainer from './components/contact-container';
import EmptyContainer from './components/empty-container';
import ChatContainer from './components/chat-container';
import EmptyChatContainer from './components/empty-container';

export const Chat = () => {
  const {userInfo}=useAppStore();
  const navigate =useNavigate();
  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  },{userInfo,navigate}
)
  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ConatctContainer/>
      {/* <EmptyChatContainer/> */}
      <ChatContainer/>
    </div>
  )
}
