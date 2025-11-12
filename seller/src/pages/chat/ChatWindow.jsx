// import { useEffect, useRef, useState } from "react";
// import { chatApi } from "@/utils/axios.utils";
// import { CloudUpload } from "lucide-react";
// import { assets } from "@/assets/assets";

// export default function ChatWindow({ selectedChat, onlineUsers = [] }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const fileInputRef = useRef(null);

//   const isOnline = onlineUsers.some(
//     (u) => u.userId === selectedChat?.user?._id
//   );

//   // Fetch previous messages
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

//   // ✅ Send text + optional file
//   const sendMessage = async () => {
//     if (!text.trim() && !file) return;

//     const formData = new FormData();
//     formData.append("chatId", selectedChat.chatId);
//     formData.append("receiverId", selectedChat.user._id);
//     if (text) formData.append("text", text);
//     if (file) formData.append("file", file);

//     try {
//       const res = await chatApi.post("/chat/send-message", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessages((prev) => [...prev, res.data.data]);
//       setText("");
//       setFile(null);
//       fileInputRef.current.value = "";
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleFileSelect = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) setFile(selectedFile);
//   };

//   if (!selectedChat) {
//     return (
//       <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
//         <div className="text-center">
//           <img src={assets.logo} alt="" width={100} className="m-auto mb-4" />
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
//           <div className="relative">
//             <img
//               src={selectedChat.user?.profileImage}
//               alt="profile"
//               className="w-9 h-9 rounded-full"
//             />
//             <span
//               className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                 isOnline ? "bg-green-500" : "bg-gray-400"
//               }`}
//             />
//           </div>
//           <div>
//             <h2 className="font-semibold text-sm">{selectedChat.user?.name}</h2>
//             <p className="text-xs text-gray-500">
//               {isOnline ? "Active Now" : "Offline"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50 hide-scrollbar">
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
//               {/* If image/file exists */}
//               {msg.fileUrl &&
//                 (msg.fileType === "image" ? (
//                   <img
//                     src={msg.fileUrl}
//                     alt="uploaded"
//                     className="rounded-lg max-w-full mb-2"
//                   />
//                 ) : (
//                   <a
//                     href={msg.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline text-blue-400 text-sm mb-2 block"
//                   >
//                     📄 View File
//                   </a>
//                 ))}

//               {msg.text && <p className="text-sm">{msg.text}</p>}

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
//       <div className="px-4 py-3 border-t bg-white flex items-center space-x-2">
//         {/* Upload Button */}
//         <button
//           className="p-2 hover:bg-gray-100 rounded"
//           onClick={() => fileInputRef.current.click()}
//         >
//           <CloudUpload />
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           accept=".jpg,.jpeg,.png,.pdf,.heic"
//           className="hidden"
//           onChange={handleFileSelect}
//         />

//         {file && (
//           <p className="text-xs text-gray-600 truncate max-w-[100px]">
//             {file.name}
//           </p>
//         )}

//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Enter your message..."
//           className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
//         />

//         <button
//           onClick={sendMessage}
//           className="bg-navyblue text-white px-4 py-2 rounded hover:bg-blue-950 transition text-sm font-medium"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import { chatApi } from "@/utils/axios.utils";
import { CloudUpload } from "lucide-react";
import { assets } from "@/assets/assets";

export default function ChatWindow({ selectedChat, onlineUsers = [] }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const isOnline = onlineUsers.some(
    (u) => u.userId === selectedChat?.user?._id
  );

  // Fetch previous messages
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
    if (!text.trim() && !file) return;

    // STEP 1: show local message immediately (optimistic)
    const tempId = Date.now();
    const localUrl = file ? URL.createObjectURL(file) : null;

    const optimisticMsg = {
      _id: tempId,
      senderId: "self",
      text,
      fileUrl: localUrl,
      fileType: file
        ? file.type.startsWith("image/")
          ? "image"
          : "file"
        : null,
      timestamp: "...",
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    // STEP 2: upload in background
    const formData = new FormData();
    formData.append("chatId", selectedChat.chatId);
    formData.append("receiverId", selectedChat.user._id);
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);

    try {
      const res = await chatApi.post("/chat/send-message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // STEP 3: replace temporary message with real one
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? res.data.data : m))
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId
            ? { ...m, timestamp: "❌ Failed to send", pending: false }
            : m
        )
      );
    } finally {
      setText("");
      setFile(null);
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
        <div className="text-center">
          <img src={assets.logo} alt="" width={100} className="m-auto mb-4" />
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
          <div className="relative">
            <img
              src={selectedChat.user?.profileImage}
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div>
            <h2 className="font-semibold text-sm">{selectedChat.user?.name}</h2>
            <p className="text-xs text-gray-500">
              {isOnline ? "Active Now" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 hide-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={msg._id || i}
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
              {/* If image/file exists */}
              {msg.fileUrl &&
                (msg.fileType === "image" ? (
                  <img
                    src={msg.fileUrl}
                    alt="uploaded"
                    onClick={() => setPreviewImage(msg.fileUrl)}
                    className={`rounded-lg max-w-full h-[130px] mb-2 cursor-pointer hover:opacity-80 transition ${
                      msg.pending ? "opacity-80" : ""
                    }`}
                  />
                ) : (
                  <a
                    href={msg.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-400 text-sm mb-2 block"
                  >
                    📄 View File
                  </a>
                ))}

              {msg.text && <p className="text-sm">{msg.text}</p>}

              <p
                className={`text-xs mt-1 ${
                  msg.senderId === selectedChat.user._id
                    ? "text-gray-400"
                    : "text-blue-100"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-4 py-3 border-t bg-white flex items-center space-x-2">
        {/* Upload Button */}
        <button
          className="p-2 hover:bg-gray-100 rounded relative"
          onClick={() => fileInputRef.current.click()}
        >
          <CloudUpload />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          accept=".jpg,.jpeg,.png,.pdf,.heic"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* ✅ Show preview if file selected */}
        {file && (
          <div className="flex items-center space-x-2">
            {file.type.startsWith("image/") ? (
              // 🖼️ Image preview
              <div className="relative w-10 h-10">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-10 h-10 rounded object-cover border"
                />
                {/* Small close/remove button */}
                <button
                  onClick={() => {
                    setFile(null);
                    fileInputRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-[4px] py-[1px]"
                >
                  ✕
                </button>
              </div>
            ) : (
              // 📄 Non-image file indicator
              <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                <span className="text-sm">📄 {file.name.slice(0, 12)}...</span>
                <button
                  onClick={() => {
                    setFile(null);
                    fileInputRef.current.value = "";
                  }}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Enter your message..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={sendMessage}
          className="bg-navyblue text-white px-4 py-2 rounded hover:bg-blue-950 transition text-sm font-medium"
        >
          Send
        </button>
      </div>

      {/* ✅ Fullscreen Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 text-white bg-black/50 rounded-full p-2 hover:bg-black transition"
            >
              ✕
            </button>

            {/* Full Image */}
            <img
              src={previewImage}
              alt="Full Preview"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
