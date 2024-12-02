import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiDatabase, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from '../store/themeStore';

const Sidebar = ({ onClose, isMobile, isCollapsed, onCollapse }) => {
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);

  const menuItems = [
    { path: "/dashboard", icon: <FiHome className="w-6 h-6" />, label: "Dashboard" },
    { path: "/masters", icon: <FiDatabase className="w-6 h-6" />, label: "Masters" },
    { path: "/employees", icon: <FiUsers className="w-6 h-6" />, label: "Employees" },
  ];

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
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
              >
                CUPL | EMS
              </motion.h2>
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
          {menuItems.map((item) => (
            <motion.div
              key={item.path}
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
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
