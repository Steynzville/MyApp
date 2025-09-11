import React from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Slider } from "../ui/slider";
import { Volume2, VolumeX } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const AudioSettings = () => {
  const { settings, toggleSound, setVolume, getEffectiveVolume } = useSettings();

  const handleVolumeChange = (value) => {
    const newVolume = value[0]; // Slider returns array
    setVolume(newVolume);
  };

  return (
    <Card className="bg-white dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Audio Settings
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sound Effects
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable or disable login and logout sounds
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={toggleSound}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Volume
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adjust the volume level for audio effects
            </p>
          </div>
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={settings.soundEnabled ? "Mute audio" : "Unmute audio"}
            >
              {settings.soundEnabled ? (
                <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <Slider
                value={[getEffectiveVolume()]}
                onValueChange={handleVolumeChange}
                max={100}
                min={0}
                step={1}
                className="w-full"
                aria-label="Volume level"
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[3ch] text-right">
              {getEffectiveVolume()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioSettings;
