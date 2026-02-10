import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Country } from 'country-state-city';

// Icons
const SearchIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const MoreVertical = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const SellerTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    const countries = Country.getAllCountries().map(country => ({
      name: country.name,
      isoCode: country.isoCode,
      flag: country.flag
    }));
    setAllCountries(countries);
  }, []);

  const getCountryFlag = (countryName) => {
    const country = allCountries.find(c => c.name === countryName);
    return country?.flag || '🌍';
  };

  const getCountryCode = (countryName) => {
    const country = allCountries.find(c => c.name === countryName);
    return country?.isoCode || '';
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.country.toLowerCase().includes(term) ||
        item.regNumber.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(item => item.status === statusFilter);
    }

    if (countryFilter !== "all") {
      result = result.filter(item => item.country === countryFilter);
    }

    return result;
  }, [data, searchTerm, statusFilter, countryFilter]);

  const allCountryOptions = useMemo(() => {
    const dataCountries = [...new Set(
      data.map(item => item.country?.trim()).filter(Boolean)
    )];
    
    const libraryCountries = allCountries.map(c => c.name.trim());
    const uniqueCountries = [...new Set([...dataCountries, ...libraryCountries])];
    
    return uniqueCountries.sort((a, b) => a.localeCompare(b));
  }, [data, allCountries]);

  const stats = useMemo(() => ({
    active: data.filter(s => s.status === "Active").length,
    pending: data.filter(s => s.status === "Pending").length,
    blocked: data.filter(s => s.status === "Blocked").length,
    total: data.length
  }), [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Seller",
        cell: ({ row }) => {
          const seller = row.original;
          const colors = [
            'from-violet-500 to-purple-600',
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-pink-500 to-rose-600',
          ];
          const colorIndex = seller.id % colors.length;
          
          return (
            <div className="flex items-center gap-3 py-1">
              <div className={`h-11 w-11 bg-gradient-to-br ${colors[colorIndex]} rounded-xl flex items-center justify-center text-white font-semibold shadow-sm`}>
                {seller.name?.charAt(0) || '?'}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{seller.name || 'Unknown'}</div>
                <div className="text-xs text-gray-500 font-mono">ID: {seller.id.toString().padStart(4, '0')}</div>
              </div>
            </div>
          );
        },
        size: 280,
      },
      {
        accessorKey: "country",
        header: "Location",
        cell: ({ row }) => {
          const seller = row.original;
          const countryFlag = getCountryFlag(seller.country);
          const countryCode = getCountryCode(seller.country);
          
          return (
            <div className="flex items-center gap-2.5">
              <div className="text-2xl">{countryFlag}</div>
              <div>
                <div className="text-sm font-medium text-gray-900">{seller.country}</div>
                <div className="text-xs text-gray-500 font-mono">{countryCode}</div>
              </div>
            </div>
          );
        },
        size: 180,
      },
      {
        accessorKey: "market",
        header: "Market",
        cell: () => (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
            <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></div>
            Global
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "regNumber",
        header: "Registration",
        cell: ({ row }) => {
          const seller = row.original;
          return (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-0.5">{seller.regType || 'REG'}</div>
              <div className="text-sm font-mono text-gray-900">{seller.regNumber || 'N/A'}</div>
            </div>
          );
        },
        size: 200,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const value = getValue();
          const statusConfig = {
            Active: { 
              bg: "bg-emerald-500", 
              text: "text-white",
              dot: "bg-white"
            },
            Pending: { 
              bg: "bg-amber-100", 
              text: "text-amber-800",
              dot: "bg-amber-500"
            },
            Blocked: { 
              bg: "bg-rose-100", 
              text: "text-rose-800",
              dot: "bg-rose-500"
            },
            Verified: { 
              bg: "bg-blue-500", 
              text: "text-white",
              dot: "bg-white"
            },
          };
          
          const config = statusConfig[value] || { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" };
          
          return (
            <div className="flex justify-start">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`}></span>
                {value}
              </span>
            </div>
          );
        },
        size: 120,
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <div className="flex items-center justify-end gap-1">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical />
            </button>
          </div>
        ),
        size: 60,
      },
    ],
    [allCountries]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sellers Directory</h1>
            <p className="text-sm text-gray-600">Manage and monitor all registered sellers</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
            <DownloadIcon />
            Export Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Live</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.active}</div>
            <div className="text-xs text-gray-600 font-medium">Active Sellers</div>
            <div className="absolute -bottom-2 -right-2 h-20 w-20 bg-emerald-50 rounded-full opacity-50"></div>
          </div>

          <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
              </div>
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Review</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</div>
            <div className="text-xs text-gray-600 font-medium">Pending Approval</div>
            <div className="absolute -bottom-2 -right-2 h-20 w-20 bg-amber-50 rounded-full opacity-50"></div>
          </div>

          <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <div className="h-2 w-2 bg-rose-500 rounded-full"></div>
              </div>
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Alert</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.blocked}</div>
            <div className="text-xs text-gray-600 font-medium">Blocked Accounts</div>
            <div className="absolute -bottom-2 -right-2 h-20 w-20 bg-rose-50 rounded-full opacity-50"></div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stats.total}</div>
            <div className="text-xs font-medium opacity-90">Total Registered</div>
            <div className="absolute -bottom-2 -right-2 h-20 w-20 bg-white/10 rounded-full"></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <SearchIcon />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, country or registration..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <FilterIcon />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-9 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FilterIcon />
              </div>
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="appearance-none w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700"
              >
                <option value="all">All Countries</option>
                {allCountryOptions.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-100">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50"
                      style={{ width: header.column.getSize() }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row, idx) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      className="px-6 py-4"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
                </span>{" "}
                of <span className="font-semibold text-gray-900">{table.getFilteredRowModel().rows.length}</span> sellers
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                  {table.getState().pagination.pageIndex + 1}
                </div>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerTable;