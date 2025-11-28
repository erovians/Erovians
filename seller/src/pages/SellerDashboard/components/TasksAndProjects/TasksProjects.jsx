import { useState } from "react";
import { Search } from "lucide-react";

export default function TasksAndProjects() {
  const columns = [
    {
      title: "TO DO",
      tasks: ["Import façade plan (CH-ALN-042)", "Order diamond blades Ø350"],
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
    <div className="flex h-[85vh] bg-navyblue text-gray-200 overflow-y-auto">

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 py-4 w-full">

        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">

          {/* Search */}
          <div className="flex items-center shadow-[5px] shadow-white bg-transparent px-3 py-2 rounded-lg w-full lg:w-[350px]">
            <Search className="w-4 h-4 mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search (clients, orders, lots, invoices)…"
              className="bg-transparent w-full outline-none text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 lg:gap-4">
            <button className="bg-white text-black px-4 py-2 rounded-md border border-gray-700 text-sm hover:shadow-md">
              Theme
            </button>

            <button className="bg-white text-black px-4 py-2 rounded-md border border-gray-700 text-sm hover:shadow-md">
              Notifications 13
            </button>

            <button className="bg-white text-black px-4 py-2 rounded-md border border-gray-700 text-sm hover:shadow-md">
              Profile
            </button>

            <button className="bg-navyblue border border-white px-4 py-2 rounded-md text-sm hover:shadow-md">
              + New
            </button>
          </div>
        </div>

        {/* Page Title */}
        <h2 className="text-xl font-semibold mb-4">Projects & Tasks</h2>

        {/* Kanban Board */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          xl:grid-cols-4
          gap-6
        ">
          {columns.map((col) => (
            <div
              key={col.title}
              className="bg-gray-100 border border-gray-800 rounded-xl p-4 h-[450px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-black">{col.title}</h3>
                <button className="bg-navyblue px-3 py-1 text-sm rounded-md border border-gray-700 hover:bg-gray-900 cursor-pointer">
                  + Task
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-3 overflow-y-auto h-[350px] pr-1">
                {col.tasks.map((task, i) => (
                  <div
                    key={i}
                    className="bg-navyblue border border-gray-700 p-3 rounded-lg text-sm hover:bg-gray-800 cursor-pointer"
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
