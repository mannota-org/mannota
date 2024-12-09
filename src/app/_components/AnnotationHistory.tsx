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

const AnnotationHistory: React.FC = () => {
  const { data: history, isLoading } =
    api.medicalText.fetchAnnotationHistory.useQuery();
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
    <div className="h-full w-full overflow-hidden">
      <div className="relative h-full w-full items-center justify-center bg-white bg-dot-black/[0.4] dark:bg-black dark:bg-dot-white/[0.4]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>
        <h2 className="primary relative z-20 bg-gradient-to-b from-neutral-400 to-neutral-700 bg-clip-text pb-12 pt-24 text-center text-5xl font-bold text-transparent">
          Annotation History
        </h2>
      </div>

      <div className="px-8 py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Original Text</TableHead>
              <TableHead className="w-1/4">Annotated Text</TableHead>
              <TableHead className="w-1/8">Batch Info</TableHead>
              <TableHead className="w-1/8">Performance</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history?.map((entry) => (
              <React.Fragment key={entry.id}>
                <TableRow
                  onClick={() => setOpenDialog(entry.id)} // Open the dialog for this entry
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{entry.originalText}</TableCell>
                  <TableCell>{entry.annotatedText}</TableCell>
                  <TableCell>{entry.Batch}</TableCell>
                  <TableCell>{entry.Performance}</TableCell>
                  <TableCell>{entry.updatedAtFormatted}</TableCell>
                </TableRow>
                <Dialog
                  open={openDialog === entry.id}
                  onOpenChange={() => setOpenDialog(null)} // Close the dialog
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="pl-2">Annotation Details</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground">
                      <div className="grid gap-4">
                        <div>
                          <strong className="pl-2">Text:</strong>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="w-1/3">Original Text</TableCell>
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
                                <TableCell>{entry.updatedAtFormatted}</TableCell>
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
    </div>
  );
};

export default AnnotationHistory;
