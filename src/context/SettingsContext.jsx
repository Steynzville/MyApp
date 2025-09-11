import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    volume: 35, // Volume level 0-100, default matches current hardcoded value (0.35 * 100)
    temperatureUnit: "celsius", // 'celsius' or 'fahrenheit'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("thermacore-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error loading settings from localStorage:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("thermacore-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleSound = () => {
    updateSetting("soundEnabled", !settings.soundEnabled);
  };

  const setVolume = (volume) => {
    updateSetting("volume", volume);
    // If setting volume to 0, also set soundEnabled to false for visual consistency
    if (volume === 0 && settings.soundEnabled) {
      updateSetting("soundEnabled", false);
    }
    // If setting volume > 0 and sound was disabled, enable it
    else if (volume > 0 && !settings.soundEnabled) {
      updateSetting("soundEnabled", true);
    }
  };

  const toggleMute = () => {
    if (settings.soundEnabled) {
      // Store current volume and mute
      updateSetting("soundEnabled", false);
    } else {
      // Unmute - restore sound and ensure volume is not 0
      updateSetting("soundEnabled", true);
      if (settings.volume === 0) {
        updateSetting("volume", 35); // Default volume
      }
    }
  };

  // Get the effective volume (0 if muted, otherwise the set volume)
  const getEffectiveVolume = () => {
    return settings.soundEnabled ? settings.volume : 0;
  };

  // Normalize volume for audio API (0-100 to 0.0-1.0)
  const getNormalizedVolume = () => {
    return getEffectiveVolume() / 100;
  };

  const toggleTemperatureUnit = () => {
    updateSetting(
      "temperatureUnit",
      settings.temperatureUnit === "celsius" ? "fahrenheit" : "celsius",
    );
  };

  const setTemperatureUnit = (unit) => {
    updateSetting("temperatureUnit", unit);
  };

  const convertTemperature = (celsius) => {
    if (settings.temperatureUnit === "fahrenheit") {
      return (celsius * 9) / 5 + 32;
    }
    return celsius;
  };

  const formatTemperature = (celsius, showUnit = true) => {
    if (celsius === null || celsius === undefined) {
      return "N/A";
    }
    const converted = convertTemperature(celsius);
    const rounded = Math.round(converted * 10) / 10; // Round to 1 decimal place
    const unit = settings.temperatureUnit === "celsius" ? "°C" : "°F";
    return showUnit ? `${rounded}${unit}` : rounded;
  };

  const value = {
    settings,
    updateSetting,
    toggleSound,
    setVolume,
    toggleMute,
    getEffectiveVolume,
    getNormalizedVolume,
    toggleTemperatureUnit,
    setTemperatureUnit,
    convertTemperature,
    formatTemperature,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
