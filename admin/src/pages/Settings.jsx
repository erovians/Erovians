export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Change Password
        </button>

        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}
