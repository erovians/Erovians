// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { fetchInquiries } from "../../../../../redux/slice/inquirySlice";
// import InquiryHeader from "./InquiryHeader";
// import InquiryFilters from "./InquiryFilters.jsx";
// import InquiryToolbar from "./InquiryToolbar";
// import InquiryItem from "./InquiryItem";
// import InquirySkeleton from "./InquirySkeleton";
// import { AlertDialogMenu } from "../../Helper/AlertDialogMenu";

// const Inquiry = () => {
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [spamDialogOpen, setSpamDialogOpen] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const inquiries = useSelector((state) => state.inquiries.list);
//   const { loading, error, total, counts } = useSelector(
//     (state) => state.inquiries
//   );

//   // Local state for filters and selections
//   const [selectedTab, setSelectedTab] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedInquiries, setSelectedInquiries] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("Latest");

//   useEffect(() => {
//     dispatch(
//       fetchInquiries({
//         page: 1,
//         limit: 25,
//         tab: selectedTab, // "All" | "Flagged" | "Spam" | "Deleted" | ("Sent" currently no-op)
//         statusTab: statusFilter, // "All" | "Pending for reply" | "New inquiry"
//         sortBy, // "Latest" | "Oldest" | "Unread"
//         q: searchQuery,
//       })
//     );
//     // re-fetch when any control changes
//   }, [dispatch, selectedTab, statusFilter, sortBy, searchQuery]);

//   // Handle inquiry selection
//   const handleSelectInquiry = useCallback((id) => {
//     setSelectedInquiries((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   }, []);

//   const handleSelectAll = useCallback(
//     (checked) => {
//       if (checked) {
//         setSelectedInquiries(inquiries.map((inq) => inq._id));
//       } else {
//         setSelectedInquiries([]);
//       }
//     },
//     [inquiries]
//   );

//   // Handle view details
//   const handleView = useCallback(
//     (id) => {
//       navigate(`/sellerdashboard/messages/inquirydetail/${id}`);
//     },
//     [navigate]
//   );

//   // Handle delete
//   const handleDelete = useCallback(() => {
//     if (selectedInquiries.length === 0) {
//       alert("Please select inquiries to delete");
//       return;
//     }
//     // if (window.confirm(`Delete ${selectedInquiries.length} inquiries?`)) {
//     //   // Dispatch delete action here
//     //   console.log("Deleting:", selectedInquiries);
//     //   setSelectedInquiries([]);
//     // }
//     setDeleteDialogOpen(true);
//   }, [selectedInquiries]);

//   // Handle report spam
//   const handleReportSpam = useCallback(() => {
//     if (selectedInquiries.length === 0) {
//       alert("Please select inquiries to report");
//       return;
//     }
//     // if (
//     //   window.confirm(`Report ${selectedInquiries.length} inquiries as spam?`)
//     // ) {
//     //   // Dispatch report spam action here
//     //   console.log("Reporting spam:", selectedInquiries);
//     //   setSelectedInquiries([]);
//     // }
//     setSpamDialogOpen(true);
//   }, [selectedInquiries]);

//   const confirmDelete = () => {
//     console.log("Deleting:", selectedInquiries);
//     setSelectedInquiries([]);
//   };

//   const confirmSpam = () => {
//     console.log("Reporting spam:", selectedInquiries);
//     setSelectedInquiries([]);
//   };

//   // Filter inquiries based on tab, status, and search
//   const filteredInquiries = inquiries.filter((inq) => {
//     // Tab filter
//     if (selectedTab !== "All") {
//       if (selectedTab === "Pending for reply" && inq.status !== "Pending")
//         return false;
//       if (selectedTab === "New inquiry" && inq.isNew !== true) return false;
//       if (selectedTab === "Order created" && !inq.orderId) return false;
//       // Add more tab filters as needed
//     }

//     // Status filter
//     if (statusFilter !== "All" && inq.status !== statusFilter) return false;

//     // Search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       const matchesId = inq._id?.toLowerCase().includes(query);
//       const matchesUsername = inq.userId?.username
//         ?.toLowerCase()
//         .includes(query);
//       const matchesMessage = inq.message?.toLowerCase().includes(query);
//       if (!matchesId && !matchesUsername && !matchesMessage) return false;
//     }

//     return true;
//   });

//   // Sort inquiries
//   const sortedInquiries = [...filteredInquiries].sort((a, b) => {
//     if (sortBy === "Latest") {
//       return new Date(b.updatedAt) - new Date(a.updatedAt);
//     }
//     if (sortBy === "Oldest") {
//       return new Date(a.updatedAt) - new Date(b.updatedAt);
//     }
//     return 0;
//   });

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-[1400px] mx-auto p-4 space-y-4">
//           {/* Header with reception data */}
//           <InquiryHeader />

