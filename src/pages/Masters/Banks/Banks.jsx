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

const Banks = () => {
  const theme = useThemeStore((state) => state.theme);
  const [bankName, setBankName] = useState('');
  const [banks, setBanks] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [editingBank, setEditingBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalBankName, setOriginalBankName] = useState('');
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

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await API.get('/Banks');
      setBanks(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
      showNotification('error', 'Failed to fetch banks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!bankName.trim()) {
      showNotification('warning', 'Please enter a bank name');
      return;
    }

    try {
      setLoading(true);
      if (editingBank) {
        const updatedBank = { ...editingBank, bankName };
        await API.put(`/Banks/${editingBank.bankId}`, updatedBank);
        setBanks(prevBanks => prevBanks.map(b => 
          b.bankId === editingBank.bankId ? updatedBank : b
        ));
        showNotification('success', 'Bank updated successfully!');
      } else {
        const response = await API.post('/Banks', { bankName });
        setBanks(prevBanks => [...prevBanks, response.data]);
        showNotification('success', 'Bank created successfully!');
      }
      
      setBankName('');
      setEditingBank(null);
      setOriginalBankName('');
    } catch (error) {
      console.error('Error saving bank:', error);
      const errorMessage = error.response?.data || 'Failed to save bank. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleBankStatus = async (bank) => {
    try {
      const updatedBank = { ...bank, isActive: !bank.isActive };
      await API.put(`/Banks/${bank.bankId}`, updatedBank);
      setBanks(prevBanks => prevBanks.map(b => 
        b.bankId === bank.bankId ? updatedBank : b
      ));
      showNotification('success', `Bank ${updatedBank.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating bank status:', error);
      showNotification('error', 'Failed to update bank status. Please try again.');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'bankId',
      header: 'Bank ID',
      enableSorting: true,
    },
    {
      accessorKey: 'bankName',
      header: 'Bank Name',
      enableSorting: true,
      cell: ({ row }) => {
        const isEditing = editingBank?.bankId === row.original.bankId;
        return isEditing ? (
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className={`w-full px-2 py-1 rounded border ${
              theme === 'dark' 
                ? 'bg-purple-900/20 border-purple-500/20 text-purple-100' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
            autoFocus
          />
        ) : (
          <span>{row.original.bankName}</span>
        );
      }
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isEditing = editingBank?.bankId === row.original.bankId;
        return (
          <div className="flex items-center justify-center">
            <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
              <input
                type="checkbox"
                checked={row.original.isActive}
                onChange={() => {
                  if (isEditing) {
                    const updatedBank = { ...row.original, isActive: !row.original.isActive };
                    setBanks(prevBanks => prevBanks.map(b => 
                      b.bankId === row.original.bankId ? updatedBank : b
                    ));
                  }
                }}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
                peer-checked:after:translate-x-full peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all 
                ${!isEditing && 'opacity-60'}
                ${theme === 'dark' 
                  ? 'bg-gray-700 peer-checked:bg-purple-600' 
                  : 'bg-gray-200 peer-checked:bg-blue-600'
                }`}>
              </div>
            </label>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const isEditing = editingBank?.bankId === row.original.bankId;
        const hasNameChanged = bankName !== originalBankName;
        const hasStatusChanged = row.original.isActive !== editingBank?.isActive;

        return (
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                {(hasNameChanged || hasStatusChanged) && (
                  <button 
                    onClick={async () => {
                      try {
                        const updatedBank = { 
                          ...row.original,
                          bankName: bankName,
                        };
                        await API.put(`/Banks/${row.original.bankId}`, updatedBank);
                        setBanks(prevBanks => prevBanks.map(b => 
                          b.bankId === row.original.bankId ? updatedBank : b
                        ));
                        showNotification('success', 'Bank updated successfully!');
                        setEditingBank(null);
                        setBankName('');
                        setOriginalBankName('');
                      } catch (error) {
                        console.error('Error updating bank:', error);
                        showNotification('error', 'Failed to update bank. Please try again.');
                      }
                    }}
                    className={theme === 'dark' ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-500"}
                  >
                    <FiSave className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setEditingBank(null);
                    setBankName('');
                    setOriginalBankName('');
                    // Revert any status changes
                    setBanks(prevBanks => prevBanks.map(b => 
                      b.bankId === row.original.bankId ? editingBank : b
                    ));
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setEditingBank(row.original);
                  setBankName(row.original.bankName);
                  setOriginalBankName(row.original.bankName);
                }}
                className={theme === 'dark' ? "text-purple-400 hover:text-purple-300" : "text-blue-400 hover:text-blue-300"}
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      },
    },
  ], [theme, editingBank, bankName, originalBankName, setBanks]);

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemValue = row.getValue(columnId);
    if (itemValue == null) return false;
    
    const searchValue = value.toLowerCase();
    const itemString = String(itemValue).toLowerCase();
    
    return itemString.includes(searchValue);
  };

  const table = useReactTable({
    data: banks,
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
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: 'fuzzy',
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-3xl font-bold ${theme === 'dark'
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'
          : 'text-blue-700'
          }`}>
          Bank Management
        </h1>
        <p className={`${subTextClass} mt-1`}>Create and manage banks</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-6 ${cardClass}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bankName" className={`block mb-2 ${textClass}`}>
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
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
              <span>Save Bank</span>
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`border rounded-lg p-4 ${cardClass} space-y-4`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-blue-400'
            }`} />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search banks..."
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                theme === 'dark'
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

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className={`px-3 py-1.5 rounded-lg border ${theme === 'dark'
                ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 [&>option]:bg-purple-900'
                : 'bg-blue-50 border-blue-200 text-blue-900 [&>option]:bg-white'
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

export default Banks;