import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const NotificationBell = ({ className = "" }) => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [viewedNotifications, setViewedNotifications] = useState(new Set());

  // Mock notifications data
  const alerts = [
    {
      id: 1,
      type: "alert",
      message: "ThermaCore Unit 001 - Unit Offline",
      timestamp: "2025-09-09 14:45",
    },
    {
      id: 2,
      type: "alert",
      message: "ThermaCore Unit 002 - Low Water Level",
      timestamp: "2025-09-09 14:15",
    },
    {
      id: 3,
      type: "alert",
      message: "ThermaCore Unit 003 - Maintenance Scheduled",
      timestamp: "2025-09-09 13:30",
      status: "completed",
    },
    {
      id: 4,
      type: "alert",
      message: "ThermaCore Unit 004 - System Restored",
      timestamp: "2025-09-09 12:00",
      status: "completed",
    },
    {
      id: 5,
      type: "alert",
      message: "ThermaCore Unit 005 - Temperature Alert",
      timestamp: "2025-09-09 11:30",
      status: "completed",
    },
    {
      id: 6,
      type: "alert",
      message: "ThermaCore Unit 006 - Pressure Drop",
      timestamp: "2025-09-09 10:15",
    },
  ];

  const alarms = [
    {
      id: 7,
      type: "alarm",
      message: "ThermaCore Unit 003 - NH3 LEAK DETECTED",
      timestamp: "2025-09-09 15:30",
    },
    {
      id: 8,
      type: "alarm",
      message: "ThermaCore Unit 014 - NH3 LEAK DETECTED",
      timestamp: "2025-09-09 15:15",
    },
  ];

  // Filter alarms based on user role
  const userAlarms = userRole === "admin" ? alarms : alarms.slice(0, 1);

  // Combine and sort notifications - alarms first, then alerts
  const allNotifications = [...userAlarms, ...alerts];
  const unviewedCount = allNotifications.filter(
    (n) => !viewedNotifications.has(n.id),
  ).length;

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Store notifications in localStorage when bell is clicked (opened)
      const unresolvedNotifications = allNotifications.map(notification => {
        if (notification.id === 3 || notification.id === 4 || notification.id === 5) {
          return { ...notification, status: 'completed' };
        } else {
          return { ...notification, status: 'unresolved' };
        }
      });
      localStorage.setItem('unresolvedNotifications', JSON.stringify(unresolvedNotifications));
      
      // Mark all notifications as viewed when opening
      const allIds = new Set(allNotifications.map((n) => n.id));
      setViewedNotifications(allIds);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNotificationClick = (notification) => {
    // Extract unit name from notification message
    const unitMatch = notification.message.match(/ThermaCore Unit (\d+)/);
    if (unitMatch) {
      const unitNumber = unitMatch[1];
      const unitName = `ThermaCore Unit ${unitNumber}`;
      
      // Navigate to GridView with search filter for the specific unit
      setIsOpen(false);
      navigate(`/grid-view?search=${encodeURIComponent(unitName)}`);
    }
  };

  const handleViewAllNotifications = () => {
    // Store unresolved notifications in localStorage for the history page
    const unresolvedNotifications = allNotifications.map(notification => {
      if (notification.id === 3 || notification.id === 4 || notification.id === 5) {
        return { ...notification, status: 'completed' };
      } else {
        return { ...notification, status: 'unresolved' };
      }
    });
    localStorage.setItem('unresolvedNotifications', JSON.stringify(unresolvedNotifications));
    
    setIsOpen(false);
    navigate('/history');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unviewedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unviewedCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {allNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {allNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                      notification.type === "alarm"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : notification.status === "completed"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.type === "alarm"
                            ? "bg-red-500"
                            : notification.status === "completed"
                            ? "bg-blue-500"
                            : "bg-orange-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            notification.type === "alarm"
                              ? "text-red-900 dark:text-red-100"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleViewAllNotifications}
              className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;