//           {/* Main content card */}
//           <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//             {/* Filter tabs */}
//             <InquiryFilters
//               selectedTab={selectedTab}
//               onTabChange={setSelectedTab}
//               sortBy={sortBy}
//               onSortChange={setSortBy}
//               searchQuery={searchQuery}
//               onSearchChange={setSearchQuery}
//               counts={counts}
//             />

//             {/* Toolbar */}
//             <InquiryToolbar
//               selectedCount={selectedInquiries.length}
//               totalCount={filteredInquiries.length}
//               onSelectAll={handleSelectAll}
//               onDelete={handleDelete}
//               onReportSpam={handleReportSpam}
//               statusFilter={statusFilter}
//               onStatusFilterChange={setStatusFilter}
//             />

//             {/* Inquiry list */}
//             <div className="p-4">
//               {loading ? (
//                 <div className="space-y-2">
//                   {[...Array(5)].map((_, i) => (
//                     <InquirySkeleton key={i} />
//                   ))}
//                 </div>
//               ) : error ? (
//                 <div className="text-center py-12">
//                   <p className="text-red-500 mb-2">{error}</p>
//                   <button
//                     onClick={() => dispatch(fetchInquiries())}
//                     className="text-blue-600 hover:underline"
//                   >
//                     Try again
//                   </button>
//                 </div>
//               ) : sortedInquiries.length === 0 ? (
//                 <div className="text-center py-12">
//                   <p className="text-gray-600">
//                     {searchQuery || statusFilter !== "All"
//                       ? "No inquiries match your filters"
//                       : "No inquiries found"}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {sortedInquiries.map((inq) => (
//                     <InquiryItem
//                       key={inq._id}
//                       inquiry={inq}
//                       selected={selectedInquiries.includes(inq._id)}
//                       onSelect={handleSelectInquiry}
//                       onView={handleView}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Pagination (if needed) */}
//             {sortedInquiries.length > 0 && (
//               <div className="px-4 py-3 border-t border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-600">
//                     Showing {inquiries.length} of {total} inquiries
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/*Dialouge menu for delete and spam button = */}

//       <AlertDialogMenu
//         open={deleteDialogOpen}
//         onOpenChange={setDeleteDialogOpen}
//         title="Delete selected inquiries?"
//         description={`${selectedInquiries.length} inquiries will be moved to the Deleted section. They will be permanently removed after 30 days.`}
//         confirmText="Delete"
//         variant="danger"
//         onConfirm={() => {
//           setDeleteDialogOpen(false);
//           confirmDelete();
//         }}
//       />

//       <AlertDialogMenu
//         open={spamDialogOpen}
//         onOpenChange={setSpamDialogOpen}
//         title="Report as spam?"
//         description={`This will mark ${selectedInquiries.length} inquiries as spam.`}
//         confirmText="Report Spam"
//         onConfirm={() => {
//           setSpamDialogOpen(false);
//           confirmSpam();
//         }}
//       />
//     </>
//   );
// };

// export default Inquiry;

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchInquiries,
  performBulkInquiryAction,
  markInquiryAsViewed,
  optimisticallyMarkAsViewed,
} from "../../../../../redux/slice/inquirySlice";
import api from "@/utils/axios.utils";
import { saveAs } from "file-saver";
import InquiryHeader from "./InquiryHeader";
import InquiryFilters from "./InquiryFilters.jsx";
import InquiryToolbar from "./InquiryToolbar";
import InquiryItem from "./InquiryItem";
import InquirySkeleton from "./InquirySkeleton";
import { AlertDialogMenu } from "../../Helper/AlertDialogMenu";
import { toast } from "sonner";

