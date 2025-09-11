import React from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Slider } from "../ui/slider";
import { Volume2, VolumeX } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const AudioSettings = () => {
  const { settings, toggleSound, setVolume } = useSettings();
  
  // Determine if we should show muted state (volume is 0 OR sound is disabled)
  const isMuted = !settings.soundEnabled || settings.volume === 0;

  return (
    <Card className="bg-white dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center space-x-2">
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        ) : (
          <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Audio Settings
        </h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Volume Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="volume-slider"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Volume: {settings.volume}
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isMuted ? "Muted" : `${settings.volume}%`}
            </span>
          </div>
          <div className="px-2">
            <Slider
              id="volume-slider"
              value={[settings.volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              min={0}
              step={1}
              className="w-full"
              aria-label={`Volume control, current volume is ${settings.volume} percent`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={settings.volume}
            />
          </div>
        </div>

        {/* Mute Toggle */}
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
              aria-label={`Sound effects ${settings.soundEnabled ? 'enabled' : 'disabled'}`}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioSettings;
