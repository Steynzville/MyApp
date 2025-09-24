import { render, screen } from "@testing-library/react";
import App from "../App";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { SettingsProvider } from "../context/SettingsContext";

describe("App", () => {
  it("renders Login page for unauthenticated user", () => {
    render(
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>,
    );
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  });
});
