import React from 'react';

const PersonalInformation = ({ theme, formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
        Personal Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Full Name', name: 'fullName', required: true },
          { label: 'Nick Name (Alias Name)', name: 'nickName' },
          { label: "Father's Name", name: 'fatherName', required: true },
          { label: "Mother's Name", name: 'motherName', required: true },
          { label: 'Date of Birth', name: 'dob', type: 'date', required: true },
          { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
          { label: 'Marital Status', name: 'maritalStatus', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
          { label: 'Qualification', name: 'qualification', type: 'select', options: ['10th', '12th', 'Graduate', 'Post-Graduate'], required: true }
        ].map((field) => (
          <div key={field.name} className="space-y-1">
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'date' ? (
              <input
                type="date"
                name={field.name}
                value={formData[field.name] ? formData[field.name].split('/').reverse().join('-') : ''}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                required={field.required}
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInformation;