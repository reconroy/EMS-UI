import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
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
import Notification from '../../../components/Notification';

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

const Location = () => {
  const theme = useThemeStore((state) => state.theme);
  const [locationName, setLocationName] = useState('');
  const [locations, setLocations] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [editingLocation, setEditingLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalLocationName, setOriginalLocationName] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    message: ''
  });

  // Fetch locations
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      showNotification('processing', 'Fetching locations...');
      const response = await API.get('/Locations');
      setLocations(response.data);
      setNotification({ show: false, type: 'success', message: '' });
    } catch (error) {
      showNotification('error', 'Failed to fetch locations');
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    const validTypes = ['success', 'error', 'warning', 'processing'];
    const notificationType = validTypes.includes(type) ? type : 'error';
    
    setNotification({
      show: true,
      type: notificationType,
      message
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!editingLocation) {
      try {
        setLoading(true);
        await API.post('/Locations', {
          locationID: 0,
          locationName: locationName
        });
        await fetchLocations();
        setLocationName('');
        showNotification('success', 'Location created successfully');
      } catch (error) {
        showNotification('error', 'Failed to create location');
        console.error('Error creating location:', error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await API.put(`/Locations/${editingLocation.locationID}`, {
          locationID: editingLocation.locationID,
          locationName: locationName
        });
        await fetchLocations();
        setLocationName('');
        setEditingLocation(null);
        setOriginalLocationName('');
        showNotification('success', 'Location updated successfully');
      } catch (error) {
        showNotification('error', 'Failed to update location');
        console.error('Error updating location:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setLocationName(location.locationName);
    setOriginalLocationName(location.locationName);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'locationID',
      header: 'Location ID',
      enableSorting: true,
    },
    {
      accessorKey: 'locationName',
      header: 'Location Name',
      enableSorting: true,
      cell: ({ row }) => {
        const isEditing = editingLocation?.locationID === row.original.locationID;
        return isEditing ? (
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className={`w-full px-2 py-1 rounded border ${
              theme === 'dark' 
                ? 'bg-purple-900/20 border-purple-500/20 text-purple-100' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
            autoFocus
          />
        ) : (
          <span>{row.original.locationName}</span>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => {
        const isEditing = editingLocation?.locationID === row.original.locationID;
        const hasChanged = locationName !== originalLocationName;

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
                    setEditingLocation(null);
                    setLocationName('');
                    setOriginalLocationName('');
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
  ], [theme, editingLocation, locationName, originalLocationName]);

  const table = useReactTable({
    data: locations,
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
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-3xl font-bold ${theme === 'dark'
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'
          : 'text-blue-700'
          }`}>
          Location Management
        </h1>
        <p className={`${subTextClass} mt-1`}>Create and manage locations</p>
      </motion.div>

      {/* Add Location Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-6 ${cardClass}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="locationName" className={`block mb-2 ${textClass}`}>
              Location Name <span className="text-red-500">*</span>
            </label>
            <ClearableInput
              value={locationName}
              onChange={setLocationName}
              placeholder="Enter location name"
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
              <span>Save Location</span>
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
              placeholder="Search locations..."
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
    </div>
  );
};

export default Location;