"use client";

import { api } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Header from "./Layout/Header";

const AnnotationHistory: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading } = api.medicalText.fetchAnnotationHistory.useQuery({
    page,
    limit,
  });

  const totalPages = data ? Math.ceil(data.totalCount / limit) : 0;
  // const totalPages = history ? Math.ceil(history.totalCount / limit) : 0;
  const [openDialog, setOpenDialog] = React.useState<string | null>(null); // To track which dialog is open

  React.useEffect(() => {
    if (history === undefined || history.length === 0) {
      console.warn("No annotation history data available");
    }
  }, [history]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden">
      <Header title="Annotation History" />
      <div className="flex flex-1 flex-col overflow-hidden px-8">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Original Text</TableHead>
                <TableHead className="w-1/3">Annotated Text</TableHead>
                <TableHead className="text-center">Batch</TableHead>
                <TableHead className="text-center">PScore</TableHead>
                <TableHead className="text-center">Annotator</TableHead>
                <TableHead className="w-1/10 text-center">Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.history.map((entry) => (
                <React.Fragment key={entry.id}>
                  <TableRow
                    onClick={() => setOpenDialog(entry.id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell>{entry.originalText}</TableCell>
                    <TableCell>{entry.annotatedText}</TableCell>
                    <TableCell className="text-center">{entry.Batch}</TableCell>
                    <TableCell className="text-center">
                      {entry.Performance}
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.User?.name}
                    </TableCell>
                    <TableCell className="whitespace-pre text-center">
                      {entry.updatedAtFormatted}
                    </TableCell>
                  </TableRow>
                  <Dialog
                    open={openDialog === entry.id}
                    onOpenChange={() => setOpenDialog(null)}
                  >
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="pl-2">
                          Annotation Details
                        </DialogTitle>
                      </DialogHeader>
                      <div className="text-sm text-muted-foreground">
                        <div className="grid gap-4">
                          <div>
                            <strong className="pl-2">Text:</strong>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="w-1/3">
                                    Original Text
                                  </TableCell>
                                  <TableCell>{entry.originalText}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Annotated Text</TableCell>
                                  <TableCell>{entry.annotatedText}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Task</TableCell>
                                  <TableCell>{entry.task}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Batch</TableCell>
                                  <TableCell>{entry.Batch}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Performance</TableCell>
                                  <TableCell>{entry.Performance}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Annotation Time</TableCell>
                                  <TableCell>{entry.annotateTime}s</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Updated</TableCell>
                                  <TableCell>
                                    {entry.updatedAtFormatted}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Reason</TableCell>
                                  <TableCell>{entry.annotateReason}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          <div>
                            <strong className="pl-2">Annotator:</strong>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="w-1/3">Name</TableCell>
                                  <TableCell>{entry.User?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Email</TableCell>
                                  <TableCell>{entry.User?.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Role</TableCell>
                                  <TableCell>{entry.User?.role}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mb-6 mt-2">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              />
              {Array.from({ length: totalPages }, (_, index) => {
                const pageIndex = index + 1;
                const isNearCurrentPage = Math.abs(pageIndex - page) <= 2;
                const isFirstFewPages = pageIndex <= 3;
                const isLastFewPages = pageIndex > totalPages - 3;

                if (isNearCurrentPage || isFirstFewPages || isLastFewPages) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={page === pageIndex}
                        onClick={() => setPage(pageIndex)}
                        disabled={page === pageIndex}
                      >
                        {pageIndex}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (pageIndex === 4 && page > 4) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                if (pageIndex === totalPages - 3 && page < totalPages - 3) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}
              <PaginationNext
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
              />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default AnnotationHistory;
