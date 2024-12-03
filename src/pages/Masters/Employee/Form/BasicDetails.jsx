import React from 'react';
import { useThemeStore } from '../../../../store/themeStore';

const BasicDetails = ({ formData, setFormData }) => {
  const theme = useThemeStore((state) => state.theme);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const FormSection = ({ title, children }) => (
    <div className="space-y-4">
      <h4 className={`text-lg font-medium border-b pb-2 ${
        theme === 'light' 
          ? 'text-gray-900 border-gray-200' 
          : 'text-white border-gray-700'
      }`}>
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, name, type = "text", required = false }) => (
    <div className="space-y-1">
      <label htmlFor={name} className={`block text-sm font-medium ${
        theme === 'light' ? 'text-gray-900' : 'text-gray-300'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        className={`w-full rounded-md border px-3 py-2 ${
          theme === 'light'
            ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
            : 'border-gray-600 bg-gray-800 text-white placeholder-gray-500'
        } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
        required={required}
      />
    </div>
  );

  // Update select elements with similar theme-aware styles
  const SelectField = ({ label, name, options, required = false }) => (
    <div className="space-y-1">
      <label className={`block text-sm font-medium ${
        theme === 'light' ? 'text-gray-900' : 'text-gray-300'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        className={`w-full rounded-md border px-3 py-2 ${
          theme === 'light'
            ? 'border-gray-300 bg-white text-gray-900'
            : 'border-gray-600 bg-gray-800 text-white'
        }`}
        required={required}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Update textarea with theme-aware styles
  const TextArea = ({ label, name, required = false }) => (
    <div className="col-span-full">
      <label className={`block text-sm font-medium mb-1 ${
        theme === 'light' ? 'text-gray-900' : 'text-gray-300'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        rows={3}
        className={`w-full rounded-md border px-3 py-2 ${
          theme === 'light'
            ? 'border-gray-300 bg-white text-gray-900'
            : 'border-gray-600 bg-gray-800 text-white'
        }`}
        required={required}
      />
    </div>
  );

  return (
    <form className="space-y-8">
      {/* Personal Information */}
      <FormSection title="Personal Information">
        <InputField label="Full Name" name="fullName" required />
        <InputField label="Alias Name" name="aliasName" />
        <InputField label="Father's Name" name="fatherName" required />
        <InputField label="Mother's Name" name="motherName" required />
        <InputField label="Date of Birth" name="dateOfBirth" type="date" required />
        <SelectField 
          label="Gender" 
          name="gender" 
          required
          options={[
            { value: "", label: "Select Gender" },
            { value: "M", label: "Male" },
            { value: "F", label: "Female" },
            { value: "O", label: "Other" }
          ]}
        />
        <SelectField 
          label="Marital Status" 
          name="maritalStatus"
          options={[
            { value: "", label: "Select Status" },
            { value: "single", label: "Single" },
            { value: "married", label: "Married" },
            { value: "divorced", label: "Divorced" },
            { value: "widowed", label: "Widowed" }
          ]}
        />
        <InputField label="Qualification" name="qualification" required />
      </FormSection>

      {/* Contact Information */}
      <FormSection title="Contact Information">
        <InputField label="Mobile 1" name="mobile1" type="tel" required />
        <InputField label="Mobile 2" name="mobile2" type="tel" />
        <InputField label="Email Address" name="email" type="email" required />
      </FormSection>

      {/* Address Information */}
      <FormSection title="Address Information">
        <TextArea label="Permanent Address" name="permanentAddress" required />
        <InputField label="Permanent Pin Code" name="permanentPinCode" required />
        <TextArea label="Correspondence Address" name="correspondenceAddress" />
        <InputField label="Correspondence Pin Code" name="correspondencePinCode" />
        <InputField label="Post Office" name="postOffice" required />
        <InputField label="District" name="district" required />
      </FormSection>

      {/* Professional Information */}
      <FormSection title="Professional Information">
        <InputField label="Location" name="location" required />
        <InputField label="Department" name="department" required />
        <InputField label="Designation" name="designation" required />
      </FormSection>

      {/* Identity Information */}
      <FormSection title="Identity Information">
        <InputField label="Aadhaar Number" name="aadhaarNo" required />
        <InputField label="PAN Number" name="panNo" required />
      </FormSection>

      {/* Bank Details */}
      <FormSection title="Bank Details">
        <InputField label="Bank Name" name="bankName" required />
        <InputField label="Branch Name" name="branchName" required />
        <InputField label="Account Number" name="accountNo" required />
        <InputField label="IFSC Code" name="ifscCode" required />
      </FormSection>

      {/* Dependent Family Details */}
      <FormSection title="Dependent Family Details">
        <div className="col-span-full">
          <table className={`w-full border-collapse border ${
            theme === 'light' ? 'border-gray-300' : 'border-gray-600'
          }`}>
            <thead>
              <tr className={theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}>
                <th className={`border p-2 ${
                  theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                }`}>Name</th>
                <th className={`border p-2 ${
                  theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                }`}>Relation</th>
                <th className={`border p-2 ${
                  theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                }`}>Age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`border p-2 ${
                  theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                }`}>
                  <input
                    type="text"
                    className={`w-full ${
                      theme === 'light'
                        ? 'bg-white text-gray-900 placeholder-gray-400'
                        : 'bg-transparent text-white placeholder-gray-500'
                    }`}
                    placeholder="Enter name"
                  />
                </td>
                <td className={`border p-2 ${
                  theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                }`}>
                  <input
                    type="text"
                    className={`w-full ${
                      theme === 'light'
                        ? 'bg-white text-gray-900 placeholder-gray-400'
                        : 'bg-transparent text-white placeholder-gray-500'
                    }`}
                    placeholder="Enter relation"
                  />
                </td>
                <td className={`border p-2 ${
                  theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                }`}>
                  <input
                    type="number"
                    className={`w-full ${
                      theme === 'light'
                        ? 'bg-white text-gray-900 placeholder-gray-400'
                        : 'bg-transparent text-white placeholder-gray-500'
                    }`}
                    placeholder="Enter age"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button
            type="button"
            className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
            onClick={() => {/* We'll implement add row functionality later */}}
          >
            + Add Dependent
          </button>
        </div>
      </FormSection>
    </form>
  );
};

export default BasicDetails; 