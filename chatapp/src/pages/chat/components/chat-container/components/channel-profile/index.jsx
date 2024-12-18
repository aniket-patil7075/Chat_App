import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_CHANNEL_IMAGE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { useLocation } from "react-router-dom";

const ChannelProfile = () => {
  const location = useLocation();
  const { selectedChatData } = location.state || {};
  console.log("selectedchatdata : ",selectedChatData);

  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);
  const channels = useAppStore((state) => state.channels);
  const [message, setMessage] = useState('');

  const handleNavigate = () => {
      navigate("/chat");
  };

  // const handleFileInputClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleImageChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     console.log("No file selected.");
  //     return;
  //   }
  
  //   if (!selectedChatData?._id) {
  //     console.log("Chat ID is missing.");
  //     return;
  //   }
  //   if (file && selectedChatData?._id) { 
  //     const formData = new FormData();
  //     formData.append("channel-image", file);
  //     formData.append("chatId", selectedChatData._id); 
  //     try {
  //       const response = await apiClient.post(
  //         ADD_CHANNEL_IMAGE_ROUTE,
  //         formData,
  //         {
  //           withCredentials: true,
  //         }
  //       );
  
  //       if (response.status === 200 && response.data.image) {
  //         setImage(response.data.image);
  //         console.log("Image uploaded successfully");
  //       }
  //     } catch (error) {
  //       console.log("Error uploading image:", error);
  //     }
  //   } else {
  //     console.log("No file selected or missing chat ID.");
  //   }
  // };
  

  // const handleDeleteImage = async () => {
  //   try {
  //     const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
  //       withCredentials: true,
  //     });
  //     if (response.status === 200) {
  //       setImage(null);
  //       console.log("Image removed successfully.");
  //     }
  //   } catch (error) {
  //     console.log("Error deleting image:", error);
  //   }
  // };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const API_BASE_URL = "http://localhost:5000";

  const handleUpload = async () => {
    if (!image) {
      setMessage('Please select an image to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', image);
  
    try {
      const uploadUrl = `${API_BASE_URL}/api/channels/${selectedChatData._id}/upload`;
      console.log('Uploading to:', uploadUrl); // Verify the URL
      const response = await axios.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      setMessage('Failed to upload image');
    }
  };
  

  

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        {/* <div className="grid grid-cols-2">
          <div
            className="h-32 w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black "
                />
              ) : (
                <div
                  className={`uppercase w-32 h-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {selectedChatData.name
                    ? selectedChatData.name.split("").shift()
                    : "#"}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden "
              onChange={handleImageChange}
              name="profile_image "
              accept=".png ,.jpg ,.jpeg .,svg ,.webp "
            />
          </div>
          <div className="flex min-w-32 md:min-w-64  flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={selectedChatData.name}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>

          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={svaeChanges}
          >
            Save Changes
          </Button>
        </div> */}
        <div className="text-white">
      <h2>Channel Profile</h2>
      {selectedChatData ? (
        <div>
          <p>Channel Name: {selectedChatData.name}</p>
          <p>Channel ID: {selectedChatData._id}</p>

          <div>
            <label htmlFor="channelImage">Upload Channel Image:</label>
            {/* <input type="file" id="channelImage" onChange={handleFileChange} /> */}
            <button onClick={handleUpload}>Upload</button>
          </div>

          {message && <p>{message}</p>}
        </div>
      ) : (
        <p>No channel data available</p>
      )}
    </div>
      </div>
    </div>
  );
};
export default ChannelProfile;
