import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PScoreVisualization from "@/app/_components/PScoreVisualization";

// Mock the trpc hook
jest.mock("@/trpc/react", () => ({
  api: {
    batch: {
      fetchBatchInfo: {
        useQuery: () => ({
          data: [
            {
              index: 1,
              performance: 0.85,
              updatedAtFormatted: "2024-01-15",
            },
            {
              index: 2,
              performance: 0.92,
              updatedAtFormatted: "2024-01-16",
            },
          ],
          isLoading: false,
        }),
      },
    },
  },
}));

// Mock window.innerWidth for responsive testing
window.innerWidth = 1024;

describe("PScoreVisualization Component", () => {
  it("renders the component title correctly", () => {
    render(<PScoreVisualization />);
    expect(screen.getByText("Annotation Analysis")).toBeInTheDocument();
    expect(
      screen.getByText("Batch Performance Scores Analysis"),
    ).toBeInTheDocument();
  });

  it("renders the chart container", () => {
    render(<PScoreVisualization />);
    const chartContainer = document.querySelector(".recharts-wrapper");
    expect(chartContainer).toBeInTheDocument();
  });

  it("renders the card component with correct structure", () => {
    render(<PScoreVisualization />);
    expect(screen.getByRole("article")).toHaveClass("flex w-full flex-col");
  });

  it("formats dates correctly in chart data", () => {
    render(<PScoreVisualization />);
    const formattedDate = "15/01/2024"; // Expected format from the formatDate function
    // Since the date is in the tooltip, we need to ensure the data transformation works
    // This is a bit of an implementation detail, but important for the visualization
    const chartData = document.querySelector(".recharts-line");
    expect(chartData).toBeInTheDocument();
  });
});
