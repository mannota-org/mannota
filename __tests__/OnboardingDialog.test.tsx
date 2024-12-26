import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OnboardingDialog } from "@/app/_components/Onboarding/OnboardingDialog";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock clerk/nextjs
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: {
      primaryEmailAddress: { emailAddress: "test@example.com" },
      fullName: "Test User",
    },
  }),
}));

// Mock trpc
jest.mock("@/trpc/react", () => ({
  api: {
    user: {
      checkUserExists: {
        useQuery: () => ({
          data: false,
          isSuccess: true,
        }),
      },
      checkAndCreateUser: {
        useMutation: () => ({
          mutateAsync: jest.fn(),
        }),
      },
    },
  },
}));

// Mock toast
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe("OnboardingDialog Component", () => {
  it("renders the dialog when user doesn't exist", async () => {
    render(<OnboardingDialog />);

    expect(screen.getByText("Welcome!")).toBeInTheDocument();
    expect(
      screen.getByText("Select your role to get started."),
    ).toBeInTheDocument();
  });

  it("displays role selection combobox", () => {
    render(<OnboardingDialog />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows save button", () => {
    render(<OnboardingDialog />);

    const saveButton = screen.getByText("Save changes");
    expect(saveButton).toBeInTheDocument();
  });

  it("prevents dialog from closing when clicking outside", () => {
    render(<OnboardingDialog />);

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);

    expect(dialog).toBeInTheDocument();
  });

  it("keeps dialog open when pressing escape key", () => {
    render(<OnboardingDialog />);

    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(dialog).toBeInTheDocument();
  });

  it("renders dialog content with correct styles", () => {
    render(<OnboardingDialog />);

    const dialogContent = screen.getByRole("dialog");
    expect(dialogContent).toHaveClass("sm:max-w-[425px]");
  });
});
