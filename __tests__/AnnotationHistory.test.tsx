import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AnnotationHistory from "@/app/_components/AnnotationHistory";

jest.mock("@/trpc/react", () => ({
  api: {
    medicalText: {
      fetchAnnotationHistory: {
        useQuery: () => ({
          data: {
            history: [
              {
                id: "1",
                originalText: "Sample text",
                annotatedText: "Annotated sample",
                Batch: 1,
                Performance: 0.8,
                User: { name: "John Doe" },
                updatedAtFormatted: "2024-01-01",
                task: "Classification",
                annotateTime: 30,
                annotateReason: "Test reason",
                email: "john@example.com",
                role: "Annotator",
              },
            ],
            totalCount: 1,
          },
          isLoading: false,
        }),
      },
    },
  },
}));

describe("AnnotationHistory Component", () => {
  it("renders the component title", () => {
    render(<AnnotationHistory />);
    expect(screen.getByText("Annotation History")).toBeInTheDocument();
  });

  it("renders the table headers correctly", () => {
    render(<AnnotationHistory />);
    const headers = [
      "Original Text",
      "Annotated Text",
      "Batch",
      "PScore",
      "Annotator",
      "Updated At",
    ];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("displays annotation data in the table", () => {
    render(<AnnotationHistory />);
    expect(screen.getByText("Sample text")).toBeInTheDocument();
    expect(screen.getByText("Annotated sample")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders a table element", () => {
    render(<AnnotationHistory />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
