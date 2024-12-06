import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import API from '../../../services/api';
import Notification from '../../../components/Notification';

// Import existing form sections
import StepIndicator from './Form/StepIndicator';
import BasicDetails from './Form/BasicDetails';
import BankDetails from './Form/BankDetails';
import DocumentUpload from './Form/DocumentUpload';
import Review from './Form/Review';

const UpdateEmployee = () => {
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    message: '',
  });

  useEffect(() => {
    if (id) {
      fetchEmployeeData(id);
    }
  }, [id]);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetails formData={formData} setFormData={setFormData} onNext={handleNext} />;
      case 2:
        return <BankDetails formData={formData} setFormData={setFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <DocumentUpload formData={formData} setFormData={setFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  const fetchEmployeeData = async (employeeId) => {
    try {
      setLoading(true);
      const response = await API.get(`/Employees/${employeeId}`);
      
      // Format dates for form display
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      };

      const formattedData = {
        ...response.data,
        dob: formatDate(response.data.dob),
        doj: formatDate(response.data.doj),
        departmentId: response.data.departmentID,
        roleId: response.data.roleID,
        workingLocationId: response.data.workingLocation
      };

      setFormData(formattedData);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      showNotification('error', 'Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      };

      const employeeData = {
        empID: formData.empID,
        fullName: formData.fullName,
        nickName: formData.nickName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        maritalStatus: formData.maritalStatus,
        qualification: formData.qualification,
        email: formData.email,
        mobile1: String(formData.mobile1),
        mobile2: String(formData.mobile2),
        pAddress: formData.pAddress,
        pPinCode: formData.pPinCode,
        pDistrict: formData.pDistrict,
        cAddress: formData.cAddress,
        cPinCode: formData.cPinCode,
        cDistrict: formData.cDistrict,
        dob: formatDate(formData.dob),
        doj: formatDate(formData.doj),
        gender: formData.gender,
        roleID: formData.roleId,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        isActive: formData.isActive,
        departmentID: formData.departmentId,
        designation: formData.designation,
        workingLocation: formData.workingLocationId
      };

      await API.put(`/Employees/${formData.empID}`, employeeData);
      showNotification('success', 'Employee updated successfully');
      navigate('/masters/employee');
    } catch (error) {
      console.error('Error updating employee:', error);
      showNotification('error', 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-lg';

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={() => navigate('/masters/employee')}
            className={`flex items-center gap-2 ${theme === 'dark' ? 'text-purple-600' : 'text-blue-600'}`}
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to List</span>
          </button>
        </motion.div>

        <div className="flex gap-3">
          {currentStep > 1 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handlePrevious}
              className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-purple-600 text-purple-600' : 'border-blue-600 text-blue-600'}`}
            >
              Previous
            </motion.button>
          )}

          {currentStep < 4 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleNext}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              Next
            </motion.button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Form Container */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-6 ${cardClass}`}
          >
            {renderStepContent()}
          </motion.div>

          {/* Confirmation and Submit Section */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="confirmDetails"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-600' : 'text-blue-600'} border-gray-300 rounded focus:ring-purple-500`}
                />
                <label
                  htmlFor="confirmDetails"
                  className="text-sm text-gray-900 dark:text-gray-300"
                >
                  I confirm that all the details provided are correct and accurate.
                </label>
              </div>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleSubmit}
                disabled={!isConfirmed || loading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white ${(!isConfirmed || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateEmployee;
