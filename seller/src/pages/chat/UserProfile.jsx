// export default function UserProfile({ user }) {
//   const media = [
//     "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
//     "https://images.pexels.com/photos/3184331/pexels-photo-3184331.jpeg",
//     "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
//     "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
//     "https://images.pexels.com/photos/3184331/pexels-photo-3184331.jpeg",
//     "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
//   ];

//   if (!user) {
//     return (
//       <div className="h-full flex items-center justify-center text-gray-400">
//         No user selected
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col items-center p-4  overflow-y-auto">
//       <img
//         src={user.image || "https://i.pravatar.cc/100"}
//         alt="profile"
//         className="w-20 h-20 mt-10 sm:w-24 sm:h-24 rounded-full mb-3"
//       />

     
//      <div className="flex flex-col  ">

//       <h2 className="text-base sm:text-lg font-semibold">{user.name}</h2>
//       <h4 className="text-xs font-light">{user.email}</h4>
//       <h4 className="text-xs font-light">{user.mobile}</h4>
//     </div>
//       {user.bio && (
//         <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-3">
//           {user.bio || "No bio available."}
//         </p>
//       )} 
  

//       <div className="w-full text-left mb-2 font-semibold text-sm sm:text-base">
//         Media
//       </div>

//       <div className="grid grid-cols-3 gap-2 mb-4">
//         {media.map((src, i) => (
//           <img
//             key={i}
//             src={src}
//             alt="media"
//             className="rounded-lg w-full h-16 sm:h-20 object-cover"
//           />
//         ))}
//       </div>

     
//     </div>
//   );
// }
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
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 border-l">
        No user selected
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white  overflow-y-auto">
     

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.image || "https://i.pravatar.cc/100"}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-semibold text-base">{user.name}</h2>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
               
                <span>{user.name || 'none'}</span>
              </div>
            </div>
          </div>
          <button  className=" text-blue-500 hover:cursor-pointer transition text-xs font-medium">
            Add as Customer
          </button>
        </div>

        {/* Company Details */}
        <div className="space-y-3 pb-4 border-b">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Company Name</span>
            <span className="font-medium text-gray-500">Sandeep Pvt Ltd</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-700">{user.email || 'none'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Registration Time</span>
            <span className="text-gray-700">2024-03-12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Buyer Tag</span>
            <span className="text-gray-700">-</span>
          </div>
        </div>

        {/* Preference Tags */}
        <div className="py-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Media</h3>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">{user.tags}</span> */}
            {
              media.map((src, i) => (
                <img src={src} alt="" className="w-30 h-30"/>

              ))
            }
          </div>
        </div>

       
      
      </div>
    </div>
  );
}