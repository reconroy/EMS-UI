import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { FiSave, FiTrash2, FiEdit2, FiSearch, FiFilter, FiChevronUp, FiChevronDown, FiX } from 'react-icons/fi';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const ClearableInput = ({ value, onChange, placeholder, className, required = false }) => {
  const theme = useThemeStore((state) => state.theme);
  
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={className}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-gray-400 hover:text-gray-500'
          } transition-colors`}
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const Roles = () => {
  const theme = useThemeStore((state) => state.theme);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Dummy data for demonstration
  const data = useMemo(() => [
    { id: 1, name: 'Admin', description: 'Full system access', status: 'Active' },
    { id: 2, name: 'Manager', description: 'Department level access', status: 'Active' },
    { id: 3, name: 'Employee', description: 'Basic access', status: 'Active' },
  ], []);

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Role Name',
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: 'Description',
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
      header: 'Actions',
      enableSorting: false,
      cell: () => (
        <div className="flex justify-end gap-3">
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button className="text-red-400 hover:text-red-300 transition-colors">
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ], []);

  // Fuzzy search function
  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemValue = row.getValue(columnId);
    if (itemValue == null) {
      const rowValues = columns.map(col => 
        col.accessorKey ? row.getValue(col.accessorKey) : null
      );
      return rowValues.some(val => 
        val != null && 
        String(val).toLowerCase().includes(value.toLowerCase())
      );
    }
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

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ roleName, description, status: isActive ? 'Active' : 'Inactive' });
    // Reset form
    setRoleName('');
    setDescription('');
    setIsActive(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Roles Management
        </h1>
        <p className={`${subTextClass} mt-1`}>Create and manage user roles</p>
      </motion.div>

      {/* Add Role Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-6 ${cardClass}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roleName" className={`block mb-2 ${textClass}`}>
                Role Name <span className="text-red-500">*</span>
              </label>
              <ClearableInput
                value={roleName}
                onChange={setRoleName}
                placeholder="Enter role name"
                required
                className={`w-full px-4 pr-10 py-2 rounded-lg border ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="description" className={`block mb-2 ${textClass}`}>
                Description <span className={subTextClass}>(Optional)</span>
              </label>
              <ClearableInput
                value={description}
                onChange={setDescription}
                placeholder="Enter role description"
                className={`w-full px-4 pr-10 py-2 rounded-lg border ${inputClass}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className={`block ${textClass}`}>Status:</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-purple-300 after:border-purple-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600`}></div>
            </label>
            <span className={`text-sm ${textClass}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <FiSave className="w-5 h-5" />
              <span>Save Role</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Search and Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`border rounded-lg p-4 ${cardClass} space-y-4`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
            <ClearableInput
              value={globalFilter ?? ''}
              onChange={setGlobalFilter}
              placeholder="Search roles..."
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-purple-500/20' : 'border-gray-200'}`}>
                {table.getHeaderGroups().map(headerGroup => (
                  headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-6 py-4 text-left ${textClass} ${
                        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            {header.column.getIsSorted() === 'asc' ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <FiChevronDown className="w-4 h-4" />
                            ) : (
                              <div className="flex flex-col">
                                <FiChevronUp className="w-4 h-4 -mb-1.5 text-gray-400" />
                                <FiChevronDown className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))
                ))}
              </tr>
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

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className={`px-3 py-1.5 rounded-lg border ${
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
            <span className={textClass}>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`px-3 py-1.5 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-purple-900/20 border-purple-500/20 text-purple-100'
                  : 'bg-white border-gray-200 text-gray-900'
              } disabled:opacity-50`}
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`px-3 py-1.5 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-purple-900/20 border-purple-500/20 text-purple-100'
                  : 'bg-white border-gray-200 text-gray-900'
              } disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Roles;