// import { useEffect, useState } from "react";
// import { chatApi } from "@/utils/axios.utils";

// export default function ChatWindow({ selectedChat }) {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     if (!selectedChat) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await chatApi.get(`/chat/${selectedChat.chatId}/messages/?selectedUserId=${selectedChat.user._id}`); 
//         setMessages(res.data.messages);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [selectedChat]);

//   if (!selectedChat) {
//     return <div className="h-full flex items-center justify-center">Select a chat...</div>;
//   }

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between p-3 border-b bg-white sticky top-0">
//         <div className="flex items-center space-x-3">
//           <img
//             src="https://i.pravatar.cc/50"
//             alt="profile"
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <h2 className="font-semibold">{selectedChat.user?.name}</h2>
//             <p className="text-green-500 text-xs">Online</p>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-3 space-y-3">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex ${msg.senderId === selectedChat.user._id ? "justify-end" : "justify-start"}`}
//           >
//             <div className={`px-3 py-2 rounded-xl max-w-[70%] text-sm 
//               ${msg.senderId === selectedChat.user._id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
//               {msg.text}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { chatApi } from "@/utils/axios.utils";

export default function ChatWindow({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const res = await chatApi.get(
          `/chat/${selectedChat.chatId}/messages/?selectedUserId=${selectedChat.user._id}`
        );
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // ✅ Send Message Handler
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await chatApi.post("/chat/send-message", {
        chatId: selectedChat.chatId,
        text,
        receiverId: selectedChat.user._id,
      });

      // Add new message to UI instantly
      setMessages((prev) => [...prev, res.data.data]);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!selectedChat) {
    return <div className="h-full flex items-center justify-center">Select a chat...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-white sticky top-0">
        <div className="flex items-center space-x-3">
          <img
            src="https://i.pravatar.cc/50"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold">{selectedChat.user?.name}</h2>
            <p className="text-green-500 text-xs">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`flex ${
        msg.senderId === selectedChat.user._id ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`px-3 py-2 rounded-xl max-w-[70%] text-sm 
          ${
            msg.senderId === selectedChat.user._id
              ? "bg-gray-200 text-gray-800"   // Other user (LEFT) → Gray
              : "bg-blue-500 text-white"       // You (RIGHT) → Blue
          }`}
      >
        {msg.text}
      </div>
    </div>
  ))}
</div>


      {/* ✅ Message Input */}
      <div className="p-3 border-t flex items-center bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
