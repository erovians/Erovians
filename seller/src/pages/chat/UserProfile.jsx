export default function UserProfile() {
  const media = [
    "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
    "https://images.pexels.com/photos/3184331/pexels-photo-3184331.jpeg",
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
  ];

  return (
    <div className="h-full flex flex-col items-center p-4 text-center overflow-y-auto">
      <img
        src="https://i.pravatar.cc/100"
        alt="profile"
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-3"
      />

      <h2 className="text-base sm:text-lg font-semibold">Richard Sanford</h2>
      <p className="text-gray-300 text-xs sm:text-sm mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

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

      <button className="mt-auto bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 text-sm sm:text-base transition">
        Logout
      </button>
    </div>
  );
}
