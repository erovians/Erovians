import { useEffect, useState } from "react";
import axios from "axios";
import { chatApi } from "@/utils/axios.utils";

export default function Sidebar() {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
     
        const res = await chatApi.get("/chat");
        console.log("Fetched chats2:", res);
        setChats(res.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  console.log("All chats:", chats);

  const filteredChats = chats.filter(chat =>
    chat.members.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col bg-navyblue text-white">
      <div className="p-4 text-lg font-semibold border-b border-[#123]">
        ChatApp 💬
      </div>

      <input
        type="text"
        placeholder="Search here..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mx-4 my-3 px-3 py-2 rounded-lg bg-[#0E2A6B] placeholder-gray-300 text-sm focus:outline-none"
      />

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            // Identify the chat partner (not the logged-in user)
            const partner = chat.members.find((m) => m._id !== chat.currentUserId);

            return (
              <div
                key={chat._id}
                className="px-4 py-3 hover:bg-[#102F7A] cursor-pointer transition"
              >
                {partner?.name || "Unknown User"}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 mt-6">No chats yet</p>
        )}
      </div>
    </div>
  );
}
