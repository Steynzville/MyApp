import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import {
  ArrowLeft,
  Power,
  Droplets,
  Settings,
  AlertTriangle,
  CheckCircle,
  Zap,
  WifiOff,
  Wifi,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import playSound from "../utils/audioPlayer";

const RemoteControl = ({ className, unit: propUnit, details }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get unit from props (when used as tab) or from location state (when used as standalone page)
  const unit = propUnit || location.state?.unit;

  // Remote control states
  const [machineOn, setMachineOn] = useState(unit?.status === "online");
  const [waterProductionOn, setWaterProductionOn] = useState(
    unit?.watergeneration && unit?.waterProductionOn,
  );
  const [autoSwitchEnabled, setAutoSwitchEnabled] = useState(
    unit?.autoSwitchEnabled,
  );
  const [isConnected, setIsConnected] = useState(true);

  if (!unit) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Unit Not Found
          </h1>
          <button
            onClick={() => (propUnit ? navigate("/grid-view") : navigate(-1))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {propUnit ? "Return to Grid View" : "Back to Unit Details"}
          </button>
        </div>
      </div>
    );
  }

  const handleMachineToggle = (checked) => {
    setMachineOn(checked);

    // Play appropriate audio based on power state
    if (checked) {
      playSound("power-on.mp3");
    } else {
      playSound("power-off.mp3");
    }

    // Update unit status based on power state
    if (unit) {
      unit.status = checked ? "online" : "offline";
    }

    // When machine control is toggled to "off", water production and automatic controls should both automatically toggle to "off"
    if (!checked) {
      setWaterProductionOn(false);
      setAutoSwitchEnabled(false);
    }
    console.log(
      `Machine ${checked ? "turned on" : "turned off"} for unit ${unit.name}`,
    );
  };

  const handleWaterProductionToggle = (checked) => {
    setWaterProductionOn(checked);
    
    // Play appropriate audio based on water state
    if (checked) {
      playSound("water-on.mp3");
    } else {
      playSound("water-off.mp3");
    }
    
    // When machine control is toggled to "on" and water production is switched to "off", automatic control should automatically toggle to "off"
    if (machineOn && !checked) {
      setAutoSwitchEnabled(false);
    }
    console.log(
      `Water production ${checked ? "enabled" : "disabled"} for unit ${unit.name}`,
    );
  };

  const handleAutoSwitchToggle = (checked) => {
    setAutoSwitchEnabled(checked);
    playSound("cool-tones.mp3");
    console.log(
      `Auto switch ${checked ? "enabled" : "disabled"} for unit ${unit.name}`,
    );
  };

  const ConnectionPill = () =>
    isConnected ? (
      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
        <Wifi className="h-4 w-4" />
        <span className="text-sm font-medium">Connected</span>
      </div>
    ) : (
      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">Disconnected</span>
      </div>
    );

  return (
    <div
      className={`min-h-screen bg-blue-50 dark:bg-gray-950 p-6 ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Unit Details</span>
          </button>

          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Remote Control - {unit.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Unit ID: {unit.id} • {unit.location}
            </p>
          </div>

          {/* Status row placed neatly below the heading */}
          <div className="flex items-center space-x-4 mt-4">
            <ConnectionPill />
            <div className="flex items-center space-x-2">
              {unit.status === "online" ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              )}
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${unit.status === "online" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"}`}
              >
                {unit.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Connection Warning */}
        {!isConnected && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Connection Lost
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Unable to communicate with the unit. Remote control
                    functions are disabled.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Remote Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Machine Control */}
          <Card className="bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Power className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Machine Control
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Machine Power
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Turn the entire machine on or off
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="cursor-pointer">
                      <Switch checked={machineOn} onCheckedChange={() => {}} />
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will {machineOn ? "turn off" : "turn on"}{" "}
                        the machine power. This could have significant impact on
                        unit operations.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleMachineToggle(!machineOn)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${machineOn ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Status: {machineOn ? "Running" : "Stopped"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {machineOn
                    ? "Machine is currently operational and running normally."
                    : "Machine is currently stopped and not operational."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Water Production Control */}
          {unit.watergeneration && (
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Water Production Control
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Water Production
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enable or disable water production
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="cursor-pointer">
                        <Switch
                          checked={waterProductionOn}
                          onCheckedChange={() => {}}
                          disabled={!isConnected || !machineOn}
                        />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will{" "}
                          {waterProductionOn ? "disable" : "enable"} water
                          production. This could affect water levels.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleWaterProductionToggle(!waterProductionOn)
                          }
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${waterProductionOn && machineOn ? "bg-blue-500" : "bg-gray-400"}`}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Status:{" "}
                      {waterProductionOn && machineOn ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Current water level: {unit?.water_level} L
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Automatic Control Settings */}
        {unit.watergeneration && (
          <Card className="bg-white dark:bg-gray-900 mt-6">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Automatic Control Settings
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Auto Switch On (Water Level &lt; 75%)
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically turn on water production when tank level falls
                    below 75%
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="cursor-pointer">
                      <Switch
                        checked={autoSwitchEnabled}
                        onCheckedChange={() => {}}
                        disabled={!isConnected || !machineOn}
                      />
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will{" "}
                        {autoSwitchEnabled ? "disable" : "enable"} automatic
                        control. This could affect water levels if not
                        monitored.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          handleAutoSwitchToggle(!autoSwitchEnabled)
                        }
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Current Level
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {unit?.water_level} L
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Trigger Level
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      75%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <p
                      className={`text-xs text-gray-600 dark:text-gray-400 mb-1`}
                    >
                      Auto Status
                    </p>
                    <p
                      className={`text-lg font-semibold ${autoSwitchEnabled ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}
                    >
                      {autoSwitchEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control History */}
        <Card className="bg-white dark:bg-gray-900 mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Control Actions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Water production enabled
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Manual control via remote interface
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  2024-08-08 14:30
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Machine powered on
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Manual control via remote interface
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  2024-08-08 14:25
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Auto switch enabled
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Automatic control configuration updated
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  2024-08-08 09:15
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RemoteControl;
