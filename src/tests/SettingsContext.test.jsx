import React from "react";
import { render, act } from "@testing-library/react";
import { vi } from "vitest";
import { SettingsProvider, useSettings } from "../context/SettingsContext";

// Test component to access context values
const TestComponent = () => {
  const { settings, setVolume, toggleSound, normalizeVolume } = useSettings();
  return (
    <div>
      <span data-testid="volume">{settings.volume}</span>
      <span data-testid="sound-enabled">{settings.soundEnabled.toString()}</span>
      <span data-testid="prev-volume">{settings.prevVolume}</span>
      <button onClick={() => setVolume(50)} data-testid="set-volume">Set Volume</button>
      <button onClick={toggleSound} data-testid="toggle-sound">Toggle Sound</button>
      <span data-testid="normalized">{normalizeVolume(settings.volume)}</span>
    </div>
  );
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe("SettingsContext Volume Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test("initializes with default volume settings", () => {
    const { getByTestId } = render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(getByTestId("volume")).toHaveTextContent("70");
    expect(getByTestId("sound-enabled")).toHaveTextContent("true");
    expect(getByTestId("prev-volume")).toHaveTextContent("70");
  });

  test("normalizes volume correctly", () => {
    const { getByTestId } = render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(getByTestId("normalized")).toHaveTextContent("0.7"); // 70% -> 0.7
  });

  test("setVolume updates volume correctly", () => {
    const { getByTestId } = render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const setVolumeButton = getByTestId("set-volume");
    act(() => {
      setVolumeButton.click();
    });

    expect(getByTestId("volume")).toHaveTextContent("50");
  });

  test("toggleSound handles mute/unmute correctly", () => {
    const { getByTestId } = render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const toggleButton = getByTestId("toggle-sound");
    
    // Initial state: enabled with volume 70
    expect(getByTestId("sound-enabled")).toHaveTextContent("true");
    expect(getByTestId("volume")).toHaveTextContent("70");

    // Mute: should store current volume and set to 0
    act(() => {
      toggleButton.click();
    });
    expect(getByTestId("sound-enabled")).toHaveTextContent("false");
    expect(getByTestId("volume")).toHaveTextContent("0");
    expect(getByTestId("prev-volume")).toHaveTextContent("70");

    // Unmute: should restore previous volume
    act(() => {
      toggleButton.click();
    });
    expect(getByTestId("sound-enabled")).toHaveTextContent("true");
    expect(getByTestId("volume")).toHaveTextContent("70");
  });

  test("loads settings from localStorage on mount", () => {
    const savedSettings = JSON.stringify({
      volume: 85,
      soundEnabled: false,
      prevVolume: 60,
    });
    
    localStorageMock.getItem.mockReturnValue(savedSettings);

    const { getByTestId } = render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(getByTestId("volume")).toHaveTextContent("85");
    expect(getByTestId("sound-enabled")).toHaveTextContent("false");
    expect(getByTestId("prev-volume")).toHaveTextContent("60");
  });
});