import React from 'react';
import logo from './../../../../assets/logo/EMS-Logo-1.png'; // Make sure to add your logo
import { FiUser } from 'react-icons/fi'; // Import icon for placeholder

const PDFTemplate = ({ formData }) => {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-8 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-purple-600 pb-4">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Company Logo" className="h-12" />
          <div>
            <h1 className="text-2xl font-bold text-purple-600">CUPL | EMS</h1>
            <p className="text-sm text-gray-600">Employee Management System</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Application ID: {formData.id || 'EMP-2024-001'}</p>
          <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Employee Basic Info */}
      <div className="mt-8 flex items-start gap-6">
        {formData.profilePhoto ? (
          <img
            src={URL.createObjectURL(formData.profilePhoto)}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-100">
            <FiUser className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-800">{formData.fullName}</h2>
          <p className="text-gray-600">{formData.designationName} • {formData.departmentName}</p>
          <p className="text-gray-600 mt-1">{formData.email}</p>
          <p className="text-gray-600">{formData.mobile1}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-purple-600 border-b border-gray-200 pb-2 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="font-medium">{formData.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Father's Name</p>
            <p className="font-medium">{formData.fatherName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mother's Name</p>
            <p className="font-medium">{formData.motherName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-medium">{formData.dob}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium">{formData.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Marital Status</p>
            <p className="font-medium">{formData.maritalStatus}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-purple-600 border-b border-gray-200 pb-2 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-3 gap-x-6 gap-y-2">
          <div>
            <p className="text-sm text-gray-600">Email Address</p>
            <p className="font-medium">{formData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mobile Number</p>
            <p className="font-medium">{formData.mobile1}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Alternative Mobile</p>
            <p className="font-medium">{formData.mobile2 || 'N/A'}</p>
          </div>
        </div>
      </div>


      {/* Address Information */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-purple-600 border-b border-gray-200 pb-2 mb-4">
          Address Information
        </h3>
        <div className="grid grid-cols-2 gap-x-2 gap-y-4">
          <div>
            <p className="text-sm text-gray-600">Permanent Address</p>
            <p className="font-medium">{formData.pAddress}</p>
            <p className="text-sm mt-1">
              {formData.pDistrict} - {formData.pPinCode}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Correspondence Address</p>
            <p className="font-medium">{formData.cAddress}</p>
            <p className="text-sm mt-1">
              {formData.cDistrict} - {formData.cPinCode}
            </p>
          </div>
        </div>
      </div>

      {/* Bank & Identity Information */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-purple-600 border-b border-gray-200 pb-2 mb-4">
          Bank & Identity Information
        </h3>
        <div className="grid grid-cols-3 gap-x-12 gap-y-4">
          <div>
            <p className="text-sm text-gray-600">Aadhaar Number</p>
            <p className="font-medium">{formData.aadhaarNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">PAN Number</p>
            <p className="font-medium">{formData.panNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bank Name</p>
            <p className="font-medium">{formData.bankName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Branch Name</p>
            <p className="font-medium">{formData.branchName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Number</p>
            <p className="font-medium">{formData.accountNo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">IFSC Code</p>
            <p className="font-medium">{formData.ifscCode}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>This is a computer-generated document. No signature is required.</p>
        <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PDFTemplate; 