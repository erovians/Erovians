// import Sidebar from "./Sidebar";
// import ChatWindow from "./ChatWindow";
// import UserProfile from "./UserProfile";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { chatApi } from "@/utils/axios.utils";

// export default function ChatApp() {
//   const { userId } = useParams();
//   const [chat, setChat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedChat, setSelectedChat] = useState(null);

//   useEffect(() => {
//     const createChat = async () => {
//       if (!userId) return;
//       setLoading(true);

//       try {
//         const res = await chatApi.post(`/chat/${userId}`);

//         setTimeout(() => {
//           setChat(res.data);
//           setLoading(false);
//         }, 3000);
//       } catch (err) {
//         console.error("Error creating chat:", err);
//         setLoading(false);
//       }
//     };

//     createChat();
//   }, [userId]);

//   return (
//     <div className="relative w-full max-w-full mx-auto  sm:h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
//       {/* Left Sidebar */}
//       <div className="bg-navyblue text-white w-full md:w-1/3 lg:w-1/4">
//         {/* <Sidebar /> */}
//         <Sidebar onSelectChat={setSelectedChat} />
//       </div>

//       {/* Chat Window */}
//       <div className="bg-gray-50 border-t md:border-t-0 h-[400px] sm:h-full md:border-x border-gray-200 w-full md:w-2/3 lg:w-2/4">
//         {chat ? (
//           // <ChatWindow chat={chat} />
//           <ChatWindow selectedChat={selectedChat} />
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-500">
//             Select a user to start chatting 💬
//           </div>
//         )}
//       </div>

//       {/* Right Sidebar */}
//       <div className="hidden lg:block w-1/4 bg-navyblue text-white">
//         <UserProfile user={selectedChat?.user} />
//       </div>

import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import UserProfile from "./UserProfile";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { chatApi } from "../../utils/axios.utils";
import { socket, connectSocket } from "../../utils/socket";

export default function ChatApp() {
  const { userId } = useParams();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    connectSocket();

    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("getUsers");
  }, []);

  useEffect(() => {
    const createChat = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const res = await chatApi.post(`/chat/${userId}`);
        setTimeout(() => {
          setChat(res.data);
          setLoading(false);
        }, 3000);
      } catch (err) {
        console.error("Error creating chat:", err);
        setLoading(false);
      }
    };

    createChat();
  }, [userId]);

  return (
    <div className="relative w-full max-w-full  mx-auto sm:h-[85vh]  flex flex-col md:flex-row overflow-hidden">
      {/* Left Sidebar */}
      <div className=" text-white w-full md:w-1/3 lg:w-1/4">
        <Sidebar onSelectChat={setSelectedChat} onlineUsers={onlineUsers} />
      </div>

      {/* Chat Window */}
      <div className="  h-[400px] sm:h-full  w-full md:w-2/3 lg:w-2/4">
        {chat ? (
          <ChatWindow selectedChat={selectedChat} onlineUsers={onlineUsers} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting 💬
          </div>
        )}
      </div>                

      {/* Right Sidebar */}
      <div className="hidden lg:block w-1/4  text-white">
        <UserProfile user={selectedChat?.user} onlineUsers={onlineUsers} />
      </div>

      {/* 🔹 Loading Popup Overlay */}
      {/* {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 text-center max-w-sm w-full transform transition-all duration-300 scale-105">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Please wait a few seconds while we securely establish your chat
              connection...
            </p>
            <div className="mt-5 text-xs text-gray-400 italic">
              Preparing your messages and syncing chat data 🔄
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
