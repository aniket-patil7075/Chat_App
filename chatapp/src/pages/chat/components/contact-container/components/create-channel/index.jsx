import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  ADD_CHANNEL_IMAGE_ROUTE,
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
  REMOVE_PROFILE_IMAGE_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

function CreateChannel() {
  const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);

  const [allConatcts, setAllConatcts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      setAllConatcts(response.data.contacts);
    };
    getData();
  }, []);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImagechange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("channel-image", file);

      try {
        const response = await apiClient.post(ADD_CHANNEL_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.image) {
          setImage(response.data.image);
          console.log("Image uploaded successfully");
        }
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setImage(null);
        console.log("Image removed successfully.");
      }
    } catch (error) {
      console.log("Error deleting image:", error);
    }
  };

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
            profileImage: image,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          addChannel({
            ...response.data.channel,
            profileImage: image,
          });

          console.log("Channel created successfully");
        }
      }
    } catch (error) {
      console.log("Error creating channel:", error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[300px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel.
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex items-center my-4">
            <div
              className="h-25 w-25 md:w-25 md:h-25 relative flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="h-22 w-22 md:w-28 md:h-28 rounded-full overflow-hidden">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-22 w-22 md:w-28 md:h-28 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedColor
                    )}`}
                  >
                    #
                  </div>
                )}
              </Avatar>
              
            </div>
            <div className="ml-3">
              <Input
                placeholder="Channel Name"
                className="rounded-lg p-6 bg-[#2c2e3b] border-none mb-2"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
              />
              <MultipleSelector
                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                defaultOptions={allConatcts}
                placeholder="Search Contacts"
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600">
                    No results found.
                  </p>
                }
              />
            </div>
          </div>

          <div>
            <Button
              className="w-full bg-sky-600 hover:bg-sky-700 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateChannel;
