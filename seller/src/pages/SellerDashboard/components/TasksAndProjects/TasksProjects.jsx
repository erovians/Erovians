// import { useEffect, useState } from "react";
// import { Search } from "lucide-react";
// import AddTaskModal from "./AddTaskModal";
// import api from "@/utils/axios.utils";

// export default function TasksAndProjects() {
//   const [tasks, setTasks] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const statuses = ["To Do", "Doing", "Review", "Done"];

//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/taskandprojects/");
//       setTasks(data.data || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const addTask = async (form) => {
//     await api.post("/taskandprojects/create", form);
//     setOpenModal(false);
//     fetchTasks();
//   };

//   const updateStatus = async (id, status) => {
//     await api.put(`/taskandprojects/${id}`, { status });
//     fetchTasks();
//   };

//   const deleteTask = async (id) => {
//     await api.delete(`/taskandprojects/${id}`);
//     fetchTasks();
//   };

//   return (
//    <div className="flex h-[85vh] bg-white text-gray-800 overflow-y-auto">

//   <AddTaskModal
//     open={openModal}
//     onClose={() => setOpenModal(false)}
//     onSave={addTask}
//   />

//   <div className="flex-1 px-4 sm:px-6 py-4 w-full">

//     {/* Header */}
//     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">

//       {/* Search */}
//       <div className="flex items-center bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm w-full lg:w-[350px]">
//         <Search className="w-4 h-4 mr-2 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search tasks..."
//           className="bg-transparent w-full outline-none text-sm text-gray-800"
//         />
//       </div>

//       {/* Add Button */}
//       <button
//         onClick={() => setOpenModal(true)}
//         className="bg-navyblue hover:bg-white hover:text-black text-white border border-navyblue cursor-pointer px-4 py-2 rounded-lg shadow-sm transition"
//       >
//         + Add Task
//       </button>
//     </div>

//     {/* Title */}
//     <h2 className="text-2xl font-semibold mb-6 text-gray-900">
//       Projects & Tasks
//     </h2>

//     {/* Kanban Board */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 ">

//       {statuses.map((col) => (
//         <div
//           key={col}
//           className="bg-gray-50 border border-gray-400 rounded-xl p-4 shadow-sm h-[450px] flex flex-col"
//         >
//           {/* Column Title */}
//           <div className="font-semibold text-gray-900 mb-4">{col}</div>

//           {/* Task List */}
//           <div className="space-y-3 overflow-y-auto h-[350px] pr-1">

//             {tasks
//               .filter((t) => t.status === col)
//               .map((task) => (
//                 <div
//                   key={task._id}
//                   className="bg-white border border-gray-200 p-3 rounded-lg text-sm shadow-sm hover:shadow-md transition"
//                 >

//                   {/* Title + Delete */}
//                   <div className="flex justify-between items-start mb-1">
//                     <span className="font-medium text-gray-900">{task.title}</span>

//                     <button
//                       className="text-red-500 hover:text-red-700 text-xs"
//                       onClick={() => deleteTask(task._id)}
//                     >
//                       Delete
//                     </button>
//                   </div>

//                   {/* Description */}
//                   <p className="text-gray-600 text-xs mb-2">
//                     {task.description || "No description"}
//                   </p>

//                   {/* Status Update */}
//                   <select
//                     className="w-full bg-white border border-gray-300 text-gray-800 text-xs p-2 rounded-lg shadow-sm"
//                     value={task.status}
//                     onChange={(e) => updateStatus(task._id, e.target.value)}
//                   >
//                     {statuses.map((s) => (
//                       <option key={s}>{s}</option>
//                     ))}
//                   </select>

//                 </div>
//               ))}
//           </div>
//         </div>
//       ))}

//     </div>
//   </div>
// </div>

//   );
// }
import { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import api from "@/utils/axios.utils";

export default function TasksAndProjects() {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Confirmation popup states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [pendingTaskId, setPendingTaskId] = useState(null);

  const statuses = ["To Do", "Doing", "Review", "Done"];

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/taskandprojects/");
      setTasks(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (form) => {
    try {
      await api.post("/taskandprojects/create", form);
      fetchTasks();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Something went wrong",
      };
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/taskandprojects/${id}`, { status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/taskandprojects/${id}`);
    fetchTasks();
  };

  return (
    <div className="flex h-[85vh] bg-white text-gray-800 overflow-y-auto">
      {/* Add Task Modal */}
      <AddTaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={addTask}
      />

      {/* Confirm Status Change Popup */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Status Change
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to move this task to{" "}
              <span className="font-bold text-gray-900">"{pendingStatus}"</span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 border border-navyblue hover:bg-navyblue hover:text-white cursor-pointer rounded-lg text-navyblue "
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  updateStatus(pendingTaskId, pendingStatus);
                  setConfirmOpen(false);
                }}
                className="px-4 py-2 bg-navyblue text-white cursor-pointer rounded-lg hover:bg-white hover:text-black border border-navyblue"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 py-4 w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          {/* Search */}
          <div className="flex items-center  w-full lg:w-[350px]">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Projects & Tasks
            </h2>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setOpenModal(true)}
            className="bg-navyblue hover:bg-white hover:text-black text-white border border-navyblue cursor-pointer px-4 py-2 rounded-lg shadow-sm transition"
          >
            + Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {statuses.map((col) => (
            <div
              key={col}
              className="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm h-[450px] flex flex-col"
            >
              {/* Column Title */}
              <div className="font-extrabold text-navyblue mb-4">{col}</div>

              {/* Task List */}
              <div className="space-y-3 overflow-y-auto h-[350px] pr-1">
                {tasks
                  .filter((t) => t.status === col)
                  .map((task) => (
                    <div
                      key={task._id}
                      className="bg-white border border-gray-200 p-3 rounded-lg text-sm shadow-sm hover:shadow-md transition"
                    >
                      {/* Title + Delete */}
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-900">
                          {task.title}
                        </span>

                        <button
                          className="text-red-500 cursor-pointer hover:text-red-700 text-xs"
                          onClick={() => deleteTask(task._id)}
                        >
                          Delete
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-xs mb-2">
                        {task.description || "No description provided"}
                      </p>

                      {/* Status Dropdown with Confirmation */}
                      <select
                        className="w-full bg-white border border-gray-300 text-gray-800 text-xs p-2 rounded-lg shadow-sm"
                        value={task.status}
                        onChange={(e) => {
                          setPendingTaskId(task._id);
                          setPendingStatus(e.target.value);
                          setConfirmOpen(true);
                        }}
                      >
                        {statuses.map((s) => (
                          <option
                            key={s}
                            className="bg-white text-gray-800 hover:bg-navyblue hover:text-white"
                          >
                            {s}
                          </option>
                        ))}
                      </select>
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
