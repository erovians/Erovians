import { useEffect, useState } from "react";
import { chatApi } from "@/utils/axios.utils";

export default function Sidebar() {
  const [chatUsers, setChatUsers] = useState([]);
  const [search, setSearch] = useState("");

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
    item.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#0B235A] text-white">
      <div className="p-4 text-lg font-semibold">Erovians 💬</div>

      <input
        type="text"
        placeholder="Search here..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mx-4 mb-3 px-3 py-2 rounded-lg bg-[#0E2A6B] 
        placeholder-gray-300 text-sm focus:outline-none"
      />

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((chat, idx) => (
            <div
              key={idx}
              className="px-4 py-3 hover:bg-[#102F7A] cursor-pointer transition"
            >
              <div className="flex justify-between items-center">

              <p className="font-medium">Sandeep Nautiyal</p>
              <p className="text-xs">12:05</p>
              </div>
              <p className="text-xs line-clamp-1">Hi !! How are you sandeep ?</p>

             
              {chat.lastMessage && (
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {chat.lastMessage}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-5">
            No chats found...
          </p>
        )}
      </div>
    </div>
  );
}
