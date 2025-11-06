// import { useEffect, useState } from "react";
// import { chatApi } from "@/utils/axios.utils";

// const { chatApi } = require("@/utils/axios.utils");

// export default function Sidebar({ onSelectChat }) {
//   const [chatUsers, setChatUsers] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const fetchChatUsers = async () => {
//       try {
//         const res = await chatApi.get("/chat/my-chats");
//         setChatUsers(res.data.users);
//       } catch (error) {
//         console.error("Error fetching chat users:", error);
//       }
//     };

//     fetchChatUsers();
//   }, []);

//   const filteredUsers = chatUsers.filter((item) =>
//     item?.user?.name?.toLowerCase().includes(search.toLowerCase())
//   );     
//   return (
//     <div className="h-full flex flex-col bg-[#0B235A] text-white">
//       <div className="p-4 text-lg font-semibold">Erovians 💬</div>

//       <input
//         type="text"
//         placeholder="Search here..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="mx-4 mb-3 px-3 py-2 rounded-lg bg-[#0E2A6B] 
//         placeholder-gray-300 text-sm focus:outline-none"
//       />

//       <div className="flex-1 overflow-y-auto">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((chat, idx) => (
//           <div
//             key={idx}
//             onClick={() => onSelectChat(chat)} 
//             className="px-4 py-3 hover:bg-[#102F7A] cursor-pointer transition"
//           >
//               <div className="flex justify-between items-center">

//               <p className="font-medium">Sandeep Nautiyal</p>
//               <p className="text-xs">12:05</p>
//               </div>
//               <p className="text-xs line-clamp-1">Hi ! How are you sandeep ?Hi ! How are you sandeep ?Hi ! How are you sandeep ?</p>

             
//               {chat.lastMessage && (
//                 <p className="text-xs text-gray-400 mt-1 truncate">
//                   {chat.lastMessage}
//                 </p>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-400 mt-5">
//             No chats found...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
// Sidebar Component

import { useEffect, useState } from "react";
import {MessageCircleMore} from "lucide-react";
import { chatApi } from "@/utils/axios.utils";
export default function Sidebar({ onSelectChat, selectedChatId }) {
  const [chatUsers, setChatUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await chatApi.get("/chat/my-chats");
        setChatUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      }
    };

    fetchChatUsers();
  }, []);

  const filteredUsers = chatUsers.filter((item) =>
    item?.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
      
    <div className="flex items-center justify-between px-4 py-3 text-black bg-white">
  {/* Title + Icon */}
  <div className="flex items-center gap-2">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      Erovians <MessageCircleMore className="w-7 h-7" />
    </h2>
  </div>

  {/* Search Bar */}
  <div className="relative w-54">
    <input
      type="text"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-3 pr-9 py-2 rounded-lg border border-gray-300 placeholder-gray-400 text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-500"
    />
    <svg
      className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
</div>


      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button 
          className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'all' ? 'text-navyblue shadow-sm border-navyblue' : 'text-gray-600'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'unread' ? 'text-navyblue shadow-sm border-navyblue' : 'text-gray-600'}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread
        </button>
        <button 
          className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'reply' ? 'text-navyblue shadow-sm border-navyblue' : 'text-gray-600'}`}
          onClick={() => setActiveTab('reply')}
        >
          To reply
        </button>
      
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto mt-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => onSelectChat(chat)}
              className={`px-4 py-3  cursor-pointer transition ${
                selectedChatId === chat.chatId ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4  border-red-400">
                <div className="relative">
                  <img
                    src={chat.user.image}
                    alt={chat.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {chat.unread && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="my-auto space-x-2">
                      <p className="text-base text-black ">{chat.user.name}</p>
                      {/* {chat.user.country && (
                        <span className="text-xs text-gray-500">🇮🇩</span>
                      )} */}
                    </div>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-5 text-sm">No chats found...</p>
        )}
      </div>
    </div>
  );
}