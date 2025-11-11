// import { useEffect, useState } from "react";
// import { MessageCircleMore } from "lucide-react";
// import { chatApi } from "@/utils/axios.utils";
// export default function Sidebar({ onSelectChat, selectedChatId }) {
//   const [chatUsers, setChatUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [activeTab, setActiveTab] = useState("all");

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
//     <div className="h-full flex flex-col bg-white border-r w-full max-w-full">
//       {/* Header */}
//       <div className="px-3 py-2 md:px-4 md:py-3 border-b">
//         <div className="flex items-center justify-between text-black  gap-4">
//           {/* Title */}
//           <div className="flex items-center gap-2 ">
//             <h2 className="text-sm md:text-lg font-semibold flex items-center gap-2">
//               Erovians <MessageCircleMore className="w-5 h-5 md:w-7 md:h-7" />
//             </h2>
//           </div>

//           {/* Search Bar */}
//           <div className="relative w-28 xs:w-36 sm:w-44 md:w-56 lg:w-64 ">
//             <input
//               type="text"
//               placeholder="Search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full  flex m-auto pl-3 pr-9 py-1.5 md:py-2 rounded-lg border border-gray-300 placeholder-gray-400 text-xs md:text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-500"
//             />
//             <svg
//               className="w-4 h-4 md:w-5 md:h-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b text-xs md:text-sm font-medium">
//         <button
//           className={`flex-1 py-2 md:py-3 ${
//             activeTab === "all"
//               ? "text-navyblue border-b-2 border-navyblue"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("all")}
//         >
//           All
//         </button>
//         <button
//           className={`flex-1 py-2 md:py-3 ${
//             activeTab === "unread"
//               ? "text-navyblue border-b-2 border-navyblue"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("unread")}
//         >
//           Unread
//         </button>
//         {/* <button
//           className={`flex-1 py-2 md:py-3 ${
//             activeTab === "reply"
//               ? "text-navyblue border-b-2 border-navyblue"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("reply")}
//         >
//           To reply
//         </button> */}
//       </div>

//       {/* Chat List */}
//       <div className="flex-1 overflow-y-auto mt-2 md:mt-3">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((chat) => (
//             <div
//               key={chat.chatId}
//               onClick={() => onSelectChat(chat)}
//               className={`px-3 py-2 md:px-4 md:py-3 cursor-pointer transition ${
//                 selectedChatId === chat.chatId
//                   ? "bg-blue-50"
//                   : "hover:bg-gray-50"
//               }`}
//             >
//               <div className="flex items-start space-x-3 md:space-x-4">
//                 {/* Profile */}
//                 <div className="relative">
//                   <img
//                     src={chat.user.profileImage}
//                     alt={chat.user.name}
//                     className="w-8 h-8 md:w-10 md:h-10 rounded-full"
//                   />
//                   {chat.unread && (
//                     <span className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full border-2 border-white"></span>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <p className="text-sm md:text-base font-medium text-black truncate">
//                       {chat.user.name}
//                     </p>
//                     <span className="text-[10px] md:text-xs text-gray-500">
//                       {chat.time}
//                     </span>
//                   </div>
//                   <p className="text-xs md:text-sm text-gray-600 truncate">
//                     {chat.lastMessage}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-400 mt-5 text-xs md:text-sm">
//             No chats found...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { chatApi } from "@/utils/axios.utils";

export default function Sidebar({ onSelectChat, selectedChatId }) {
  const [chatUsers, setChatUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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

  // ✅ Search + Unread Filter
  const filteredUsers = chatUsers
    .filter((item) =>
      item?.user?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => (activeTab === "unread" ? item.unreadCount > 0 : true));

  return (
    <div className="h-full flex flex-col bg-white border-r w-full max-w-full">
      {/* Header */}
      <div className="px-3 py-2 md:px-4 md:py-3 border-b">
        <div className="flex items-center justify-between text-black gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-lg font-semibold flex items-center gap-2">
              Erovians <MessageCircleMore className="w-5 h-5 md:w-7 md:h-7" />
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-28 xs:w-36 sm:w-44 md:w-56 lg:w-64 ">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 md:py-2 rounded-lg border border-gray-300 placeholder-gray-400 text-xs md:text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <svg
              className="w-4 h-4 md:w-5 md:h-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
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
      <div className="flex border-b text-xs md:text-sm font-medium">
        <button
          className={`flex-1 py-2 md:py-3 ${
            activeTab === "all"
              ? "text-navyblue border-b-2 border-navyblue"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>

        <button
          className={`flex-1 py-2 md:py-3 relative ${
            activeTab === "unread"
              ? "text-navyblue border-b-2 border-navyblue"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Unread
          {/* 🔴 Show total unread count on tab */}
          {chatUsers.some((u) => u.unreadCount > 0) && (
            <span className="absolute top-1 right-4 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
              {chatUsers.reduce((acc, u) => acc + u.unreadCount, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto mt-2 md:mt-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => onSelectChat(chat)}
              className={`px-3 py-2 md:px-4 md:py-3 cursor-pointer transition ${
                selectedChatId === chat.chatId
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start space-x-3 md:space-x-4">
                {/* Profile */}
                <div className="relative">
                  <img
                    src={chat.user.profileImage}
                    alt={chat.user.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                  />

                  {/* 🔥 Unread Count Bubble */}
                  {chat.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] md:text-[10px] font-semibold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 border-white">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm md:text-base font-medium text-black truncate">
                      {chat.user.name}
                    </p>
                    <span className="text-[10px] md:text-xs text-gray-500">
                      {chat.lastMessageAt
                        ? new Date(chat.lastMessageAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-5 text-xs md:text-sm">
            No chats found...
          </p>
        )}
      </div>
    </div>
  );
}
