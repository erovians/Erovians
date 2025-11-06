
// import { useEffect, useState } from "react";
// import { chatApi } from "@/utils/axios.utils";

// export default function ChatWindow({ selectedChat }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   useEffect(() => {
//     if (!selectedChat) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await chatApi.get(
//           `/chat/${selectedChat.chatId}/messages/?selectedUserId=${selectedChat.user._id}`
//         );
//         setMessages(res.data.messages);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [selectedChat]);

//   // ✅ Send Message Handler
//   const sendMessage = async () => {
//     if (!text.trim()) return;

//     try {
//       const res = await chatApi.post("/chat/send-message", {
//         chatId: selectedChat.chatId,
//         text,
//         receiverId: selectedChat.user._id,
//       });

//       // Add new message to UI instantly
//       setMessages((prev) => [...prev, res.data.data]);
//       setText("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   if (!selectedChat) {
//     return <div className="h-full flex text-gray-400 items-center justify-center">Welcome to Erovians Chat ..</div>;
//   }

//   console.log("Selected Chat in ChatWindow:", selectedChat);

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between p-3 border-b bg-white sticky top-0">
//         <div className="flex items-center space-x-3">
//           <img
//             src={selectedChat.user?.image || "No Image"}
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
//   {messages.map((msg, i) => (
//     <div
//       key={i}
//       className={`flex ${
//         msg.senderId === selectedChat.user._id ? "justify-start" : "justify-end"
//       }`}
//     >
//       <div
//         className={`px-3 py-2 rounded-xl max-w-[70%] text-sm 
//           ${
//             msg.senderId === selectedChat.user._id
//               ? "bg-gray-200 text-gray-800"   
//               : "bg-blue-500 text-white"       
//           }`}
//       >
//         {msg.text}
//       </div>
//     </div>
//   ))}
// </div>


//       {/* ✅ Message Input */}
//       <div className="p-3 border-t flex items-center bg-white">
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
//         >
//           ➤
//         </button>
//       </div>
//     </div>
//   );
// }
// ChatWindow Component


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

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await chatApi.post("/chat/send-message", {
        chatId: selectedChat.chatId,
        text,
        receiverId: selectedChat.user._id,
      });

      setMessages((prev) => [...prev, res.data.data]);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center space-x-3">
          <img
            src={selectedChat.user?.image}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-sm">{selectedChat.user?.name}</h2>
            <p className="text-xs text-gray-500">{selectedChat.user?.country || 'Online'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-4 ${
              msg.senderId === selectedChat.user._id ? "justify-start" : "justify-end"
            }`}
          >
            {msg.senderId === selectedChat.user._id && (
              <img
                src={selectedChat.user.image}
                alt="avatar"
                className="w-6 h-6 rounded-full mr-2"
              />
            )}
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.senderId === selectedChat.user._id
                  ? "bg-white border border-gray-200 text-gray-800"
                  : "bg-navyblue text-white"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.senderId === selectedChat.user._id ? 'text-gray-400' : 'text-blue-100'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-4 py-3 border-t bg-white">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder='Enter your message...'
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button
            onClick={sendMessage}
            className="bg-navyblue text-white px-4 py-2 rounded hover:bg-blue-950 transition text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}