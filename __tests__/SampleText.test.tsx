import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SampleText from "@/app/_components/SampleText";

const mockProps = {
  medicalText: "Sample medical text for testing",
  task: "Classification",
  confidence: 0.85,
  batchIndex: 1,
  confidenceThreshold: 0.75,
  dataPerBatch: 10,
};

describe("SampleText Component", () => {
  it("renders the medical text in a textarea", () => {
    render(<SampleText {...mockProps} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue(mockProps.medicalText);
    expect(textarea).toBeDisabled();
  });

  it("displays all badge information correctly", () => {
    render(<SampleText {...mockProps} />);
    expect(screen.getByText(`Task: ${mockProps.task}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Batch: ${mockProps.batchIndex}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Batch CS: ${mockProps.confidence.toFixed(1)}`),
    ).toBeInTheDocument();
  });
});
