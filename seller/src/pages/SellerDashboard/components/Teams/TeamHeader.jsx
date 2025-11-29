// src/pages/sellerdashboard/team/TeamHeader.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";

/**
 * TeamHeader
 * - debounce search locally and then call setQuery (prevents expensive filters on every keystroke)
 * - accessible controls and responsive layout
 *
 * Props:
 *  - query (string)          : current query (kept in sync but local input used for debouncing)
 *  - setQuery (fn)          : setter in parent
 *  - filterRole (string)    : currently selected role filter
 *  - setFilterRole (fn)     : setter in parent
 *  - roleOptions (array)    : array of roles (['All', 'Member', ...])
 *  - setPage (fn)           : set page (resets to 1 on search/filter)
 *  - openAddModal (fn)      : open the add-member modal
 */
function TeamHeader({
  query,
  setQuery,
  filterRole,
  setFilterRole,
  roleOptions = [],
  setPage,
  openAddModal,
}) {
  // local controlled input for snappy typing + debounce
  const [localQuery, setLocalQuery] = useState(query || "");

  // keep localQuery in sync if parent query changes (rare but safe)
  useEffect(() => {
    setLocalQuery(query || "");
  }, [query]);

  // basic debounce implementation (300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      // only update parent if changed
      if ((query || "") !== (localQuery || "")) {
        setQuery(localQuery);
        setPage && setPage(1);
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQuery]);

  const onChangeRole = useCallback(
    (e) => {
      setFilterRole(e.target.value);
      setPage && setPage(1);
    },
    [setFilterRole, setPage]
  );

  const onClearSearch = useCallback(() => {
    setLocalQuery("");
    setQuery("");
    setPage && setPage(1);
  }, [setQuery, setPage]);

  const roleOptionsMemo = useMemo(() => roleOptions || [], [roleOptions]);

 return (
    <div className="flex flex-col gap-4 mb-6">

      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Team</h2>
      </div>

      {/* CONTROLS — Mobile stacked, Desktop inline */}
    {/* CONTROLS */}
<div className="
    w-full 
    flex flex-col gap-3
    sm:flex-row 
    sm:items-center 
    sm:justify-between
">

  {/* LEFT SIDE → SEARCH */}
  <div className="relative w-full sm:w-64 md:w-72">
    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </span>

    <input
      id="team-search"
      type="search"
      value={localQuery}
      onChange={(e) => setLocalQuery(e.target.value)}
      placeholder="Search..."
      className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:border-navyblue"
    />

    {localQuery && (
      <button
        type="button"
        onClick={onClearSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600"
      >
        Clear
      </button>
    )}
  </div>

  {/* RIGHT SIDE → ROLE + ADD MEMBER */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:ml-auto">
    <select
      id="role-filter"
      value={filterRole}
      onChange={onChangeRole}
      className="px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:border-navyblue"
    >
      {roleOptionsMemo.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>

    <button
      onClick={openAddModal}
      className="px-4 py-2 rounded-full bg-navyblue text-white border border-navyblue hover:bg-white hover:text-navyblue transition flex items-center justify-center gap-2"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      Add Member
    </button>
  </div>
</div>

    </div>
  );
}

export default React.memo(TeamHeader);
