"use client";

import { api } from "@/trpc/react";
import { useState } from "react";

export default function DeleteText() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<string>("");

  const deleteAnnotations = api.medicalText.deleteAnnotations.useMutation({
    onSuccess: (data) => {
      setResult(`Successfully reset ${data.count} annotations`);
      setIsDeleting(false);
    },
    onError: (error) => {
      setResult(`Error: ${error.message}`);
      setIsDeleting(false);
    },
  });

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete annotations? This cannot be undone.",
      )
    ) {
      setIsDeleting(true);
      setResult("");
      deleteAnnotations.mutate();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Delete Text Annotations</h1>
      <button
        className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete First 50 Annotations"}
      </button>
      {result && <p className="mt-4 text-gray-700">{result}</p>}
    </div>
  );
}
