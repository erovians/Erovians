const users = [
  { id: 1, name: "Richard Sanford" },
  { id: 2, name: "Carmen Jacobsen" },
  { id: 3, name: "Brown Campbell" },
  { id: 4, name: "Enrique Murphy" },
  { id: 5, name: "Marco Fernandez" },
  { id: 6, name: "Alison Powell" },
];

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 text-lg font-semibold">ChatApp 💬</div>
      <input
        type="text"
        placeholder="Search here..."
        className="mx-4 mb-3 px-3 py-2 rounded-lg bg-[#0E2A6B] placeholder-gray-300 text-sm focus:outline-none"
      />
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="px-4 py-3 hover:bg-[#102F7A] cursor-pointer transition"
          >
            {user.name}
          </div>
        ))}
      </div>
    </div>
  );
}
