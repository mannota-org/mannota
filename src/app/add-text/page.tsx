"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function AddText() {
  const [medicalTextInput, setMedicalTextInput] = useState("");
  const [batchInput, setBatchInput] = useState("");

  const { toast } = useToast();

  const addMedicalTextMutation = api.medicalText.addMedicalText.useMutation({
    onSuccess: (data) => {
      setMedicalTextInput(""); // Clear input after success
      toast({
        title: "Success",
        description: "Medical text added successfully.",
      });
      console.log("Medical text added:", data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to add medical text.",
      });
      console.error("Error adding medical text:", error);
    },
  });

  const addBatchMutation = api.batch.addBatch.useMutation({
    onSuccess: (data) => {
      setBatchInput(""); // Clear input after success
      toast({
        title: "Success",
        description: "Batch added successfully.",
      });
      console.log("Batch added:", data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to add batch.",
      });
      console.error("Error adding batch:", error);
    },
  });

  const handleMedicalTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = JSON.parse(medicalTextInput);
      await addMedicalTextMutation.mutateAsync(formData);
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Invalid JSON format for medical text.",
      });
      console.error("JSON parse error:", error);
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = JSON.parse(batchInput);
      await addBatchMutation.mutateAsync(formData);
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Invalid JSON format for batch.",
      });
      console.error("JSON parse error:", error);
    }
  };

  return (
    <div className="mt-24">
      <h1 className="font-bold">Add Medical Text</h1>
      <div className="flex gap-2">
        <textarea
          value={JSON.stringify(
            {
              originalText: "Sample medical text",
              task: "Simplify OR Summarize OR Translate",
              confidence: 0.9,
              annotateReason: "Sample reason",
              annotateTime: 120,
              userId:
                "6747497d616992da7c23bbe7 OR 6743e69ef8b056be93eaf750 OR 6743e331f8b056be93eaf74e OR 6743e1edf8b056be93eaf74d",
              batchId:
                "6746de9a334cf53948e7f9b5 OR 6746dea2334cf53948e7f9b6 OR 6746deaf334cf53948e7f9b7",
            },
            null,
            2,
          )}
          readOnly
          style={{ width: "45%", height: "375px" }}
          placeholder="Example JSON"
        />
        <form onSubmit={handleMedicalTextSubmit} style={{ width: "45%" }}>
          <textarea
            value={medicalTextInput}
            onChange={(e) => setMedicalTextInput(e.target.value)}
            style={{ width: "100%", height: "375px" }}
            placeholder='{"originalText": "...", "task": "...", "confidence": 0, "annotateReason": "...", "annotateTime": 0, "userId": "...", "batchId": "..."}'
          />
          <Button type="submit">Add Medical Text</Button>
        </form>
      </div>

      <h1 className="mt-8 font-bold">Add Batch</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <textarea
          value={JSON.stringify(
            {
              index: 1,
              confidence: 0.75,
              performance: 85.5,
            },
            null,
            2,
          )}
          readOnly
          style={{ width: "45%", height: "150px" }}
          placeholder="Example JSON"
        />
        <form onSubmit={handleBatchSubmit} style={{ width: "45%" }}>
          <textarea
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            style={{ width: "100%", height: "150px" }}
            placeholder='{"index": 0, "confidence": 0, "performance": 0}'
          />
          <Button type="submit">Add Batch</Button>
        </form>
      </div>
    </div>
  );
}
