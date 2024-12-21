"use client";
import { useUser } from "@clerk/nextjs";
import Header from "./Layout/Header";
import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const AdminSettings = () => {
  const [dataPerBatch, setDataPerBatch] = useState("");
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [shortGuideline, setShortGuideline] = useState("");
  const [longGuideline, setLongGuideline] = useState("");

  const { data: settings } = api.settings.getSettings.useQuery();
  const updateSettings = api.settings.updateSettings.useMutation();
  const reassessBatches = api.settings.reassessBatches.useMutation();
  const { toast } = useToast();
  const { data: guidelines } = api.guideline.fetchGuidelines.useQuery();
  const updateGuideline = api.guideline.updateGuideline.useMutation();
  const utils = api.useContext();

  useEffect(() => {
    if (settings) {
      setConfidenceThreshold(settings.confidenceThreshold * 100);
    }
  }, [settings]);

  useEffect(() => {
    if (guidelines?.[0]) {
      setShortGuideline(guidelines[0].shortGuideline);
      setLongGuideline(guidelines[0].longGuideline);
    }
  }, [guidelines]);

  const handleDataPerBatchSubmit = async () => {
    if (!settings?.id) return;

    setIsLoading(true);

    try {
      await updateSettings.mutateAsync({
        id: settings.id,
        dataPerBatch: Number(dataPerBatch),
        confidenceThreshold: settings.confidenceThreshold,
      });

      await reassessBatches.mutateAsync({
        newBatchSize: Number(dataPerBatch),
      });

      toast({
        title: "Success",
        variant: "success",
        description: "Data per batch updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update data per batch. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfidenceSubmit = async () => {
    if (!settings?.id) return;

    setIsLoading(true);

    try {
      await updateSettings.mutateAsync({
        id: settings.id,
        dataPerBatch: settings.dataPerBatch,
        confidenceThreshold: confidenceThreshold / 100,
      });

      toast({
        title: "Success",
        variant: "success",
        description: "Confidence threshold updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update confidence threshold. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuidelineSubmit = async () => {
    if (!shortGuideline || !longGuideline) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Both short and long guidelines are required.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updateGuideline.mutateAsync({
        shortGuideline,
        longGuideline,
      });

      // Invalidate and refetch guidelines after successful update
      await utils.guideline.fetchGuidelines.invalidate();

      toast({
        title: "Success",
        variant: "success",
        description: "Guidelines updated successfully",
      });
    } catch (error) {
      console.error("Guideline update error:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update guidelines. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden">
      <Header title="Admin Settings" />
      <div className="px-56">
        <Tabs defaultValue="batch" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batch">Data per Batch</TabsTrigger>
            <TabsTrigger value="confidence">Confidence Threshold</TabsTrigger>
            <TabsTrigger value="guideline">Annotation Guideline</TabsTrigger>
          </TabsList>

          <TabsContent value="batch">
            <Card>
              <CardHeader>
                <CardTitle>Data Per Batch</CardTitle>
                <CardDescription>
                  <CardDescription>
                    Set the number of items per batch. This will reorganize
                    existing batches.
                  </CardDescription>
                  <div className="mt-2 flex items-center">
                    <Badge
                      variant="secondary"
                      className="px-3 py-2 text-red-600"
                    >
                      <TriangleAlert className="mr-2 h-4 w-4" /> This action
                      cannot be undone
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Label htmlFor="batchSize">Batch Size</Label>
                  <Input
                    id="batchSize"
                    type="number"
                    value={dataPerBatch}
                    onChange={(e) => setDataPerBatch(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleDataPerBatchSubmit} disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="confidence">
            <Card>
              <CardHeader>
                <CardTitle>Confidence Threshold</CardTitle>
                <CardDescription>
                  Set the confidence threshold (0-1). This threshold will be
                  used to fetch low confidence batches for annotations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Slider
                    value={[confidenceThreshold]}
                    max={100}
                    step={10}
                    className={cn("w-[60%]")}
                    onValueChange={(value) => {
                      if (value[0] !== undefined) {
                        setConfidenceThreshold(value[0]);
                      }
                    }}
                  />
                  <div className="mt-2 text-sm">
                    <Badge
                      variant="outline"
                      className="text-md bg-green-50 text-primary-800"
                    >
                      {confidenceThreshold / 100}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleConfidenceSubmit} disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="guideline">
            <Card>
              <CardHeader>
                <CardTitle>Annotation Guideline</CardTitle>
                <CardDescription>
                  Provide detailed short and long annotation guidelines for
                  annotators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="shortAnnotation">Short Annotation</Label>
                    <Textarea
                      id="shortAnnotation"
                      value={shortGuideline}
                      className="h-28 resize-none"
                      onChange={(e) => setShortGuideline(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longAnnotation">Long Annotation</Label>
                    <Textarea
                      id="longAnnotation"
                      value={longGuideline}
                      className="h-60 resize-none"
                      onChange={(e) => setLongGuideline(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGuidelineSubmit} disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
