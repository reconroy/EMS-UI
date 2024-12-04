import { useState, useEffect, useMemo } from 'react';
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
  FiChevronRight,
  FiX
} from 'react-icons/fi';
import API, { endpoints } from '../../../services/api';
import EmployeeDetailsModal from '../../../components/Modals/EmployeeDetailsModal';
import * as XLSX from 'xlsx';

const AllEmployee = () => {
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await API.get(endpoints.employees.list);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (data, key) => {
    return [...new Set(data.map(item => item[key]))].sort();
  };

  const data = useMemo(() => employees, [employees]);
  
  const departments = useMemo(() => getUniqueValues(data, 'departmentID'), [data]);
  const roles = useMemo(() => getUniqueValues(data, 'roleID'), [data]);
  const locations = useMemo(() => getUniqueValues(data, 'workingLocation'), [data]);
  const statuses = useMemo(() => ['Active', 'Inactive'], []);

  const columns = useMemo(() => [
    {
      id: 'serialNumber',
      header: 'S.No',
      enableSorting: false,
      cell: ({ row }) => {
        const pageSize = table.getState().pagination.pageSize;
        const pageIndex = table.getState().pagination.pageIndex;
        return pageIndex * pageSize + row.index + 1;
      },
    },
    {
      accessorKey: 'empID',
      header: 'Employee ID',
      enableSorting: true,
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'departmentID',
      header: 'Department',
      enableSorting: true,
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      enableSorting: true,
    },
    {
      accessorKey: 'workingLocation',
      header: 'Location',
      enableSorting: true,
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          row.original.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-3">
          <button className={`${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-400 hover:text-blue-300'} transition-colors`}>
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button className="text-red-400 hover:text-red-300 transition-colors">
            <FiTrash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleViewDetails(row.original)}
            className={`${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-400 hover:text-blue-300'} transition-colors`}
          >
            <FiMoreVertical className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ], [theme]);

  // Enhanced fuzzy search function
  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Get the value of the current cell
    const itemValue = row.getValue(columnId);
    
    // If the cell has no value, check other cells in the row
    if (itemValue == null) {
      // Search through all column values in this row
      const rowValues = columns.map(col => 
        col.accessorKey ? row.getValue(col.accessorKey) : null
      );
      return rowValues.some(val => 
        val != null && 
        String(val).toLowerCase().includes(value.toLowerCase())
      );
    }
    
    // Convert both the search value and cell value to lowercase for case-insensitive comparison
    const searchValue = value.toLowerCase();
    const itemString = String(itemValue).toLowerCase();
    
    // Check if the cell value includes the search term
    return itemString.includes(searchValue);
  };

  const FilterDropdown = ({ column, options, label }) => {
    const currentFilter = columnFilters.find(f => f.id === column)?.value || '';
    
    return (
      <div className="flex flex-col gap-1">
        <label className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {label}
        </label>
        <select
          value={currentFilter}
          onChange={e => {
            const value = e.target.value;
            if (value === '') {
              setColumnFilters(prev => prev.filter(f => f.id !== column));
            } else {
              setColumnFilters(prev => {
                const existing = prev.find(f => f.id === column);
                if (existing) {
                  return prev.map(f => f.id === column ? { ...f, value } : f);
                }
                return [...prev, { id: column, value }];
              });
            }
          }}
          className={`px-3 py-1.5 rounded-lg border ${
            theme === 'dark'
              ? 'bg-purple-900/20 border-purple-500/20 text-purple-100'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
          style={{
            colorScheme: theme === 'dark' ? 'dark' : 'light'
          }}
        >
          <option 
            value="" 
            className={theme === 'dark' ? 'bg-gray-800 text-purple-100' : 'bg-white text-gray-900'}
          >
            All {label}s
          </option>
          {options.map(option => (
            <option 
              key={option} 
              value={option}
              className={theme === 'dark' ? 'bg-gray-800 text-purple-100' : 'bg-white text-gray-900'}
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: fuzzyFilter,
    enableGlobalFilter: true,
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
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  const secondaryButtonClass = theme === 'dark'
    ? 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-300'
    : 'bg-blue-50 hover:bg-blue-100 text-blue-600';

  const handleExport = () => {
    // Prepare the data for export (excluding the actions column)
    const exportData = data.map(item => ({
      'Employee ID': item.id,
      'Name': item.name,
      'Department': item.department,
      'Designation': item.designation,
      'Location': item.location,
      'Status': item.status
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Employee ID
      { wch: 20 }, // Name
      { wch: 15 }, // Department
      { wch: 20 }, // Designation
      { wch: 15 }, // Location
      { wch: 10 }  // Status
    ];
    ws['!cols'] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');

    // Generate file name with current date
    const date = new Date().toISOString().split('T')[0];
    const fileName = `employees_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  const handleExportToExcel = () => {
    try {
      // Transform the data to include all fields
      const exportData = employees.map(emp => ({
        'Employee ID': emp.empID,
        'Full Name': emp.fullName,
        'Nick Name': emp.nickName,
        'Father Name': emp.fatherName,
        'Mother Name': emp.motherName,
        'Marital Status': emp.maritalStatus,
        'Qualification': emp.qualification,
        'Email': emp.email,
        'Primary Mobile': emp.mobile1,
        'Secondary Mobile': emp.mobile2,
        'Permanent Address': emp.pAddress,
        'Permanent Pin Code': emp.pPinCode,
        'Permanent District': emp.pDistrict,
        'Current Address': emp.cAddress,
        'Current Pin Code': emp.cPinCode,
        'Current District': emp.cDistrict,
        'Date of Birth': new Date(emp.dob).toLocaleDateString(),
        'Date of Joining': new Date(emp.doj).toLocaleDateString(),
        'Gender': emp.gender,
        'Department ID': emp.departmentID,
        'Role ID': emp.roleID,
        'Designation': emp.designation,
        'Aadhaar Number': emp.aadhaarNumber,
        'PAN Number': emp.panNumber,
        'Status': emp.isActive ? 'Active' : 'Inactive',
        'Working Location': emp.workingLocation
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');

      // Generate file name with current date
      const fileName = `Employees_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save the file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      // Add error handling (toast notification, etc.)
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-pink-400' : 'from-blue-400 to-blue-600'}`}>
            Employee Management
          </h1>
          <p className={`${subTextClass} mt-1`}>Manage and view all employee records</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/masters/employee/add')}
          className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${theme === 'dark' ? buttonClass : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'}`}
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
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-purple-400' : 'text-blue-400'}`} />
              <input
                type="text"
                placeholder="Search employees..."
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter('')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-400 hover:text-blue-500'
                  } transition-colors`}
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}
            >
              <FiFilter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button 
              onClick={handleExport}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}
            >
              <FiDownload className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}>
              <FiUpload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
        </div>

        {/* Column Filters */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <FilterDropdown 
              column="department"
              options={departments}
              label="Department"
            />
            <FilterDropdown 
              column="designation"
              options={designations}
              label="Designation"
            />
            <FilterDropdown 
              column="location"
              options={locations}
              label="Location"
            />
            <FilterDropdown 
              column="status"
              options={statuses}
              label="Status"
            />
          </motion.div>
        )}
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
                        : 'bg-blue-50'
                      : theme === 'dark'
                        ? 'bg-transparent'
                        : 'bg-white'
                    }
                    hover:${theme === 'dark' ? 'bg-purple-900/20' : 'bg-blue-100'} 
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

      {/* Add the modal */}
      {showDetailsModal && selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default AllEmployee;