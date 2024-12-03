import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { FiSave, FiTrash2, FiEdit2 } from 'react-icons/fi';

const Designation = () => {
  const theme = useThemeStore((state) => state.theme);
  const [designationName, setDesignationName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Dummy data for demonstration
  const designations = [
    { id: 1, name: 'Software Engineer', description: 'Development and maintenance of software applications', status: 'Active' },
    { id: 2, name: 'Project Manager', description: 'Project planning and team management', status: 'Active' },
    { id: 3, name: 'UI/UX Designer', description: 'User interface and experience design', status: 'Inactive' },
  ];

  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-blue-50 border-blue-200 shadow-lg';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-900';

  const subTextClass = theme === 'dark'
    ? 'text-purple-300'
    : 'text-blue-600';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
    : 'bg-white border-blue-200 text-blue-900 placeholder-blue-400';

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ designationName, description, status: isActive ? 'Active' : 'Inactive' });
    setDesignationName('');
    setDescription('');
    setIsActive(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          Designation Management
        </h1>
        <p className={`${subTextClass} mt-1`}>Create and manage job designations</p>
      </motion.div>

      {/* Add Designation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-6 ${cardClass}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="designationName" className={`block mb-2 ${textClass}`}>
                Designation Name <span className="text-red-500">*</span>
              </label>
              <input
                id="designationName"
                type="text"
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
                required
                placeholder="Enter designation name"
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="description" className={`block mb-2 ${textClass}`}>
                Description <span className={subTextClass}>(Optional)</span>
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter designation description"
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className={`block ${textClass}`}>Status:</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-blue-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-blue-300 after:border-blue-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
            <span className={`text-sm ${textClass}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <FiSave className="w-5 h-5" />
              <span>Save Designation</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Designations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg ${cardClass} overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-purple-500/20' : 'border-blue-200'}`}>
                <th className={`px-6 py-4 text-left ${textClass}`}>Designation Name</th>
                <th className={`px-6 py-4 text-left ${textClass}`}>Description</th>
                <th className={`px-6 py-4 text-left ${textClass}`}>Status</th>
                <th className={`px-6 py-4 text-right ${textClass}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {designations.map((designation) => (
                <tr
                  key={designation.id}
                  className={`border-b last:border-b-0 hover:${theme === 'dark' ? 'bg-purple-900/20' : 'bg-blue-100'} transition-colors ${
                    theme === 'dark' ? 'border-purple-500/20' : 'border-blue-200'
                  }`}
                >
                  <td className={`px-6 py-4 ${textClass}`}>{designation.name}</td>
                  <td className={`px-6 py-4 ${subTextClass}`}>{designation.description}</td>
                  <td className={`px-6 py-4`}>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      designation.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {designation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Designation;