import { createContext, useContext, useEffect,useState } from "react";

import {
  getAllUnits,
  updateUnitGPS as serviceUpdateUnitGPS,
  updateUnitLocation as serviceUpdateUnitLocation,
  updateUnitName as serviceUpdateUnitName,
} from "../services/unitService";

const UnitContext = createContext();

export const useUnits = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnits must be used within a UnitProvider");
  }
  return context;
};

export const UnitProvider = ({ children }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial units data
  useEffect(() => {
    const loadUnits = async () => {
      try {
        setLoading(true);
        const unitsData = await getAllUnits();
        setUnits(unitsData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load units:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUnits();
  }, []);

  // Update a specific unit's information
  const updateUnit = (unitId, updates) => {
    setUnits((prevUnits) =>
      prevUnits.map((unit) =>
        unit.id === unitId ? { ...unit, ...updates } : unit,
      ),
    );
  };

  // Update unit name
  const updateUnitName = async (unitId, newName) => {
    try {
      await serviceUpdateUnitName(unitId, newName);
      updateUnit(unitId, { name: newName });
    } catch (error) {
      console.error("Failed to update unit name:", error);
      throw error;
    }
  };

  // Update unit location
  const updateUnitLocation = async (unitId, newLocation) => {
    try {
      await serviceUpdateUnitLocation(unitId, newLocation);
      updateUnit(unitId, { location: newLocation });
    } catch (error) {
      console.error("Failed to update unit location:", error);
      throw error;
    }
  };

  // Update unit GPS coordinates
  const updateUnitGPS = async (unitId, newGPS) => {
    try {
      await serviceUpdateUnitGPS(unitId, newGPS);
      updateUnit(unitId, { gpsCoordinates: newGPS });
    } catch (error) {
      console.error("Failed to update unit GPS:", error);
      throw error;
    }
  };

  // Get a specific unit by ID
  const getUnit = (unitId) => {
    return units.find((unit) => unit.id === unitId);
  };

  // Refresh units data
  const refreshUnits = async () => {
    try {
      setLoading(true);
      const unitsData = await getAllUnits();
      setUnits(unitsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to refresh units:", err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    units,
    loading,
    error,
    updateUnit,
    updateUnitName,
    updateUnitLocation,
    updateUnitGPS,
    getUnit,
    refreshUnits,
  };

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
};

export default UnitContext;
