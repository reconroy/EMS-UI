import React, { useState, useEffect } from 'react';
import API from '../../../../../services/api';

const ProfessionalInformation = ({ theme, formData, handleChange }) => {
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(formData)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await API.get('/Locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await API.get('/Departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchDesignations = async () => {
      try {
        const response = await API.get('/Designations');
        setDesignations(response.data);
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await API.get('/Roles');
        console.log('Roles data:', response.data);
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchLocations(),
        fetchDepartments(),
        fetchDesignations(),
        fetchRoles()
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);
  console.log(locations)


  const fields = [

    {
      label: 'Working Location',
      name: 'workingLocation', 
      type: 'select',
      options: locations?.map(loc => ({
        value: loc.locationID?.toString(),
        label: loc.locationName,
        data: {
          id: loc.locationID,
          name: loc.locationName
        }
      })) || [],
      required: true
    },
    {
      label: 'Department',
      name: 'department',
      type: 'select', 
      options: departments?.map(dept => ({
        value: dept.deptID?.toString(),
        label: dept.deptName,
        data: {
          id: dept.deptID,
          name: dept.deptName
        }
      })) || [],
      required: true
    },
    {
      label: 'Designation',
      name: 'designation',
      type: 'select',
      options: designations?.map(desig => ({
        value: desig.designationID?.toString(),
        label: desig.designationName,
        data: {
          id: desig.designation,
          name: desig.designationName
        }
      })) || [],
      required: true
    },
    {
      label: 'Role',
      name: 'role',
      type: 'select',
      options: roles?.map(role => ({
        value: role.roleId?.toString(),
        label: role.roleName,
        data: {
          id: role.roleId,
          name: role.roleName
        }
      })) || [],
      required: true
    },
    {
      label: 'Date of Joining',
      name: 'doj',
      type: 'date',
      required: true
    }
  ];

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
        Professional Information
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
         
          <div key={field.name} className="space-y-1"> 
          {console.log(field)}
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={field.name === 'role' ? formData.roleId : formData[field.name] || ''}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === 'light' 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-800 text-white'
                }`}
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option 
                    key={`${field.name}_${option.value}`} 
                    value={option.value}
                    data-data={JSON.stringify(option.data)}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'date' ? (
              <input
              type="date"
              name={field.name}
              value={formData[field.name] ? formData[field.name].split('/').reverse().join('-') : ''}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 ${
                theme === 'light' 
                  ? 'border-gray-300 bg-white text-gray-900' 
                  : 'border-gray-600 bg-gray-800 text-white'
              }`}
              required={field.required}
            />
            ) : (
              <input
                type={field.type || 'text'}
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

export default ProfessionalInformation;