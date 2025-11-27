import { useState } from "react";
import { Search } from "lucide-react";

export default function TasksAndProjects() {
  const columns = [
    {
      title: "TO DO",
      tasks: [
        "Import façade plan (CH-ALN-042)",
        "Order diamond blades Ø350",
      ],
    },
    {
      title: "DOING",
      tasks: ["Nesting slabs — Granite Noir Z"],
    },
    {
      title: "REVIEW",
      tasks: ["Quote Q-892 — pricing check"],
    },
    {
      title: "DONE",
      tasks: ["Warehouse A inventory"],
    },
  ];

  return (
    <div className="flex h-screen bg-navyblue text-gray-200">
      
      

      {/* Main Content */}
      <div className="flex-1 px-6 py-4">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Search */}
          <div className="flex items-center bg-gray-500 px-3 py-2 rounded-lg w-[350px]">
            <Search className="w-4 h-4 mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search (clients, orders, lots, invoices)…"
              className="bg-transparent w-full outline-none text-sm"
            />
          </div>

          <div className="flex gap-4">
            <button className="bg-gray-900 px-4 py-2 rounded-md border border-gray-700 text-sm hover:bg-gray-800">
              Theme
            </button>

            <button className="bg-gray-900 px-4 py-2 rounded-md border border-gray-700 text-sm hover:bg-gray-800">
              Notifications 13
            </button>

            <button className="bg-gray-900 px-4 py-2 rounded-md border border-gray-700 text-sm hover:bg-gray-800">
              Profile
            </button>

            <button className="bg-blue-600 px-4 py-2 rounded-md text-sm">+ New</button>
          </div>
        </div>

        {/* Page Title */}
        <h2 className="text-xl font-semibold mb-4">Projects & Tasks</h2>

        {/* Kanban Board */}
        <div className="grid grid-cols-4 gap-6">
          {columns.map((col) => (
            <div
              key={col.title}
              className="bg-gray-500 border border-gray-800 rounded-xl p-4 h-[450px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-300">{col.title}</h3>
                <button className="bg-gray-900 px-3 py-1 text-sm rounded-md border border-gray-700 hover:bg-gray-800">
                  + Task
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {col.tasks.map((task, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-sm hover:bg-gray-800 cursor-pointer"
                  >
                    {task}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

     
      </div>
    </div>
  );
}
