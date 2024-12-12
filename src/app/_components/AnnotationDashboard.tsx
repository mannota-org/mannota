"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Header from "./Layout/Header";
import Link from "next/link";

const AnnotationDashboard: React.FC = () => {
  const [editableText, setEditableText] = useState("");
  const [annotateReason, setAnnotateReason] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [updatePerformanceShown, setUpdatePerformanceShown] = useState(false);
  const [nextBatchShown, setNextBatchShown] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user } = useUser();
  const { toast } = useToast();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const {
    data,
    isLoading,
    isError,
    refetch: refetchMedicalText,
  } = api.medicalText.fetchMedicalText.useQuery();

  const updateMedicalTextMutation =
    api.medicalText.updateMedicalText.useMutation({
      onSuccess: () => {
        void refetchMedicalText();
      },
    });

  const updateBatchPerformanceMutation =
    api.batch.updateBatchPerformance.useMutation({
      onSuccess: () => {
        setUpdatePerformanceShown(false);
        setNextBatchShown(true);
      },
    });

  const { data: userData, error: userError } = api.user.getUserByEmail.useQuery(
    { email },
    {
      enabled: !!email,
    },
  );

  useEffect(() => {
    if (userError) {
      console.error("Failed to fetch user data:", userError);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to fetch user data.",
      });
    }
  }, [userError, toast]);

  useEffect(() => {
    if (data?.medicalText && data.medicalText.length > 0) {
      setEditableText(data?.medicalText[0]?.originalText ?? "");
      setSeconds(0);
      setIsRunning(false);
      setIsPaused(false);
      setUpdatePerformanceShown(false);
    } else {
      setEditableText("N/A");
      setUpdatePerformanceShown(true);
      console.warn("Medical text data is empty or undefined");
    }
  }, [data]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleSubmit = async () => {
    if (!data?.medicalText?.length || !userData) return;

    setIsSubmitting(true);

    try {
      await updateMedicalTextMutation.mutateAsync({
        id: data.medicalText[0]?.id ?? "",
        annotatedText: editableText,
        confidence: 1,
        annotateReason,
        annotateTime: seconds,
        userId: userData.id,
      });

      // toast success
      toast({
        title: "Success",
        variant: "success",
        description: "Medical text annotated successfully",
      });

      setAnnotateReason("");
    } catch (error) {
      console.error("Error updating medical text:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to annotate medical text. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setIsRunning(false);
      setSeconds(0);
      if (!data?.medicalText?.length) {
        setUpdatePerformanceShown(true);
      }
    }
  };

  const handleUpdatePerformance = async () => {
    if (!data?.batch) return;

    try {
      await updateBatchPerformanceMutation.mutateAsync({
        batchId: data.batch.id,
      });
      toast({
        title: "Success",
        variant: "success",
        description: "Batch performance updated successfully",
      });
      setUpdatePerformanceShown(false);
      setNextBatchShown(true);
    } catch (error) {
      console.error("Error updating batch performance:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update batch performance. Please try again.",
      });
    }
  };

  const handleFetchNextBatch = async () => {
    try {
      await refetchMedicalText();
      if (!data?.medicalText?.length) {
        toast({
          title: "Annotation Completed",
          variant: "success",
          description: "All batches have been completed.",
        });
      }
      setNextBatchShown(false);
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to fetch the next batch. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || (isError && !data.medicalText?.length)) {
    return <div>No medical text available</div>;
  }

  const { medicalText, batch, textLeftToAnnotate, totalTextInBatch } = data;

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Header title="Annotation Dashboard" />

      <div className="flex flex-col space-y-4 py-4 md:flex-row md:space-x-4 md:space-y-0 md:px-8">
        <Card className="relative z-30 flex-1 pt-8">
          <CardContent className="flex h-full flex-col justify-between">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label>Sample Text</Label>
                <Textarea
                  value={medicalText?.[0]?.originalText ?? "N/A"}
                  readOnly
                  className="resize-none bg-gray-100 text-gray-700"
                  disabled
                />
              </div>
              {!updatePerformanceShown && !nextBatchShown && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <Badge
                      variant="outline"
                      className="border-orange-200 bg-yellow-50 text-sm text-orange-500"
                    >
                      Task: {medicalText?.[0]?.task ?? "N/A"}
                    </Badge>
                    <br />
                    <Badge
                      variant="outline"
                      className="border-sky-200 bg-sky-50 text-sm text-sky-600"
                    >
                      Confidence:{" "}
                      {medicalText?.[0]?.confidence?.toFixed(1) ?? "N/A"}
                    </Badge>
                    <br />
                    <Badge
                      variant="outline"
                      className="border-purple-200 bg-purple-50 text-sm text-purple-600"
                    >
                      Batch: {batch?.index ?? "N/A"}
                    </Badge>
                    <br />
                    <Badge
                      variant="outline"
                      className="border-default-200 bg-default-50 text-sm font-normal text-gray-700"
                    >
                      {textLeftToAnnotate ?? "N/A"} /{" "}
                      {totalTextInBatch ?? "N/A"} text(s) left to annotate.{" "}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="my-8 border-t border-gray-300"></div> */}
            <Card className="mt-12 w-full border-none bg-gray-100 p-4 shadow-none">
              Task Explanation Simplify: Reword the text to make it easier to
              understand. Translate: Convert English text into Vietnamese
              accurately. Summarize: Shorten the text while keeping the
              essential points.
              <br></br>
              <Button className="mt-2" variant="outline" size="sm">
                View details <ArrowRight />
              </Button>
            </Card>
          </CardContent>
        </Card>

        <Card className="relative z-30 flex-1 pt-8">
          <CardContent className="flex h-full flex-col justify-between">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="annotate-text">Annotate Text</Label>
                <Textarea
                  id="annotate-text"
                  value={editableText || ""}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="mb-2"
                  disabled={!isRunning || isPaused}
                />
              </div>
              {!updatePerformanceShown && !nextBatchShown && (
                <>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="annotate-reason">Annotate Reason</Label>
                    <Input
                      id="annotate-reason"
                      value={annotateReason || ""}
                      onChange={(e) => setAnnotateReason(e.target.value)}
                      placeholder="Give your reason for annotating"
                      className="mb-2"
                      disabled={!isRunning || isSubmitting}
                    />
                  </div>
                  <div className="flex flex-wrap space-x-2">
                    <Button
                      onClick={startTimer}
                      disabled={isRunning}
                      className="bg-primary-800"
                    >
                      Start
                    </Button>
                    <Button
                      onClick={isPaused ? resumeTimer : pauseTimer}
                      disabled={!isRunning}
                      className="bg-primary-800"
                    >
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                      onClick={() => {
                        stopTimer();
                        void handleSubmit();
                      }}
                      disabled={!isRunning || isSubmitting}
                      className="bg-primary-800"
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Stop & Submit
                    </Button>
                    <Badge
                      variant="outline"
                      className="bg-white-100 border-primary-300 text-base text-primary-800"
                    >
                      Time: {seconds}s
                    </Badge>
                  </div>
                </>
              )}
            </div>

            {updatePerformanceShown && (
              <Button onClick={handleUpdatePerformance}>
                Update Batch Performance
              </Button>
            )}
            {nextBatchShown && (
              <Button onClick={handleFetchNextBatch}>
                Annotate Next Batch
              </Button>
            )}
            {/* <div className="my-8 border-t border-gray-300"></div> */}
            <Card className="mt-12 w-full border-none bg-gray-100 p-4 shadow-none">
              Task Explanation Simplify: Reword the text to make it easier to
              understand. Translate: Convert English text into Vietnamese
              accurately. Summarize: Shorten the text while keeping the
              essential points.
              <br></br>
              <Button className="mt-2" variant="outline" size="sm">
                View details <ArrowRight />
              </Button>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnotationDashboard;
