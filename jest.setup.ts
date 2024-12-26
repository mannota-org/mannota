import "@testing-library/jest-dom";

// Mock the tRPC API
jest.mock("@/trpc/react", () => ({
  api: {
    settings: {
      getSettings: {
        useQuery: () => ({
          data: { id: "1", confidenceThreshold: 0.5, dataPerBatch: 10 },
        }),
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
        useQuery: () => ({ data: [{ shortGuideline: "", longGuideline: "" }] }),
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
