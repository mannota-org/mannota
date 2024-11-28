"use client";

import React from "react";
import { SignedIn } from "@clerk/nextjs";
import { api } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const History = () => {
  const { data: history, isLoading } =
    api.medicalText.fetchAnnotationHistory.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SignedIn>
      <div className="">
        <div className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex h-[10rem] w-full items-center justify-center bg-white dark:bg-black">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
          <h2 className="primary relative z-20 mt-12 bg-gradient-to-b from-neutral-400 to-neutral-700 bg-clip-text text-center text-5xl font-bold text-transparent">
            Annotation Dashboard
          </h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Original Text</TableHead>
              <TableHead className="w-1/4">Annotated Text</TableHead>
              <TableHead className="w-1/8">Batch Info</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.originalText}</TableCell>
                <TableCell>{entry.annotatedText}</TableCell>
                <TableCell>{entry.Batch}</TableCell>
                <TableCell>{entry.updatedAtFormatted}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Link href="#" className="text-left font-bold">
                        View details
                      </Link>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="pl-2">
                          Annotation Details
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
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
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SignedIn>
  );
};

export default History;