"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import type { MedicalTextDataInput, BatchInput } from "@/app/types/types";

const AddText = () => {
  const [medicalTextInput, setMedicalTextInput] = useState<string>("");
  const [batchInput, setBatchInput] = useState<string>("");

  const { toast } = useToast();

  const addMedicalTextMutation = api.medicalText.addMedicalText.useMutation({
    onSuccess: (data) => {
      setMedicalTextInput("");
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
      const formData = JSON.parse(medicalTextInput) as MedicalTextDataInput;
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
      const formData = JSON.parse(batchInput) as BatchInput;
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
                "6743e1edf8b056be93eaf74d OR 6743e331f8b056be93eaf74e OR 674990164731915987b05ba6 OR 6751ccfe3c8d7e1c32f2e2ea OR 6755934b30abc228bc3b71d7 OR 67508881ca0559fba3bc9a30",
              batchId:
                "675aed1a8a6fa24d2bad9787 OR 675aed1c8a6fa24d2bad9788 OR 675aed1e8a6fa24d2bad9789",
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
              performance: 0.5,
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
};

export default AddText;
