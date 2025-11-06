export default function UserProfile({ user }) {
  const media = [
    "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
    "https://images.pexels.com/photos/3184331/pexels-photo-3184331.jpeg",
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
    "https://images.pexels.com/photos/3184331/pexels-photo-3184331.jpeg",
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
  ];

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        No user selected
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center p-4 text-center overflow-y-auto">
      <img
        src={user.profilePic || "https://i.pravatar.cc/100"}
        alt="profile"
        className="w-20 h-20 mt-10 sm:w-24 sm:h-24 rounded-full mb-3"
      />

      <h2 className="text-base sm:text-lg font-semibold">{user.name}</h2>
      <h2 className="text-xs font-light">{user.email}</h2>
      <h2 className="text-xs font-light">{user.mobile}</h2>

      {user.bio && (
        <p className="text-gray-300 text-xs sm:text-sm mb-4">
          {user.bio || "No bio available."}
        </p>
      )} 

      <div className="w-full text-left mb-2 font-semibold text-sm sm:text-base">
        Media
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {media.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="media"
            className="rounded-lg w-full h-16 sm:h-20 object-cover"
          />
        ))}
      </div>

     
    </div>
  );
}
