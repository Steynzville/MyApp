import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import AudioSettings from "../components/settings/AudioSettings";
import { SettingsProvider } from "../context/SettingsContext";

// Mock the UI components
vi.mock("../components/ui/card", () => ({
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div className={className}>{children}</div>,
}));

vi.mock("../components/ui/slider", () => ({
  Slider: ({ value, onValueChange, max, min, step, ...props }) => (
    <input
      type="range"
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value)])}
      max={max}
      min={min}
      step={step}
      {...props}
    />
  ),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

global.localStorage = localStorageMock;

const renderAudioSettings = () => {
  return render(
    <SettingsProvider>
      <AudioSettings />
    </SettingsProvider>
  );
};

describe("AudioSettings", () => {
  beforeEach(() => {
    // Clear localStorage state between tests
    localStorageMock.clear();
    vi.clearAllMocks();
  });
  test("renders volume slider with default value", () => {
    renderAudioSettings();
    
    const slider = screen.getByLabelText(/volume control/i);
    expect(slider).toBeInTheDocument();
    expect(slider.value).toBe("70"); // Default volume
  });

  test("displays current volume percentage", () => {
    renderAudioSettings();
    
    expect(screen.getByText("Volume: 70")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  test("updates volume when slider changes", () => {
    renderAudioSettings();
    
    const slider = screen.getByLabelText(/volume control/i);
    act(() => {
      fireEvent.change(slider, { target: { value: "50" } });
    });
    
    expect(screen.getByText("Volume: 50")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  test("shows muted state when volume is 0", () => {
    renderAudioSettings();
    
    const slider = screen.getByLabelText(/volume control/i);
    act(() => {
      fireEvent.change(slider, { target: { value: "0" } });
    });
    
    expect(screen.getByText("Muted")).toBeInTheDocument();
  });

  test("mute toggle affects volume and state", () => {
    renderAudioSettings();
    
    // Check initial state - volume 70, not muted
    expect(screen.getByText("Volume: 70")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
    
    const muteToggle = screen.getByLabelText(/sound effects/i);
    
    // Mute
    act(() => {
      fireEvent.click(muteToggle);
    });
    
    expect(screen.getByText("Muted")).toBeInTheDocument();
    expect(screen.getByText("Volume: 0")).toBeInTheDocument();
    
    // Unmute should restore previous volume
    act(() => {
      fireEvent.click(muteToggle);
    });
    expect(screen.getByText("Volume: 70")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  test("has proper accessibility attributes", () => {
    renderAudioSettings();
    
    const slider = screen.getByLabelText(/volume control/i);
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "70");
    
    const muteToggle = screen.getByLabelText(/sound effects/i);
    expect(muteToggle).toBeInTheDocument();
  });
});