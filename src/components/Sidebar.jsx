import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiDatabase, 
  FiChevronDown, 
  FiChevronLeft, 
  FiChevronRight, 
  FiX,
  FiUsers,
  FiUserCheck,
  FiGrid,
  FiMapPin,
  FiBriefcase
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from '../store/themeStore';
import { useState } from 'react';
import logo from './../assets/logo/EMS-Logo-1.png';
const Sidebar = ({ onClose, isMobile, isCollapsed, onCollapse }) => {
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);
  const [expandedItems, setExpandedItems] = useState([]);

  const menuItems = [
    { path: "/dashboard", icon: <FiHome className="w-6 h-6" />, label: "Dashboard" },
    {
      path: "/masters",
      icon: <FiDatabase className="w-6 h-6" />,
      label: "Masters",
      subItems: [
        { path: "/masters/employee/view", icon: <FiUsers className="w-4 h-4" />, label: "Employees" },
        { path: "/masters/roles", icon: <FiUserCheck className="w-4 h-4" />, label: "Roles" },
        { path: "/masters/departments", icon: <FiGrid className="w-4 h-4" />, label: "Departments" },
        { path: "/masters/locations", icon: <FiMapPin className="w-4 h-4" />, label: "Locations" },
        { path: "/masters/designations", icon: <FiBriefcase className="w-4 h-4" />, label: "Designations" },
      ]
    },
  ];

  const toggleExpand = (path) => {
    setExpandedItems(prev =>
      prev.includes(path)
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const renderMenuItem = (item) => (
    <div key={item.path}>
      {item.subItems ? (
        <div className="space-y-2">
          <button
            onClick={() => toggleExpand(item.path)}
            className={`w-full flex items-center ${!isMobile && isCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-lg transition-colors duration-200 text-purple-300 hover:bg-purple-900/50`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <AnimatePresence mode="wait">
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {(!isCollapsed || isMobile) && (
              <FiChevronDown className={`w-4 h-4 transform transition-transform ${expandedItems.includes(item.path) ? 'rotate-180' : ''}`} />
            )}
          </button>
          <AnimatePresence>
            {expandedItems.includes(item.path) && (!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-11 space-y-2"
              >
                {item.subItems.map(subItem => (
                  <motion.div
                    key={subItem.path}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={subItem.path}
                      onClick={onClose}
                      className={`flex items-center space-x-2 py-2 px-3 rounded-lg transition-colors duration-200 ${
                        location.pathname === subItem.path
                          ? "bg-purple-600 text-white"
                          : "text-purple-300 hover:bg-purple-900/50"
                      }`}
                    >
                      {subItem.icon}
                      <span>{subItem.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to={item.path}
            onClick={onClose}
            className={`flex items-center ${!isMobile && isCollapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg transition-colors duration-200 ${
              location.pathname === item.path
                ? "bg-purple-600 text-white"
                : "text-purple-300 hover:bg-purple-900/50"
            }`}
          >
            {item.icon}
            <AnimatePresence mode="wait">
              {(!isCollapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div 
      initial={false}
      animate={{ width: !isMobile && isCollapsed ? "4.5rem" : "16rem" }}
      transition={{ duration: 0.2 }}
      className="h-screen bg-black/40 backdrop-blur-xl border-r border-purple-500/20"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {isMobile && (
            <button
              onClick={onClose}
              className="text-purple-300 hover:text-purple-100 transition-colors absolute right-4 top-4"
            >
              <FiX className="w-6 h-6" />
            </button>
          )}
          <AnimatePresence mode="wait">
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                <img src={logo} alt="CUPL | EMS" className="h-12 w-auto" />
              </motion.div>
            )}
          </AnimatePresence>
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCollapse(!isCollapsed)}
              className={`transition-all duration-200 ${
                isCollapsed 
                  ? 'mx-auto w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center hover:bg-purple-600/30' 
                  : ''
              }`}
            >
              {isCollapsed ? (
                <FiChevronRight className="w-6 h-6 text-purple-300 hover:text-purple-100" />
              ) : (
                <FiChevronLeft className="w-6 h-6 text-purple-300 hover:text-purple-100" />
              )}
            </motion.button>
          )}
        </div>
        <nav className="space-y-2">
          {menuItems.map(renderMenuItem)}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
