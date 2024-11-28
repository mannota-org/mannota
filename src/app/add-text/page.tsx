"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";

export default function AddText() {
  const [formData, setFormData] = useState({
    originalText: "",
    task: "",
    confidence: 0,
    annotateReason: "",
    annotateTime: 0,
    userId: "",
    batchId: "",
  });

  const [batchData, setBatchData] = useState({
    index: 0,
    confidence: 0,
    performance: 0,
  });

  const { toast } = useToast();

  const addMedicalTextMutation = api.medicalText.addMedicalText.useMutation({
    onSuccess: (data) => {
      setFormData({
        originalText: "",
        task: "",
        confidence: 0,
        annotateReason: "",
        annotateTime: 0,
        userId: "",
        batchId: "",
      });
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
      setBatchData({
        index: 0,
        confidence: 0,
        performance: 0,
      });
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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBatchData((prev) => ({
      ...prev,
      [name]: parseFloat(value), // Ensure number type
    }));
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMedicalTextMutation.mutateAsync({
        ...formData,
        confidence: parseFloat(formData.confidence.toString()), // Ensure number type
        annotateTime: parseInt(formData.annotateTime.toString(), 10), // Ensure number type
      });
    } catch (error) {
      console.error("Mutation execution error:", error);
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBatchMutation.mutateAsync(batchData);
    } catch (error) {
      console.error("Mutation execution error:", error);
    }
  };

  return (
    <div>
      <h1>Add Medical Text</h1>
      <form onSubmit={handleTextSubmit}>
        <input
          type="text"
          name="originalText"
          value={formData.originalText}
          onChange={handleTextChange}
          placeholder="Original Text"
          required
        />
        <input
          type="text"
          name="task"
          value={formData.task}
          onChange={handleTextChange}
          placeholder="Task"
          required
        />
        <input
          type="number"
          name="confidence"
          value={formData.confidence}
          onChange={handleTextChange}
          step="0.01"
          placeholder="Confidence"
          required
        />
        <input
          type="text"
          name="annotateReason"
          value={formData.annotateReason}
          onChange={handleTextChange}
          placeholder="Annotate Reason"
        />
        <input
          type="number"
          name="annotateTime"
          value={formData.annotateTime}
          onChange={handleTextChange}
          placeholder="Annotate Time"
          required
        />
        <input
          type="text"
          name="userId"
          value={formData.userId}
          onChange={handleTextChange}
          placeholder="User ID"
        />
        <input
          type="text"
          name="batchId"
          value={formData.batchId}
          onChange={handleTextChange}
          placeholder="Batch ID"
        />
        <button type="submit">Add Text</button>
      </form>

      <h1>Add Batch</h1>
      <form onSubmit={handleBatchSubmit}>
        <input
          type="number"
          name="index"
          value={batchData.index}
          onChange={handleBatchChange}
          placeholder="Index"
          required
        />
        <input
          type="number"
          name="confidence"
          value={batchData.confidence}
          onChange={handleBatchChange}
          step="0.01"
          placeholder="Confidence"
          required
        />
        <input
          type="number"
          name="performance"
          value={batchData.performance}
          onChange={handleBatchChange}
          step="0.01"
          placeholder="Performance"
          required
        />
        <button type="submit">Add Batch</button>
      </form>
    </div>
  );
}
