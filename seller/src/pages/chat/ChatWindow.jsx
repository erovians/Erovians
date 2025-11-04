export default function ChatWindow() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white sticky top-0">
        <div className="flex items-center space-x-3">
          <img
            src="https://i.pravatar.cc/50"
            alt="profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-sm sm:text-base">Richard Sanford</h2>
            <p className="text-green-500 text-xs">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-xl max-w-[75%] text-sm sm:text-base">
            Hello! How are you?
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-blue-600 text-white px-3 py-2 rounded-xl max-w-[75%] text-sm sm:text-base">
            I’m good, thanks for asking!
          </div>
        </div>

        <div className="flex justify-start">
          <img
            src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg"
            alt="chat-media"
            className="rounded-xl w-32 sm:w-48"
          />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t flex items-center bg-white">
        <input
          type="text"
          placeholder="Send a message..."
          className="flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none"
        />
        <button className="ml-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm sm:text-base">
          ➤
        </button>
      </div>
    </div>
  );
}
