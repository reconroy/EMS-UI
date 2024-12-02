import { useState } from 'react';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

const Dashboard = () => {
  const theme = useThemeStore((state) => state.theme);
  const [stats] = useState([
    { title: 'Total Employees', value: '156', icon: <FiUsers />, color: 'from-purple-500 to-pink-500' },
    { title: 'Active Projects', value: '12', icon: <FiCalendar />, color: 'from-blue-500 to-purple-500' },
    { title: 'Revenue', value: '$52,000', icon: <FiDollarSign />, color: 'from-green-500 to-teal-500' },
    { title: 'Growth', value: '+12%', icon: <FiTrendingUp />, color: 'from-orange-500 to-red-500' }
  ]);

  const cardClass = theme === 'dark' 
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20' 
    : 'bg-white border-gray-200 shadow-lg';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-800">
        Welcome Back
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-6 ${cardClass}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme === 'dark' ? 'text-purple-300' : 'text-gray-600'} text-sm`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
                  {stat.value}
                </p>
              </div>
              <div className={`text-2xl bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`border rounded-lg p-6 ${cardClass}`}>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className={theme === 'dark' ? 'text-purple-300' : 'text-gray-600'}>
              No recent activity to display
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-6 ${cardClass}`}>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {['Add Employee', 'Create Project', 'View Reports', 'Settings'].map((action) => (
              <button
                key={action}
                className={`p-4 rounded-lg transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
