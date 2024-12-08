import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  DELETE_CHAT_ROUTE,
  GET_USER_DETAILS_ROUTE,
  HOST,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ChatHeader() {
  const {
    closeChat,
    selectedChatData,
    setSelectedChatMessages,
    selectedChatType,
    selectedChatMessages,
  } = useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [adminUsername, setAdminUsername] = useState("");
  // console.log("Data: ",selectedChatData);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!selectedChatData || !selectedChatData._id) {
          alert("No user selected for fetching details.");
          return;
        }

        if ( !selectedChatData.admin) {
          console.log("Selected data is not a channel. Skipping fetch.");
          return;
        }

        const newUsernames = { ...usernames }; 

        if (selectedChatData.admin && !adminUsername) {
          const adminResponse = await apiClient.get(
            GET_USER_DETAILS_ROUTE.replace(":userId", selectedChatData.admin),
            { withCredentials: true }
          );
          setAdminUsername(adminResponse.data.userDetails.username);
        }

        
        for (const memberId of selectedChatData.members) {
          if (!newUsernames[memberId]) { 
            const response = await apiClient.get(
              GET_USER_DETAILS_ROUTE.replace(":userId", memberId),
              { withCredentials: true }
            );
            // console.log("Response for Profile pic : ", response)
            newUsernames[memberId] = response.data.userDetails.username;
          }
        }

        setUsernames(newUsernames); 
      } catch (error) {
        console.error({ error });
        alert("An error occurred while fetching user details.");
      }
    };
    fetchUserDetails();
  }, [selectedChatData]);

  const handleChannelClick = () => {
    if (selectedChatType === "channel") {
      setNewChannelModal(true);
    }
  };

  const handleDeleteChat = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirmDelete) return;
      const previousMessages = [...selectedChatMessages];
      setSelectedChatMessages([]);

      const response = await apiClient.post(
        DELETE_CHAT_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      );

      if (response.data.success) {
        // alert("Chat deleted successfully!");
        setSelectedChatMessages([]);
      } else {
        alert(response.data.message || "Failed to delete chat.");
      }
    } catch (error) {
      console.log({ error });
      alert("An error occurred while deleting the chat.");
      setSelectedChatMessages(previousMessages);
    }
  };

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between">
      <div className="flex gap-5 items-center  w-full justify-between">
        <div className="flex gap-5 ml-7 items-center justify-center ">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black "
                  />
                ) : (
                  <div
                    className={`uppercase w-12 h-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div onClick={handleChannelClick} className="cursor-pointer">
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.lastName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
          <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[300px] flex flex-col">
              <DialogHeader>
                <DialogTitle className="">{selectedChatData.name}</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div>
                
                <h4>Admin: <span className="text-gray-400">{adminUsername || "Loading..."}</span></h4>
                <h4 className="  mb-2 text-white">Members :</h4>
                <ul className="list-disc text-sm text-gray-400 pl-5">
                  {(selectedChatData.members || []).map((member, index) => (
                    <li key={index} className="mb-1">
                      {usernames[member] || "Loading..."}
                    </li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-center gap-5 mr-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={handleDeleteChat}
          >
            <FaTrash className="text-xl cursor-pointer" />
          </button>

          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
