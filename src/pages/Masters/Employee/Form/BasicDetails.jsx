import React, { useState } from 'react';
import { useThemeStore } from '../../../../store/themeStore';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const BasicDetails = ({ formData, setFormData, onNext }) => {
  const theme = useThemeStore((state) => state.theme);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRequiredFields, setIsRequiredFields] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isConfirmed) {
      onNext();
    }
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <FormSection title="Personal Information">
        <InputField label="Full Name" name="fullName" required={isRequiredFields} />
        <InputField label="Alias Name" name="aliasName" />
        <InputField label="Father's Name" name="fatherName" required={isRequiredFields} />
        <InputField label="Mother's Name" name="motherName" required={isRequiredFields} />
        <InputField label="Date of Birth" name="dateOfBirth" type="date" required={isRequiredFields} />
        <SelectField 
          label="Gender" 
          name="gender" 
          required={isRequiredFields}
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
        <InputField label="Qualification" name="qualification" required={isRequiredFields} />
      </FormSection>

      {/* Contact Information */}
      <FormSection title="Contact Information">
        <InputField label="Mobile 1" name="mobile1" type="tel" required={isRequiredFields} />
        <InputField label="Mobile 2" name="mobile2" type="tel" />
        <InputField label="Email Address" name="email" type="email" required={isRequiredFields} />
      </FormSection>

      {/* Address Information */}
      <FormSection title="Address Information">
        <TextArea label="Permanent Address" name="permanentAddress" required={isRequiredFields} />
        <InputField label="Permanent Pin Code" name="permanentPinCode" required={isRequiredFields} />
        <TextArea label="Correspondence Address" name="correspondenceAddress" />
        <InputField label="Correspondence Pin Code" name="correspondencePinCode" />
        <InputField label="Post Office" name="postOffice" required={isRequiredFields} />
        <InputField label="District" name="district" required={isRequiredFields} />
      </FormSection>

      {/* Professional Information */}
      <FormSection title="Professional Information">
        <InputField label="Location" name="location" required={isRequiredFields} />
        <InputField label="Department" name="department" required={isRequiredFields} />
        <InputField label="Designation" name="designation" required={isRequiredFields} />
        <InputField label="Date of Joining" name="dateOfJoining" type="date" required={isRequiredFields} />
      </FormSection>

      {/* Identity Information */}
      <FormSection title="Identity Information">
        <InputField label="Aadhaar Number" name="aadhaarNo" required={isRequiredFields} />
        <InputField label="PAN Number" name="panNo" required={isRequiredFields} />
      </FormSection>

      {/* Bank Details */}
      <FormSection title="Bank Details">
        <InputField label="Bank Name" name="bankName" required={isRequiredFields} />
        <InputField label="Branch Name" name="branchName" required={isRequiredFields} />
        <InputField label="Account Number" name="accountNo" required={isRequiredFields} />
        <InputField label="IFSC Code" name="ifscCode" required={isRequiredFields} />
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
            className={`mt-2 text-sm font-medium ${
              theme === 'light' 
                ? 'text-blue-600 hover:text-blue-700'
                : 'text-purple-600 hover:text-purple-700'
            }`}
            onClick={() => {/* We'll implement add row functionality later */}}
          >
            + Add Dependent
          </button>
        </div>
      </FormSection>

      {/* Confirmation and Submit Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="confirmDetails"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label 
            htmlFor="confirmDetails" 
            className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}
          >
            I confirm that all the details provided above are correct and accurate.
          </label>
        </div>

        <motion.button
          type="submit"
          disabled={!isConfirmed}
          whileHover={isConfirmed ? { scale: 1.02 } : {}}
          whileTap={isConfirmed ? { scale: 0.98 } : {}}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 
            ${isConfirmed 
              ? theme === 'light'
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
        >
          <span>Proceed to Document Upload</span>
          <FiArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </form>
  );
};

export default BasicDetails; 