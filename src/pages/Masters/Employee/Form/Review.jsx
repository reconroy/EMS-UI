import React, { useRef } from 'react';
import { useThemeStore } from '../../../../store/themeStore';
import { FiUser, FiPhone, FiMapPin, FiBriefcase, FiCreditCard, FiUsers, FiDownload } from 'react-icons/fi';
import PDFTemplate from './PDFTemplate';
import ReactDOM from 'react-dom/client';

const Review = ({ formData }) => {
  const theme = useThemeStore((state) => state.theme);
  const reviewRef = useRef();

  const downloadPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Create a temporary div to render the PDF template
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);

      // Render the PDF template
      const root = ReactDOM.createRoot(tempDiv);
      root.render(<PDFTemplate formData={formData} />);

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(tempDiv.firstChild, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Clean up
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('employee-details.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const Section = ({ icon: Icon, title, children , gridLg}) => (
    <div className={`p-6 rounded-xl border ${theme === 'light'
      ? 'bg-white border-blue-200'
      : 'bg-gray-800 border-gray-700'
      }`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${theme === 'light' ? 'text-blue-700' : 'text-gray-300'}`} />
        <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
          {title}
        </h3>
      </div>
      <div className={` grid gap-4 grid-cols-1 md:grid-cols-2 lg-grid-cols-${gridLg? `${gridLg}` : `3`} `}>
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value }) => (
    <div className="space-y-1">
      <dt className={`text-sm ${theme === 'light' ? 'text-blue-500' : 'text-gray-400'}`}>
        {label}
      </dt>
      <dd className={`text-sm font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
        {value || 'Not provided'}
      </dd>
    </div>
  );

  return (
    <div ref={reviewRef} className="max-w-5xl mx-auto space-y-8">
      {/* Header with Profile Photo */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {formData.profilePhoto ? (
            <img
              src={URL.createObjectURL(formData.profilePhoto)}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
          ) : (
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-700'
              }`}>
              <FiUser className="w-16 h-16 text-blue-400" />
            </div>
          )}
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
            {formData.fullName || 'Employee Name'}
          </h2>
          <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-gray-300'}`}>
            {formData.designationName} • {formData.departmentName}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <Section icon={FiUser} title="Personal Information" gridLg="2">
        <Field label="Full Name" value={formData.fullName} />
        <Field label="Alias Name" value={formData.nickName} />
        <Field label="Father's Name" value={formData.fatherName} />
        <Field label="Mother's Name" value={formData.motherName} />
        <Field label="Date of Birth" value={formData.dob} />
        <Field label="Gender" value={formData.gender} />
        <Field label="Marital Status" value={formData.maritalStatus} />
        <Field label="Qualification" value={formData.qualification} />
      </Section>

      {/* Contact Information */}
      <Section icon={FiPhone} title="Contact Information" gridLg="3">
        <Field label="Mobile 1" value={formData.mobile1} />
        <Field label="Mobile 2" value={formData.mobile2} />
        <Field label="Email Address" value={formData.email} />
      </Section>

      {/* Address Information */}
      <Section icon={FiMapPin} title="Address Information" gridLg="2">
       
          {/* Column 1 */}
          <div>
            <Field label="Permanent Address" value={formData.pAddress} />
            <Field label="Permanent Pin Code" value={formData.pPinCode} />
            <Field label="Permanent District" value={formData.pDistrict} />
          </div>
          {/* Column 2 */}
          <div>
            <Field label="Correspondence Address" value={formData.cAddress} />
            <Field label="Correspondence Pin Code" value={formData.cPinCode} />
            <Field label="Correspondence District" value={formData.cDistrict} />
          </div>
       
      </Section>

      {/* Professional Information */}
      <Section icon={FiBriefcase} title="Professional Information" gridLg="3">

          <Field label="Working Location" value={formData.workingLocationName} />
          <Field label="Department" value={formData.departmentName} />
          <Field label="Designation" value={formData.designationName} />
          <Field label="Role" value={formData.roleName} />
          <Field label="Date of Joining" value={formData.doj} />
          <Field label="Status" value={formData.isActive ? 'Active' : 'Inactive'} />
 
      </Section>


      {/* Bank & Identity Information */}
      <Section icon={FiCreditCard} title="Bank & Identity Information" gridLg="3">
    
        <Field label="Aadhaar Number" value={formData.aadhaarNumber} />
        <Field label="PAN Number" value={formData.panNumber} />
        <Field label="Bank Name" value={formData.bankName} />
        <Field label="Branch Name" value={formData.branchName} />
        <Field label="Account Number" value={formData.accountNo} />
        <Field label="IFSC Code" value={formData.ifscCode} />
      
      </Section>

      {/* Document Attachments */}
      <Section icon={FiUsers} title="Document Attachments">
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Aadhaar Card */}
          <div className={`p-4 rounded-lg border ${theme === 'light' ? 'border-blue-200' : 'border-gray-700'
            }`}>
            <h4 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-blue-900' : 'text-white'
              }`}>Aadhaar Card</h4>
            {formData.aadhaarCard && (
              <img
                src={URL.createObjectURL(formData.aadhaarCard)}
                alt="Aadhaar Card"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* PAN Card */}
          <div className={`p-4 rounded-lg border ${theme === 'light' ? 'border-blue-200' : 'border-gray-700'
            }`}>
            <h4 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-blue-900' : 'text-white'
              }`}>PAN Card</h4>
            {formData.panCard && (
              <img
                src={URL.createObjectURL(formData.panCard)}
                alt="PAN Card"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Passbook */}
          <div className={`p-4 rounded-lg border ${theme === 'light' ? 'border-blue-200' : 'border-gray-700'
            }`}>
            <h4 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-blue-900' : 'text-white'
              }`}>Bank Passbook</h4>
            {formData.passbook && (
              <img
                src={URL.createObjectURL(formData.passbook)}
                alt="Bank Passbook"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </Section>

      {/* Download Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={downloadPDF}
          className={`px-6 py-2 ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg 
          transition-colors duration-200 flex items-center gap-2`}
        >
          <FiDownload className="w-4 h-4" />
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default Review;