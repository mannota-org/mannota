import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AnnotationText from "@/app/\_components/AnnotationText";

jest.mock("@/trpc/react", () => ({
api: {
guideline: {
fetchGuidelines: {
useQuery: () => ({
data: [
{
shortGuideline: "Test short guideline",
longGuideline: "Test long guideline",
},
],
}),
},
},
},
}));

const mockProps = {
editableText: "Test editable text",
setEditableText: jest.fn(),
annotateReason: "Test reason",
setAnnotateReason: jest.fn(),
isRunning: true,
isPaused: false,
isSubmitting: false,
seconds: 30,
textLeftToAnnotate: 5,
totalTextInBatch: 10,
handleStartPauseResume: jest.fn(),
handleSubmit: jest.fn(),
};

describe("AnnotationText Component", () => {
it("renders editable textarea with correct value", () => {
render(<AnnotationText {...mockProps} />);
const textarea = screen.getByRole("textbox", { name: /annotate text/i });
expect(textarea).toHaveValue(mockProps.editableText);
expect(textarea).not.toBeDisabled();
});

it("handles play/pause button interactions", () => {
render(<AnnotationText {...mockProps} />);
const button = screen.getByRole("button", { name: /pause/i });
fireEvent.click(button);
expect(mockProps.handleStartPauseResume).toHaveBeenCalled();
});

it("displays correct remaining text count", () => {
render(<AnnotationText {...mockProps} />);
expect(screen.getByText(`5/10 text(s) left`)).toBeInTheDocument();
});

it("shows loading state when submitting", () => {
render(<AnnotationText {...mockProps} isSubmitting={true} />);
expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
});

it("displays guidelines section", () => {
render(<AnnotationText {...mockProps} />);
expect(screen.getByText("Test short guideline")).toBeInTheDocument();
});
});