const Inquiry = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [spamDialogOpen, setSpamDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inquiries = useSelector((state) => state.inquiries.list);
  const { loading, error, total, counts, bulkActionLoading } = useSelector(
    (state) => state.inquiries
  );

  // Local state for filters and selections
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Latest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  // --- REUSABLE FETCH FUNCTION ---
  const getInquiries = useCallback(() => {
    dispatch(
      fetchInquiries({
        page,
        limit,
        tab: selectedTab,
        statusTab: selectedTab, // Use selectedTab for both
        sortBy,
        q: searchQuery,
        showOnlyUnread,
      })
    );
  }, [dispatch, page, limit, selectedTab, sortBy, searchQuery, showOnlyUnread]);

  // Initial fetch and re-fetch on filter changes
  useEffect(() => {
    getInquiries();
  }, [getInquiries]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setSelectedInquiries([]); // Clear selections on filter change
  }, [selectedTab, searchQuery, sortBy, showOnlyUnread]);

  // --- REUSABLE BULK ACTION HANDLER ---
  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedInquiries.length === 0) {
        toast.error("Please select inquiries first.");
        return;
      }

      const result = await dispatch(
        performBulkInquiryAction({ action, ids: selectedInquiries })
      );

      if (performBulkInquiryAction.fulfilled.match(result)) {
        toast.success(`Action "${action}" completed successfully`);
        setSelectedInquiries([]);
        getInquiries();
      } else {
        toast.error(result.payload || "Action failed");
      }
    },
    [dispatch, selectedInquiries, getInquiries]
  );

  // --- Handlers for selection ---
  const handleSelectInquiry = useCallback((id) => {
    setSelectedInquiries((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        setSelectedInquiries(inquiries.map((inq) => inq._id));
      } else {
        setSelectedInquiries([]);
      }
    },
    [inquiries]
  );

  // --- Handler for viewing inquiry details ---
  const handleView = useCallback(
    async (id) => {
      // Optimistically update UI
      dispatch(optimisticallyMarkAsViewed(id));

      // Navigate to detail page
      navigate(`/sellerdashboard/messages/inquirydetail/${id}`);

      // Mark as viewed in background (non-blocking)
      try {
        await dispatch(markInquiryAsViewed(id));
      } catch (error) {
        console.error("Failed to mark inquiry as viewed:", error);
        // Optionally show a subtle notification, but don't block user
      }
    },
    [navigate, dispatch]
  );

  // Open dialogs
  const handleDelete = () => {
    if (selectedInquiries.length === 0) {
      toast.error("Please select inquiries to delete");
      return;
    }
    setDeleteDialogOpen(true);
  };

  const handleReportSpam = () => {
    if (selectedInquiries.length === 0) {
      toast.error("Please select inquiries to report as spam");
      return;
    }
    setSpamDialogOpen(true);
  };

  // Confirm actions from dialogs
  const confirmDelete = () => handleBulkAction("delete");
  const confirmSpam = () => handleBulkAction("mark_spam");

  // Handlers for "More" menu
  const handleMarkAsRead = () => handleBulkAction("mark_read");
  const handleMarkAsUnread = () => handleBulkAction("mark_unread");

  // Handler for export
  const handleExportSelected = async () => {
    if (selectedInquiries.length === 0) {
      toast.error("Please select inquiries to export");
      return;
    }

    try {
      toast.loading("Exporting inquiries...");

      const response = await api.post(
        "/inquiry/export",
        { ids: selectedInquiries },
        { responseType: "blob" }
      );

      saveAs(response.data, `inquiries_${Date.now()}.xlsx`);
      setSelectedInquiries([]);

      toast.dismiss();
      toast.success("Inquiries exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to export inquiries"
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1400px] mx-auto p-4 space-y-4">
          <InquiryHeader />

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <InquiryFilters
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              counts={counts}
            />

            <InquiryToolbar
              selectedCount={selectedInquiries.length}
              totalCount={inquiries.length}
              onSelectAll={handleSelectAll}
              onDelete={handleDelete}
              onReportSpam={handleReportSpam}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onExportSelected={handleExportSelected}
              showOnlyUnread={showOnlyUnread}
              onShowOnlyUnreadChange={setShowOnlyUnread}
              bulkActionLoading={bulkActionLoading}
            />

            <div className="p-4">
              {loading && inquiries.length === 0 ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <InquirySkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-2">{error}</p>
                  <button
                    onClick={getInquiries}
                    className="text-blue-600 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    {searchQuery || selectedTab !== "All"
                      ? "No inquiries match your filters"
                      : "No inquiries found"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {inquiries.map((inq) => (
                    <InquiryItem
                      key={inq._id}
                      inquiry={inq}
                      selected={selectedInquiries.includes(inq._id)}
                      onSelect={handleSelectInquiry}
                      onView={handleView}
                    />
                  ))}
                </div>
              )}
            </div>

            {inquiries.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {inquiries.length} of {total} inquiries
                  </p>
                  {/* TODO: Add pagination component */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialogMenu
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete selected inquiries?"
        description={`${selectedInquiries.length} inquiries will be moved to the Deleted section. They will be permanently removed after 30 days.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          setDeleteDialogOpen(false);
          confirmDelete();
        }}
      />

      <AlertDialogMenu
        open={spamDialogOpen}
        onOpenChange={setSpamDialogOpen}
        title="Report as spam?"
        description={`This will mark ${selectedInquiries.length} inquiries as spam.`}
        confirmText="Report Spam"
        onConfirm={() => {
          setSpamDialogOpen(false);
          confirmSpam();
        }}
      />
    </>
  );
};

export default Inquiry;
