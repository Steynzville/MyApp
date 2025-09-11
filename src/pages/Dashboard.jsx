import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { units } from "../data/mockUnits";

const Dashboard = ({ userRole }) => {
  const navigate = useNavigate();

  const quickActions = [
    { name: "Sales Analytics", link: "/analytics" },
    { name: "Generate Report", link: "/quick-action/generate-report" },
    { name: "Manage Users", link: "/admin", adminOnly: true },
    { name: "System Diagnostics", link: "/quick-action/system-diagnostics" },
  ];

  const handleQuickActionClick = (link) => {
    navigate(link);
  };

  // Apply the same filtering logic as GridView for consistency
  const filteredUnits = useMemo(() => {
    if (userRole === "admin") {
      return units;
    } else {
      return units.slice(0, 6);
    }
  }, [userRole]);

  const {
    onlineCount,
    offlineCount,
    optimalCount,
    warningCount,
    criticalCount,
  } = useMemo(() => {
    const online = filteredUnits.filter(
      (unit) => unit.status === "online",
    ).length;
    const offline = filteredUnits.filter(
      (unit) => unit.status === "offline",
    ).length;
    const optimal = filteredUnits.filter(
      (unit) => unit.healthStatus === "Optimal",
    ).length;
    const warning = filteredUnits.filter(
      (unit) => unit.healthStatus === "Warning",
    ).length;
    const critical = filteredUnits.filter(
      (unit) => unit.healthStatus === "Critical",
    ).length;
    return {
      onlineCount: online,
      offlineCount: offline,
      optimalCount: optimal,
      warningCount: warning,
      criticalCount: critical,
    };
  }, [filteredUnits]);

  if (filteredUnits.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Dashboard Overview</h2>
      </header>

      {/* The rest of the dashboard remains the same */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map((action) => {
            if (action.adminOnly && userRole !== "admin") {
              return null;
            }
            return (
              <div
                key={action.name}
                className="action-tile"
                onClick={() => handleQuickActionClick(action.link)}
              >
                {action.name}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
