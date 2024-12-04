import React from 'react';
import { useThemeStore } from '../../../../store/themeStore';
import { FiArrowRight } from 'react-icons/fi';

const BankDetails = ({ formData, setFormData, onNext, onPrevious }) => {
  const theme = useThemeStore((state) => state.theme);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="space-y-8">
      <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
        Bank Details
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="bankName" className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
            Bank Name
          </label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="branchName" className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
            Branch Name
          </label>
          <input
            type="text"
            id="branchName"
            name="branchName"
            value={formData.branchName || ''}
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="accountNo" className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
            Account Number
          </label>
          <input
            type="text"
            id="accountNo"
            name="accountNo"
            value={formData.accountNo || ''}
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="ifscCode" className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
            IFSC Code
          </label>
          <input
            type="text"
            id="ifscCode"
            name="ifscCode"
            value={formData.ifscCode || ''}
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onPrevious} className={`px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-gray-300 text-gray-500' : 'bg-gray-700 text-gray-400'}`}>
          Previous
        </button>
        <button type="button" onClick={onNext} className={`px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
          Skip
        </button>
      </div>
    </form>
  );
};

export default BankDetails;
