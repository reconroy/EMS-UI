import React from 'react';

const ContactInformation = ({ theme, formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
        Contact Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Mobile Number 1', name: 'mobile1', required: true },
          { label: 'Mobile Number 2', name: 'mobile2' }
        ].map((field) => (
          <div key={field.name} className="space-y-1">
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type || 'text'}
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
  );
};

export default ContactInformation; 