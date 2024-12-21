"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Header from "./Layout/Header";
import SampleText from "./SampleText";
import AnnotationText from "./AnnotationText";
import { Button } from "@/components/ui/button";

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

  const { user } = useUser();
  const { toast } = useToast();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const {
    data,
    isLoading,
    isError,
    refetch: refetchMedicalText,
  } = api.medicalText.fetchMedicalText.useQuery();

  const settingsData = api.settings.getSettings.useQuery();

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

  const checkConfidenceMutation = api.medicalText.checkTextConfidence.useQuery(
    { id: data?.medicalText?.[0]?.id ?? "" },
    { enabled: false },
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

  const handleStartPauseResume = () => {
    if (!isRunning) {
      startTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const handleSubmit = async () => {
    if (!data?.medicalText?.length || !userData) return;

    setIsSubmitting(true);

    try {
      // Check confidence before submitting
      const confidenceCheck = await checkConfidenceMutation.refetch();
      if (confidenceCheck.data?.confidence === 1) {
        toast({
          title: "Already Annotated",
          variant: "destructive",
          description: "This text has already been annotated by someone else.",
        });
        await refetchMedicalText();
        return;
      }

      await updateMedicalTextMutation.mutateAsync({
        id: data.medicalText[0]?.id ?? "",
        annotatedText: editableText,
        confidence: 1,
        annotateReason,
        annotateTime: seconds,
        userId: userData.id,
      });

      toast({
        title: "Success",
        variant: "success",
        description: "Medical text annotated successfully",
      });

      setAnnotateReason("");
    } catch (error) {
      console.error("Error updating medical text:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to annotate medical text. Please try again.";
      toast({
        title: "Error",
        variant: "destructive",
        description: errorMessage,
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

      <div className="mb-16 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:px-8 lg:px-52">
        <Card className="relative z-30 flex-1 pb-2 pt-8">
          <CardContent className="flex flex-col justify-between">
            <SampleText
              medicalText={medicalText?.[0]?.originalText ?? "N/A"}
              task={medicalText?.[0]?.task ?? "N/A"}
              confidence={medicalText?.[0]?.confidence ?? 0}
              batchIndex={batch?.index ?? 0}
              confidenceThreshold={settingsData?.data?.confidenceThreshold ?? 0}
              dataPerBatch={settingsData?.data?.dataPerBatch ?? 0}
            />
            {!updatePerformanceShown && !nextBatchShown && (
              <AnnotationText
                editableText={editableText}
                setEditableText={setEditableText}
                annotateReason={annotateReason}
                setAnnotateReason={setAnnotateReason}
                isRunning={isRunning}
                isPaused={isPaused}
                isSubmitting={isSubmitting}
                seconds={seconds}
                textLeftToAnnotate={textLeftToAnnotate ?? 0}
                totalTextInBatch={totalTextInBatch ?? 0}
                handleStartPauseResume={handleStartPauseResume}
                handleSubmit={() => {
                  stopTimer();
                  void handleSubmit();
                }}
              />
            )}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnotationDashboard;
