import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getUnitById,
  getUnitDetails,
  getUnitAlerts,
} from "../services/unitService";

// Manage Remotely Component

// Alerts Tab Component
const AlertsTab = ({ unitId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const unitAlerts = await getUnitAlerts(unitId);
        setAlerts(unitAlerts);
      } catch (error) {
        console.error("Error loading alerts:", error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [unitId]);

  if (loading) {
    return <div className="alerts-tab">Loading alerts...</div>;
  }

  return (
    <div className="alerts-tab">
      <h4>Alert History</h4>
      {alerts.length > 0 ? (
        <ul className="alert-list">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`alert-item status-${alert.severity.toLowerCase()}`}
            >
              <span>{new Date(alert.timestamp).toLocaleString()}</span>
              <span>{alert.description}</span>
              <span>Severity: {alert.severity}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No alerts for this unit.</p>
      )}
    </div>
  );
};

const UnitDetails = () => {
  const { unitId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [unit, setUnit] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUnitData = async () => {
      try {
        const [unitData, unitDetails] = await Promise.all([
          getUnitById(unitId),
          getUnitDetails(unitId),
        ]);
        setUnit(unitData);
        setDetails(unitDetails);
      } catch (error) {
        console.error("Error loading unit data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUnitData();
  }, [unitId]);

  if (loading) {
    return <div>Loading unit details...</div>;
  }

  if (!unit || !details) {
    return <div>Unit not found.</div>;
  }

  // Find the most recent critical or warning alert to display as the "Current Alert"
  const currentAlert = details.alerts?.find(
    (a) => a.severity === "Critical" || a.severity === "Warning",
  );

  return (
    <div className="unit-details">
      <h2>Unit: {unit.name}</h2>
      <div className="details-tabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={activeTab === "overview" ? "active" : ""}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={activeTab === "alerts" ? "active" : ""}
        >
          Alerts
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={activeTab === "manage" ? "active" : ""}
        >
          Manage Remotely
        </button>
        <button
          onClick={() => setActiveTab("remote-control")}
          className={activeTab === "remote-control" ? "active" : ""}
        >
          Remote Control
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-${unit.status.toLowerCase()}`}>
                {unit.status}
              </span>
            </p>
            {/* If there is a current alert, display it on the overview */}
            {unit.status !== "Operational" && currentAlert && (
              <p>
                <strong>Current Alert:</strong>{" "}
                <span className="status-critical">
                  {currentAlert.description}
                </span>
              </p>
            )}
            <p>
              <strong>Location:</strong> {unit.location}
            </p>
            <p>
              <strong>Install Date:</strong> {details.installDate}
            </p>
            <p>
              <strong>Last Maintenance:</strong> {details.lastMaintenance}
            </p>
          </div>
        )}
        {activeTab === "alerts" && <AlertsTab unitId={unitId} />}
        {activeTab === "remote-control" && unit && details && (
          <RemoteControl unit={unit} details={details} />
        )}
      </div>
    </div>
  );
};

export default UnitDetails;


            <p>
              <strong>Install Date:</strong> {details.installDate}
            </p>

