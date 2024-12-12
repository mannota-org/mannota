"use client";
import { useUser } from "@clerk/nextjs";
import Header from "./Layout/Header";
import { api } from "@/trpc/react";
import { useState } from "react";
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

const AdminSettings = () => {
  const [dataPerBatch, setDataPerBatch] = useState("");
  const [confidenceThreshold, setConfidenceThreshold] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: settings } = api.settings.getSettings.useQuery();
  const updateSettings = api.settings.updateSettings.useMutation();
  const reassessBatches = api.settings.reassessBatches.useMutation();
  const { toast } = useToast();

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
        confidenceThreshold: Number(confidenceThreshold),
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
                <CardTitle>Data per Batch</CardTitle>
                <CardDescription>
                  Set the number of items per batch. This will reorganize
                  existing batches.
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
                  Set the confidence threshold for annotations (0-1).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Label htmlFor="confidence">Confidence</Label>
                  <Input
                    id="confidence"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleConfidenceSubmit} disabled={isLoading}>
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
