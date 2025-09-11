

import {useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSettings } from "../context/SettingsContext";
import { useUnits } from "../context/UnitContext";

const UserUnitDetails = ({ className }) => {
  const { formatTemperature } = useSettings();
  const { updateUnitName, updateUnitLocation, updateUnitGPS } = useUnits();
  const location = useLocation();
  const navigate = useNavigate();
  const unit = location.state?.unit;
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editedName, setEditedName] = useState(unit?.name || "");
  const [editedLocation, setEditedLocation] = useState(unit?.location || "");

  // Extend unit data with mock battery life and tank capacity
  if (unit) {
    unit.batteryLife = 85; // Example battery life percentage
    unit.tankCapacity = 800; // Example tank capacity in liters
  }

  // Check if unit is offline/switched off
  const isOffline =
    unit?.status === "offline" || unit?.status === "decommissioned";

  const handleSaveName = async () => {
    if (unit) {
      try {
        await updateUnitName(unit.id, editedName);
        setIsEditingName(false);
      } catch (error) {
        console.error("Failed to update unit name:", error);
        // Reset to original value on error
        setEditedName(unit.name || "");
      }
    }
  };

  const handleSaveLocation = async () => {
    if (unit) {
      try {
        await updateUnitLocation(unit.id, editedLocation);
        setIsEditingLocation(false);
      } catch (error) {
        console.error("Failed to update unit location:", error);
        // Reset to original value on error
        setEditedLocation(unit.location || "");
      }
    }
  };

  const handleCancelNameEdit = () => {
    setEditedName(unit?.name || "");
    setIsEditingName(false);
  };

  const handleCancelLocationEdit = () => {
    setEditedLocation(unit?.location || "");
    setIsEditingLocation(false);
  };

  if (!unit) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Unit Not Found
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Mock historical data for the unit
  const historicalData = [
    {
      id: 1,
      timestamp: "2024-08-07 14:30",
      event: "Power output increased",
      value: `${unit.powerOutput} kW`,
      trend: "up",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2024-08-07 12:15",
      event: "Water level normal",
      value: `${unit.waterLevel}%`,
      trend: "stable",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-08-07 10:45",
      event: "Temperature stabilized",
      value: `${unit.temperature}°C`,
      trend: "stable",
      severity: "info",
    },
    {
      id: 4,
      timestamp: "2024-08-06 16:00",
      event: "Maintenance completed",
      value: "System restored",
      trend: "up",
      severity: "success",
    },
    {
      id: 5,
      timestamp: "2024-08-06 09:30",
      event: "Scheduled maintenance started",
      value: "System offline",
      trend: "down",
      severity: "warning",
    },
  ];

  const alertsHistory = [
    {
      id: 1,
      timestamp: "2024-08-05 14:45",
      type: "warning",
      title: "Low Water Level",
      message: "Water level dropped below 80%",
      resolved: true,
      resolvedAt: "2024-08-05 15:30",
    },
    {
      id: 2,
      timestamp: "2024-07-28 11:20",
      type: "info",
      title: "Maintenance Reminder",
      message: "Scheduled maintenance due in 7 days",
      resolved: true,
      resolvedAt: "2024-08-06 09:30",
    },
    {
      id: 3,
      timestamp: "2024-07-15 08:15",
      type: "critical",
      title: "High Temperature Alert",
      message: "Temperature exceeded safe operating limits",
      resolved: true,
      resolvedAt: "2024-07-15 09:45",
    },
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "success":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getAlertTypeColor = (type) => {
    switch (type) {
      case "critical":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "offline":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "decommissioned":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div
      className={`min-h-screen bg-blue-50 dark:bg-gray-950 p-6 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {unit.name} - Detailed View
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Serial Number:{" "}
                {unit.serialNumber || `${unit.name.toUpperCase()}-001`} •{" "}
                {unit.location}
              </p>
              <div className="flex items-center space-x-2 mb-4">
                {unit.status === "online" ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(unit.status)}`}
                >
                  {unit.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => navigate("/remote-control", { state: { unit } })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>Manage Remotely</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation - No Client Details for users */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview" },
                { id: "history", name: "History" },
                { id: "alerts", name: "Alerts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* NH3 Alarm Alert - Only show if unit has alarm */}
            {unit.hasAlarm && (
              <Card className="bg-red-600 border-red-700 animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-white animate-bounce" />
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        🚨 NH3 LEAK DETECTED 🚨
                      </h3>
                      <p className="text-red-100">
                        Critical alarm: Toxic ammonia leak detected in system.
                        Immediate attention required.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Status */}
              <Card className="bg-white dark:bg-gray-900">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Current Status
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Power className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Power Output
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {parseFloat(unit.currentPower).toFixed(1)} kW
                        </p>
                      </div>
                    </div>

                    {unit.watergeneration && (
                      <div className="flex items-center space-x-3">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Water Level
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {unit.water_level} L
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Cloud className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Temp Outside
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {formatTemperature(unit.temp_outside)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <ThermometerSnowflake className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Temp In
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {isOffline ? "N/A" : formatTemperature(unit.temp_in)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <ThermometerSun className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Temp Out
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {isOffline ? "N/A" : formatTemperature(unit.temp_out)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Droplets className="h-5 w-5 text-cyan-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Humidity
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {unit.humidity}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Gauge className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pressure
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {isOffline ? "N/A" : `${unit.pressure} kPa`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <BatteryCharging className="h-5 w-5 text-green-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Battery Life
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 max-w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: `${unit.battery_level}%` }}
                            ></div>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                            {unit.battery_level}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Unit Information */}
              <Card className="bg-white dark:bg-gray-900">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Unit Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {/* Machine Name */}
                    <div className="flex items-center space-x-3">
                      <Power className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Machine Name
                        </p>
                        {isEditingName ? (
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveName}
                              className="p-1 text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelNameEdit}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {unit.name}
                            </p>
                            <button
                              onClick={() => setIsEditingName(true)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Install Date
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {unit.installDate || "2024-01-15"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Last Maintenance
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {unit.lastMaintenance || "2024-07-10"}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Location
                        </p>
                        {isEditingLocation ? (
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="text"
                              value={editedLocation}
                              onChange={(e) =>
                                setEditedLocation(e.target.value)
                              }
                              className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveLocation}
                              className="p-1 text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelLocationEdit}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {unit.location}
                              </p>
                              <button
                                onClick={() => setIsEditingLocation(true)}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              GPS: {unit.gpsCoordinates || "40.7128, -74.0060"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <VitalSignGraph
              title="Power Output History"
              dataKey="power"
              color="#8884d8"
            />
            <VitalSignGraph
              title="Temperature In History"
              dataKey="tempIn"
              color="#82ca9d"
            />
            <VitalSignGraph
              title="Temperature Out History"
              dataKey="tempOut"
              color="#ffc658"
            />
            <VitalSignGraph
              title="Pressure History"
              dataKey="pressure"
              color="#ff7300"
            />
            {unit && unit.watergeneration && (
              <VitalSignGraph
                title="Water Level History"
                dataKey="waterLevel"
                color="#0088FE"
              />
            )}

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-8">
              Event History
            </h3>
            {historicalData.map((event) => (
              <Card
                key={event.id}
                className={`bg-white dark:bg-gray-900 border-l-4 ${getSeverityColor(event.severity)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {event.event}
                        </h4>
                        {getTrendIcon(event.trend)}
                      </div>

                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {event.value}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{event.timestamp}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Current Alerts
            </h3>

            {unit.currentAlert || (unit.alerts && unit.alerts.length > 0) ? (
              <>
                {unit.currentAlert && (
                  <Card
                    className={`bg-white dark:bg-gray-900 border-l-4 ${
                      unit.currentAlert.type === "critical"
                        ? "border-l-red-500"
                        : unit.currentAlert.type === "warning"
                          ? "border-l-yellow-500"
                          : unit.currentAlert.type === "info"
                            ? "border-l-blue-500"
                            : "border-l-green-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle
                          className={`h-5 w-5 mt-0.5 ${
                            unit.currentAlert.type === "critical"
                              ? "text-red-600 dark:text-red-400"
                              : unit.currentAlert.type === "warning"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : unit.currentAlert.type === "info"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-green-600 dark:text-green-400"
                          }`}
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {unit.currentAlert.title}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {unit.currentAlert.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {unit.currentAlert.timestamp}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {!unit.currentAlert &&
                  unit.alerts &&
                  unit.alerts.map((alert, index) => (
                    <Card
                      key={index}
                      className="bg-white dark:bg-gray-900 border-l-4 border-l-yellow-500"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Active Alert
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {alert}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </>
            ) : (
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      No active alerts for this unit
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-8">
              Alert History
            </h3>

            {alertsHistory.map((alert) => (
              <Card key={alert.id} className="bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle
                          className={`h-4 w-4 ${getAlertTypeColor(alert.type)}`}
                        />
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {alert.title}
                        </h4>
                        {alert.resolved && (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full">
                            Resolved
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {alert.message}
                      </p>

                      {alert.resolved && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Resolved on {alert.resolvedAt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserUnitDetails;
