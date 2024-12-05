import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../../../store/themeStore';
import { FiArrowRight } from 'react-icons/fi';
import API from '../../../../services/api';

const BankDetails = ({ formData, setFormData, onNext, onPrevious }) => {
  const theme = useThemeStore((state) => state.theme);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch banks on component mount
  useEffect(() => {
    fetchBanks();
    // Load saved bank details from localStorage
    const savedBankDetails = localStorage.getItem('empBankDetails');
    if (savedBankDetails) {
      const parsedDetails = JSON.parse(savedBankDetails);
      setFormData(prev => ({
        ...prev,
        ...parsedDetails
      }));
    }
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await API.get('/Banks');
      // Filter only active banks
      const activeBanks = response.data.filter(bank => bank.isActive);
      setBanks(activeBanks);
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };

    // If bankName is changed, update bankId as well
    if (name === 'bankName') {
      const selectedBank = banks.find(bank => bank.bankName === value);
      updatedFormData.bankId = selectedBank ? selectedBank.bankId : '';
    }

    setFormData(updatedFormData);
    
    // Save to localStorage
    localStorage.setItem('empBankDetails', JSON.stringify({
      bankId: updatedFormData.bankId || '',
      bankName: updatedFormData.bankName || '',
      branchName: updatedFormData.branchName || '',
      accountNo: updatedFormData.accountNo || '',
      ifscCode: updatedFormData.ifscCode || ''
    }));
  };

  const handleNext = () => {
    // Validate required fields if needed
    onNext();
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
          <select
            id="bankName"
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 ${
              theme === 'light' 
                ? 'border-gray-300 bg-white text-gray-900' 
                : 'border-gray-600 bg-gray-800 text-white'
            }`}
          >
            <option value="">Select Bank</option>
            {banks.map((bank) => (
              <option key={bank.bankId} value={bank.bankName}>
                {bank.bankName}
              </option>
            ))}
          </select>
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
        <button 
          type="button" 
          onClick={onPrevious} 
          className={`px-4 py-2 rounded-lg ${
            theme === 'light' ? 'bg-gray-300 text-gray-500' : 'bg-gray-700 text-gray-400'
          }`}
        >
          Previous
        </button>
        <button 
          type="button" 
          onClick={handleNext} 
          className={`px-4 py-2 rounded-lg ${
            theme === 'light' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {formData.bankName ? 'Next' : 'Skip'}
        </button>
      </div>
    </form>
  );
};

export default BankDetails;
