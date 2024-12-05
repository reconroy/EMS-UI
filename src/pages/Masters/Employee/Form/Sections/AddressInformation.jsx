import React from 'react';

const AddressInformation = ({ theme, formData, handleChange }) => {
  const getCurrentAddressValue = (currentFieldName) => {
    if (formData.isSameAsPermanent) {
      const permanentFieldName = currentFieldName.replace('c', 'p');
      return formData[permanentFieldName] || '';
    }
    return formData[currentFieldName] || '';
  };

  return (
    <div className="space-y-4">
      <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
        Address Information
      </h4>
      
      {/* Permanent Address */}
      <div>
        <h5 className={`text-md font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
          Permanent Address
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Address', name: 'pAddress', required: true },
            { label: 'Pin Code', name: 'pPinCode', required: true },
            { label: 'District', name: 'pDistrict', required: true }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                required={field.required}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Same as Permanent Address Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isSameAsPermanent"
          checked={formData.isSameAsPermanent || false}
          onChange={handleChange}
          className={`h-4 w-4 rounded border-gray-300 ${theme === 'dark' ? 'text-purple-600' : 'text-blue-600'}`}
        />
        <label className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
          Same as Permanent Address
        </label>
      </div>

      {/* Current Address - Always visible */}
      <div>
        <h5 className={`text-md font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
          Current Address
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Address', name: 'cAddress', required: true },
            { label: 'Pin Code', name: 'cPinCode', required: true },
            { label: 'District', name: 'cDistrict', required: true }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={field.name}
                value={getCurrentAddressValue(field.name)}
                onChange={handleChange}
                disabled={formData.isSameAsPermanent}
                className={`w-full rounded-md border px-3 py-2 
                  ${theme === 'light' 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-800 text-white'}
                  ${formData.isSameAsPermanent 
                    ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-75' 
                    : ''}`}
                required={field.required}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
