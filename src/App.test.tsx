import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App Component", () => {
  test("renders loading message initially", () => {
    render(<App latitude={0} longitude={0} />);
    const loadingElement = screen.getByText(/Loading.../i);
    expect(loadingElement).toBeInTheDocument();
  });

  test("renders weather data after loading", async () => {
    const fakeWeatherData = {
      data: {
        main: { temp: 20 },
        weather: [{ description: "clear sky" }],
        name: "Test City",
      },
    };

    mockedAxios.get.mockResolvedValueOnce(fakeWeatherData);

    render(<App latitude={0} longitude={0} />);

    // Wait for the city name to appear
    await waitFor(() => {
      expect(screen.getByText(/Weather in Test City/i)).toBeInTheDocument();
    });

    // Now that we know the data has loaded, we can check for the other elements
    expect(screen.getByText(/Temperature: 20°C/i)).toBeInTheDocument();
    expect(screen.getByText(/Condition: clear sky/i)).toBeInTheDocument();
  });
});
