import { useState } from "react";

export default function UserProfile({ user, onlineUsers = [], media = [] }) {
  const [previewImage, setPreviewImage] = useState(null);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 border-l">
        No user selected
      </div>
    );
  }

  const userMedia = media;
  const isOnline = onlineUsers.some((u) => u.userId === user._id);

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto hide-scrollbar">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.profileImage || "https://i.pravatar.cc/100"}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
              />
            </div>

            <div>
              <h2 className="font-semibold text-xs text-black">{user?.name}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {isOnline ? "Active Now" : "Offline"}
              </p>
            </div>
          </div>

          <button className="text-blue-500 hover:cursor-pointer transition text-xs font-medium">
            Add as Customer
          </button>
        </div>

        {/* Company Details */}
        <div className="space-y-3 pb-4 border-b">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Company Name</span>
            <span className="text-gray-600 font-medium text-[13px]">
              {user.companyName || "Sandeep Pvt Ltd."}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-600 font-medium text-[13px]">
              {user.email || "none"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Registration Time</span>
            <span className="text-gray-600 font-medium text-[13px]">
              2024-03-12
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Buyer Tag</span>
            <span className="text-gray-600 font-medium text-[13px]">-</span>
          </div>
        </div>

        {/* Media Section */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Media</h3>
          </div>

          {/* Scrollable Media Grid */}
          <div className="max-h-fit flex-1 overflow-y-auto pr-2 hide-scrollbar border">
            <div className="flex flex-wrap gap-2">
              {userMedia.length === 0 && (
                <p className="text-xs text-gray-500">No media shared yet.</p>
              )}

              {userMedia.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="media"
                  onClick={() => setPreviewImage(src)}
                  className="w-24 h-28 rounded object-cover border cursor-pointer hover:opacity-80"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview */}
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

            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
