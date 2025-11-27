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
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Team</h2>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Search */}
        <label htmlFor="team-search" className="sr-only">
          Search team members
        </label>
        <div className="relative flex-1 md:flex-none">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* simple search icon */}
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
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
            className="w-full md:w-72 pl-9 pr-10 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-navyblue text-sm"
            aria-label="Search team members"
          />

          {localQuery ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={onClearSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-gray-600 text-xs"
            >
              Clear
            </button>
          ) : null}
        </div>

        {/* Role filter */}
        <label htmlFor="role-filter" className="sr-only">
          Filter by role
        </label>
        <select
          id="role-filter"
          value={filterRole}
          onChange={onChangeRole}
          className="px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none  focus:border-navyblue"
          aria-label="Filter by role"
        >
          {roleOptionsMemo.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Add member */}
        <button
          type="button"
          onClick={openAddModal}
          className="ml-1 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-navyblue text-white hover:bg-white hover:text-navyblue border border-navyblue transition focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Add member"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden md:inline">Member</span>
          <span className="md:hidden">+ Member</span>
        </button>
      </div>
    </div>
  );
}

export default React.memo(TeamHeader);
