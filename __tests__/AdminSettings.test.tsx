import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminSettings from "@/app/_components/AdminSettings";

jest.mock("@/trpc/react", () => ({
  api: {
    settings: {
      getSettings: {
        useQuery: () => ({ data: null }),
      },
      updateSettings: {
        useMutation: () => ({ mutateAsync: jest.fn() }),
      },
      reassessBatches: {
        useMutation: () => ({ mutateAsync: jest.fn() }),
      },
    },
    guideline: {
      fetchGuidelines: {
        useQuery: () => ({ data: null }),
      },
      updateGuideline: {
        useMutation: () => ({ mutateAsync: jest.fn() }),
      },
    },
    useContext: () => ({
      guideline: {
        fetchGuidelines: {
          invalidate: jest.fn(),
        },
      },
    }),
  },
}));

describe("AdminSettings Component", () => {
  it("renders the tabs", () => {
    render(<AdminSettings />);
    const batchTab = screen.queryByRole("tab", { name: /data per batch/i });
    const confidenceTab = screen.queryByRole("tab", {
      name: /confidence threshold/i,
    });
    const guidelineTab = screen.queryByRole("tab", {
      name: /annotation guideline/i,
    });

    expect(batchTab).toBeInTheDocument();
    expect(confidenceTab).toBeInTheDocument();
    expect(guidelineTab).toBeInTheDocument();
  });

  it("renders the batch size input when batch tab is selected", () => {
    render(<AdminSettings />);
    const batchTab = screen.getByRole("tab", { name: /data per batch/i });
    fireEvent.click(batchTab);

    const batchSizeInput = screen.getByLabelText(/batch size/i);
    expect(batchSizeInput).toBeInTheDocument();
  });

  it("shows save changes button in batch tab", () => {
    render(<AdminSettings />);
    const batchTab = screen.getByRole("tab", { name: /data per batch/i });
    fireEvent.click(batchTab);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeInTheDocument();
  });

  it("shows warning message about batch size changes", () => {
    render(<AdminSettings />);
    const batchTab = screen.getByRole("tab", { name: /data per batch/i });
    fireEvent.click(batchTab);

    const warningMessage = screen.getByText(/this action cannot be undone/i);
    expect(warningMessage).toBeInTheDocument();
  });
});
