import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import Notification from '../../../components/Notification';
import { 
  FiSave, 
  FiEdit2, 
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiX 
} from 'react-icons/fi';
import API from '../../../services/api';
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
        className={`transition-colors duration-200 ${className}`}
      />
    </div>
  );
};

const Department = () => {
  const theme = useThemeStore((state) => state.theme);
  const [deptName, setDeptName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [editingDept, setEditingDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalDeptName, setOriginalDeptName] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    message: '',
  });

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  // Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await API.get('/Departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      showNotification('error', 'Failed to fetch departments. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validate department name
    if (!deptName.trim()) {
      showNotification('warning', 'Please enter a department name');
      return;
    }

    if (!editingDept) {
      try {
        setLoading(true);
        showNotification('processing', `Creating new department ${deptName}...`);
        await API.post('/Departments', {
          deptID: 0,
          deptName: deptName
        });
        await fetchDepartments();
        setDeptName('');
        showNotification('success', `Department ${deptName} created successfully!`);
      } catch (error) {
        console.error('Error creating department:', error);
        showNotification('error', `Failed to create  ${deptName}  department. Please try again.`);
      } finally {
        setLoading(false);
      }
    } else {
      // Don't make API call if name hasn't changed
      if (deptName === originalDeptName) {
        setEditingDept(null);
        setDeptName('');
        setOriginalDeptName('');
        return;
      }

      try {
        setLoading(true);
        showNotification('processing', `Updating department ${deptName}...`);
        await API.put(`/Departments/${editingDept.deptID}`, {
          deptID: editingDept.deptID,
          deptName: deptName
        });
        await fetchDepartments();
        setDeptName('');
        setEditingDept(null);
        setOriginalDeptName('');
        showNotification('success', `Department ${deptName} updated successfully!`);
      } catch (error) {
        console.error('Error updating department:', error);
        showNotification('error', `Failed to update ${deptName} department. Please try again.`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setDeptName(dept.deptName);
    setOriginalDeptName(dept.deptName);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'deptID',
      header: 'Department ID',
      enableSorting: true,
    },
    {
      accessorKey: 'deptName',
      header: 'Department Name',
      enableSorting: true,
      cell: ({ row }) => {
        const isEditing = editingDept?.deptID === row.original.deptID;
        return isEditing ? (
          <input
            type="text"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            className={`w-full px-2 py-1 rounded border ${
              theme === 'dark' 
                ? 'bg-purple-900/20 border-purple-500/20 text-purple-100' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
            autoFocus
          />
        ) : (
          <span>{row.original.deptName}</span>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => {
        const isEditing = editingDept?.deptID === row.original.deptID;
        const hasChanged = deptName !== originalDeptName;

        return (
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                {hasChanged && (
                  <button 
                    onClick={handleSubmit}
                    className={theme === 'dark' ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-500"}
                  >
                    <FiSave className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setEditingDept(null);
                    setDeptName('');
                    setOriginalDeptName('');
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleEdit(row.original)}
                className={theme === 'dark' ? "text-purple-400 hover:text-purple-300" : "text-blue-400 hover:text-blue-300"}
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      },
    },
  ], [theme, editingDept, deptName, originalDeptName]);

  const table = useReactTable({
    data: departments,
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
  });

  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-sm';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  const subTextClass = theme === 'dark'
    ? 'text-purple-300'
    : 'text-blue-500';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
    : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-3xl font-bold ${theme === 'dark'
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'
          : 'text-blue-700'
          }`}>
          Department Management
        </h1>
        <p className={`${subTextClass} mt-1`}>Create and manage departments</p>
      </motion.div>

      {/* Add Department Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-6 ${cardClass}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="deptName" className={`block mb-2 ${textClass}`}>
              Department Name <span className="text-red-500">*</span>
            </label>
            <ClearableInput
              value={deptName}
              onChange={setDeptName}
              placeholder="Enter department name"
              required
              className={`w-full px-4 pr-10 py-2 rounded-lg border ${inputClass}`}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${buttonClass} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiSave className="w-5 h-5" />
              <span>Save Department</span>
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
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-purple-400' : 'text-blue-400'}`} />
            <ClearableInput
              value={globalFilter ?? ''}
              onChange={setGlobalFilter}
              placeholder="Search departments..."
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${theme === 'dark'
                ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
                : 'bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400'
              }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-purple-500/20' : 'border-blue-200'}`}>
                {table.getHeaderGroups().map(headerGroup => (
                  headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-6 py-4 text-left ${textClass} ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
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
                        : 'bg-blue-50'
                      : theme === 'dark'
                        ? 'bg-transparent'
                        : 'bg-white'
                    }
                    hover:${theme === 'dark' ? 'bg-purple-900/20' : 'bg-blue-100'} 
                    transition-colors
                    ${theme === 'dark' ? 'border-purple-500/20' : 'border-blue-200'}
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
              className={`px-3 py-1.5 rounded-lg border ${theme === 'dark'
                ? 'bg-purple-900/20 border-purple-500/20 text-purple-100'
                : 'bg-blue-50 border-blue-200 text-blue-900'
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
              className={`px-3 py-1.5 rounded-lg border ${theme === 'dark'
                ? 'bg-purple-900/20 border-purple-500/20 text-purple-100'
                : 'bg-blue-50 border-blue-200 text-blue-900'
                } disabled:opacity-50`}
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`px-3 py-1.5 rounded-lg border ${theme === 'dark'
                ? 'bg-purple-900/20 border-purple-500/20 text-purple-100'
                : 'bg-blue-50 border-blue-200 text-blue-900'
                } disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Add Notification component */}
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        position="top-right"
        autoClose={5000}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default Department;