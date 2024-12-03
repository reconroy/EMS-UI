import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiDownload,
  FiUpload,
  FiMoreVertical,
  FiChevronDown,
  FiChevronUp,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import employeeData from '../../../data/dummyEmployees.json';

const AllEmployee = () => {
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Replace the data constant with:
  const data = useMemo(() => employeeData.employees, []);

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'Employee ID',
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      enableSorting: true,
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      enableSorting: true,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          row.original.status === 'Active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <div className="flex justify-end gap-3">
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button className="text-red-400 hover:text-red-300 transition-colors">
            <FiTrash2 className="w-5 h-5" />
          </button>
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            <FiMoreVertical className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ], []);

  // Fuzzy search function
  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemValue = row.getValue(columnId);
    if (itemValue == null) return false;
    
    const searchValue = value.toLowerCase();
    const itemString = String(itemValue).toLowerCase();
    
    return itemString.includes(searchValue);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: fuzzyFilter,
    // Enable filtering for all columns
    columns: columns.map(column => ({
      ...column,
      enableGlobalFilter: true,
    })),
  });

  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-gray-200 shadow-lg';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-gray-900';

  const subTextClass = theme === 'dark'
    ? 'text-purple-300'
    : 'text-gray-600';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-purple-600 hover:bg-purple-700 text-white';

  const secondaryButtonClass = theme === 'dark'
    ? 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-300'
    : 'bg-purple-50 hover:bg-purple-100 text-purple-600';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Employee Management
          </h1>
          <p className={`${subTextClass} mt-1`}>Manage and view all employee records</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/masters/employee/add')}
          className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${buttonClass}`}
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Employee</span>
        </motion.button>
      </div>

      {/* Filters and Search Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`border rounded-lg p-4 ${cardClass} space-y-4`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}>
              <FiFilter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}>
              <FiDownload className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}>
              <FiUpload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg ${cardClass} overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className={`border-b ${theme === 'dark' ? 'border-purple-500/20' : 'border-gray-200'}`}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id}
                      className={`px-6 py-4 text-left ${textClass}`}
                    >
                      {header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-2"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <FiChevronUp className="w-4 h-4" />,
                            desc: <FiChevronDown className="w-4 h-4" />,
                          }[header.column.getIsSorted()] ?? null}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`
                    border-b last:border-b-0 
                    ${index % 2 === 0 
                      ? theme === 'dark' 
                        ? 'bg-purple-900/10' 
                        : 'bg-gray-100'
                      : theme === 'dark'
                        ? 'bg-transparent'
                        : 'bg-white'
                    }
                    hover:${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'} 
                    transition-colors
                    ${theme === 'dark' ? 'border-purple-500/20' : 'border-gray-200'}
                  `}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={`px-6 py-4 ${textClass}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className={`px-3 py-1 rounded border ${
                theme === 'dark'
                  ? 'bg-purple-900/20 border-purple-500/20 text-purple-100'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className={subTextClass}>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={`p-1 ${!table.getCanPreviousPage() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiChevronsLeft className={`w-5 h-5 ${textClass}`} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`p-1 ${!table.getCanPreviousPage() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiChevronLeft className={`w-5 h-5 ${textClass}`} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`p-1 ${!table.getCanNextPage() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiChevronRight className={`w-5 h-5 ${textClass}`} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className={`p-1 ${!table.getCanNextPage() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiChevronsRight className={`w-5 h-5 ${textClass}`} />
            </button>

            {/* Quick Jump */}
            <span className="flex items-center gap-2">
              <span className={subTextClass}>Go to</span>
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className={`w-16 px-2 py-1 rounded border ${
                  theme === 'dark'
                    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AllEmployee; 