import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  DELETE_EVERYONE_ROUTE,
  DELETE_ONE_MESSAGE_ROUTE,
  DELETE_USER_MESSAGE,
  GET_ALL_CONTACTS_ROUTES,
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function MessageContainer() {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages = [],
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [openNewContactModal, setOpenNewConatctModal] = useState(false);

  // console.log("User Id : ", userInfo.id)
  const userId = userInfo.id
  console.log("User ID : ", userId)

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };



    const getChannelMEssages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMEssages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    if (
      !Array.isArray(selectedChatMessages) ||
      selectedChatMessages.length === 0
    ) {
      return (
        <div className="text-center text-gray-500 mt-4">No messages yet.</div>
      );
    }

    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message, userInfo.id)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (ProgressEvent) => {
        const { loaded, total } = ProgressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  // const messageRef = useRef(null);


  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (messageRef.current && !messageRef.current.contains(event.target)) {
  //       setMessageToDelete(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const renderDMMessages = (message, userId) => (

    <div
      // ref={messageRef}
      className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${message.sender !== selectedChatData._id
            ? "bg-[#8417ff]/5 text-[#6ea8f8]/90 border-[#6ea8f8]/50"
            : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleMessageClick(message._id)}

        >
          {message.content}
        </div>
      )}
      {messageToDelete === message._id && (
        <div className="message-options">
          <button
            // onClick={() => handleDeleteMessage(message._id)}
            onClick={() => deleteMessageForUser(message._id, userId)}
            // onClick={() => setOpenNewConatctModal(true)}
            className="delete-button"
          >
            <FaTrash />
          </button>
        </div>
      )}
      {message.messageType == "file" && (
        <div
          className={`${message.sender !== selectedChatData._id
            ? "bg-[#8417ff]/5 text-[#6ea8f8]/90 border-[#6ea8f8]/50"
            : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer "
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3 ">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>

              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600 ">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );



  const renderChannelMessage = (message) => {
    return (
      <div
        className={`mt-5 
         ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}
      >
        {message.messageType === "text" && (
          <div
            className={`${message.sender._id === userInfo.id
              ? "bg-[#8417ff]/5 text-[#6ea8f8]/90 border-[#6ea8f8]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
              style={{ cursor: 'pointer' }}
          onClick={() => handleMessageClick(message._id)}
          >
            {message.content}
          </div>
        )}
{messageToDelete === message._id && (
        <div className="message-options">
          <button
            // onClick={() => handleDeleteMessage(message._id)}
            onClick={() => deleteMessageForUser(message._id, userId)}
            // onClick={() => setOpenNewConatctModal(true)}
            className="delete-button"
          >
            <FaTrash />
          </button>
        </div>
      )}
        {message.messageType == "file" && (
          <div
            className={`${message.sender._id === userInfo._id
              ? "bg-[#8417ff]/5 text-[#6ea8f8]/90 border-[#6ea8f8]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer "
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3 ">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>

                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black "
                />
              )}
              <AvatarFallback
                className={`uppercase w-8 h-8  text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>

            <span className="text-sm text-white/60 ">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-white/60 ">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  const deleteMessageForUser = async (messageId, userId) => {
    try {
      const url = `${DELETE_USER_MESSAGE.replace(':id', messageId)}`; 

      
      // console.log("API URL:", url);
      // console.log("Request payload:", { messageId, userId });

      const response = await apiClient.patch(url, { messageId, userId });
      console.log(response.data.message);
      // alert("Message deleted successfully...!")
      toast.success("Message deleted successfully...!");

     
      const updatedMessages = selectedChatMessages.filter(
        (message) => message._id !== messageId
      );
      setSelectedChatMessages(updatedMessages);



    } catch (error) {
      console.error("Error deleting the message:", error.response.data.error || error.message);
    }
  };

  const handleMessageClick = (messageId) => {
    // console.log("click on message");

    setMessageToDelete(messageId);
  };

  // const handleDeleteMessage = async (messageId) => {
  //   try {
  //     const previousMessages = [...selectedChatMessages];
  //     const updatedMessages = selectedChatMessages.filter(
  //       (message) => message._id !== messageId
  //     );
  //     setSelectedChatMessages(updatedMessages);

  //     const response = await apiClient.post(
  //       `${DELETE_ONE_MESSAGE_ROUTE}`,
  //       { messageId },
  //       { withCredentials: true }
  //     );

  //     if (!response.data.success) {
  //       alert(response.data.message || "Failed to delete the message.");
  //       setSelectedChatMessages(previousMessages);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting message:", error);
  //   }
  // };

  // const handleDeleteMessage = async (messageId) => {
  //   try {
  //     const previousMessages = [...selectedChatMessages];

  //     const updatedMessages = selectedChatMessages.map((message) =>
  //       message._id === messageId
  //         ? { ...message, content: "Delete for everyone", deleted: true }
  //         : message
  //     );

  //     setSelectedChatMessages(updatedMessages);

  //     const response = await apiClient.post(
  //       `${DELETE_EVERYONE_ROUTE}`,
  //       { messageId },
  //       { withCredentials: true }
  //     );

  //     if (!response.data.success) {
  //       alert(response.data.message || "Failed to delete the message.");
  //       setSelectedChatMessages(previousMessages);
  //     }
  //     updatedMessages = selectedChatMessages.map((message) =>
  //       message._id === messageId
  //         ? { ...message, content: "Delete for everyone", deleted: true }
  //         : message
  //     );

  //     setSelectedChatMessages(updatedMessages);
  //   } catch (error) {
  //     console.error("Error deleting message:", error);
  //     setSelectedChatMessages(previousMessages);
  //   }
  // };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fix z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>

            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewConatctModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[200px] h-[170px] flex flex-col">
          <DialogHeader>
            <DialogTitle> </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div style={{cursor:"pointer"}}>
            <p>Delete for Me</p>
          </div>
          <div style={{cursor:"pointer"}}>
            <p>Delete for Everyone</p>
          </div>
          <div  style={{cursor:"pointer"}}>
            <p>Cancel</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MessageContainer;


//userId is not pass to the renderdMmessages
