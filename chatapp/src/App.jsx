import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import {Chat} from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import ChannelProfile from "./pages/chat/components/chat-container/components/channel-profile";
import Loader from "./components/Loader";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try{
        const response = await apiClient.get(GET_USER_INFO,{
          withCredentials : true,
        });
        if(response.status===200 && response.data.id){
          setUserInfo(response.data);
        }else{
          setUserInfo(undefined);
        }
        console.log({response})
      }catch(error){
        setUserInfo(undefined)
      }finally{
        setLoading(false)
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div><Loader /></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/channelProfile"
          element={
            <PrivateRoute>
              <ChannelProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;