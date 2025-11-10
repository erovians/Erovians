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

//   const sendMessage = async () => {
//     if (!text.trim()) return;

//     try {
//       const res = await chatApi.post("/chat/send-message", {
//         chatId: selectedChat.chatId,
//         text,
//         receiverId: selectedChat.user._id,
//       });

//       setMessages((prev) => [...prev, res.data.data]);
//       setText("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   if (!selectedChat) {
//     return (
//       <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
//         <div className="text-center">
//           <div className="text-6xl mb-4">💬</div>
//           <p>Select a conversation to start chatting</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-white overflow-hidden">
//       {/* Header – hidden on small screens */}
//       <div className="hidden md:flex items-center justify-between px-4 py-3 border-b bg-white">
//         <div className="flex items-center space-x-3">
//           <img
//             src={selectedChat.user?.profileImage}
//             alt="profile"
//             className="w-8 h-8 rounded-full"
//           />
//           <div>
//             <h2 className="font-semibold text-sm">{selectedChat.user?.name}</h2>
//             <p className="text-xs text-gray-500">
//               {selectedChat.user?.country || "Online"}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <button className="p-2 hover:bg-gray-100 rounded">
//             <svg
//               className="w-5 h-5 text-gray-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex mb-4 ${
//               msg.senderId === selectedChat.user._id
//                 ? "justify-start"
//                 : "justify-end"
//             }`}
//           >
//             {msg.senderId === selectedChat.user._id && (
//               <img
//                 src={selectedChat.user.profileImage}
//                 alt="avatar"
//                 className="w-6 h-6 rounded-full mr-2"
//               />
//             )}
//             <div
//               className={`px-4 py-2 rounded-lg max-w-[70%] ${
//                 msg.senderId === selectedChat.user._id
//                   ? "bg-white border border-gray-200 text-gray-800"
//                   : "bg-navyblue text-white"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//               <p
//                 className={`text-xs mt-1 ${
//                   msg.senderId === selectedChat.user._id
//                     ? "text-gray-400"
//                     : "text-blue-100"
//                 }`}
//               >
//                 {msg.timestamp}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Message Input */}
//       <div className="px-4 py-3 border-t bg-white">
//         <div className="flex items-center space-x-2">
//           <button className="p-2 hover:bg-gray-100 rounded">📎</button>

//           <input
//             type="text"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Enter your message..."
//             className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
//           />

//           <button
//             onClick={sendMessage}
//             className="bg-navyblue text-white px-4 py-2 rounded hover:bg-blue-950 transition text-sm font-medium"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { chatApi } from "@/utils/axios.utils";
// import { socket, connectSocket } from "@/utils/socket";

// export default function ChatWindow({ selectedChat }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   useEffect(() => {
//     connectSocket();

//     // ✅ Listen to online users
//     socket.on("getUsers", (users) => {
//       console.log("Active:", users);
//       setOnlineUsers(users);
//     });

//     // ✅ Listen to incoming messages
//     socket.on("getMessage", (msg) => {
//       console.log("New message received:", msg);

//       // append only if message belongs to this selected chat
//       if (msg.chatId === selectedChat?.chatId) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("getUsers");
//       socket.off("getMessage");
//     };
//   }, [selectedChat]);

//   // Fetch messages on chat change
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

//   const sendMessage = () => {
//     if (!text.trim()) return;

//     socket.emit(
//       "sendMessage",
//       {
//         chatId: selectedChat.chatId,
//         text,
//         receiverId: selectedChat.user._id,
//       },
//       (ack) => {
//         if (ack.ok) {
//           setMessages((prev) => [...prev, ack.data]); // show immediately
//           setText("");
//         } else {
//           console.error("Send Error:", ack.error);
//         }
//       }
//     );
//   };

//   const isOnline = onlineUsers.some(
//     (u) => u.userId === selectedChat?.user?._id
//   );

//   if (!selectedChat) {
//     return (
//       <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
//         <div className="text-center">
//           <div className="text-6xl mb-4">💬</div>
//           <p>Select a conversation to start chatting</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-white overflow-hidden">
//       {/* Header */}
//       <div className="hidden md:flex items-center justify-between px-4 py-3 border-b bg-white">
//         <div className="flex items-center space-x-3">
//           <img
//             src={selectedChat.user?.profileImage}
//             alt="profile"
//             className="w-8 h-8 rounded-full"
//           />
//           <div>
//             <h2 className="font-semibold text-sm">{selectedChat.user?.name}</h2>
//             <p className="text-xs text-gray-500">
//               {isOnline ? "🟢 Online" : "⚪ Offline"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex mb-4 ${
//               msg.senderId === selectedChat.user._id
//                 ? "justify-start"
//                 : "justify-end"
//             }`}
//           >
//             {msg.senderId === selectedChat.user._id && (
//               <img
//                 src={selectedChat.user.profileImage}
//                 alt="avatar"
//                 className="w-6 h-6 rounded-full mr-2"
//               />
//             )}
//             <div
//               className={`px-4 py-2 rounded-lg max-w-[70%] ${
//                 msg.senderId === selectedChat.user._id
//                   ? "bg-white border border-gray-200 text-gray-800"
//                   : "bg-navyblue text-white"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="px-4 py-3 border-t bg-white">
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Enter your message..."
//             className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
//           />

//           <button
//             onClick={sendMessage}
//             className="bg-navyblue text-white px-4 py-2 rounded text-sm"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { chatApi } from "@/utils/axios.utils";
import { socket, connectSocket } from "@/utils/socket";

export default function ChatWindow({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    connectSocket();

    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("getMessage", (msg) => {
      if (msg.chatId === selectedChat?.chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("typing", ({ chatId, from }) => {
      if (chatId === selectedChat?.chatId && from === selectedChat?.user?._id) {
        setIsTyping(true);
      }
    });

    socket.on("stopTyping", ({ chatId, from }) => {
      if (chatId === selectedChat?.chatId && from === selectedChat?.user?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("getUsers");
      socket.off("getMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [selectedChat]);

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

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit(
      "sendMessage",
      {
        chatId: selectedChat.chatId,
        text,
        receiverId: selectedChat.user._id,
      },
      (ack) => {
        if (ack.ok) {
          setMessages((prev) => [...prev, ack.data]);
          setText("");
          socket.emit("stopTyping", { chatId: selectedChat.chatId });
        }
      }
    );
  };

  let typingTimeout;
  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", { chatId: selectedChat.chatId });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { chatId: selectedChat.chatId });
    }, 1500);
  };

  const isOnline = onlineUsers.some(
    (u) => u.userId === selectedChat?.user?._id
  );

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
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="hidden md:flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center space-x-3">
          <img
            src={selectedChat.user?.profileImage}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-sm">{selectedChat.user?.name}</h2>
            <p className="text-xs text-gray-500">
              {isTyping
                ? "✍️ typing..."
                : isOnline
                ? "🟢 Online"
                : "⚪ Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-4 ${
              msg.senderId === selectedChat.user._id
                ? "justify-start"
                : "justify-end"
            }`}
          >
            {msg.senderId === selectedChat.user._id && (
              <img
                src={selectedChat.user.profileImage}
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
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Enter your message..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />

          <button
            onClick={sendMessage}
            className="bg-navyblue text-white px-4 py-2 rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
