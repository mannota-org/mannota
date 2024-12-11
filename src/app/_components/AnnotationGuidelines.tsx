import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface AnnotationGuidelinesProps {
  isModalOpen1: boolean;
  setIsModalOpen1: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen2: boolean;
  setIsModalOpen2: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnnotationGuidelines: React.FC<AnnotationGuidelinesProps> = ({
  isModalOpen1,
  setIsModalOpen1,
  isModalOpen2,
  setIsModalOpen2,
}) => {
  const taskDetails = `
  ### 1. Simplify:
  - **What it means:** Rephrasing complex medical terminology or detailed descriptions into more understandable language.
  
  - **Example:**
  - Complex: "The patient exhibits persistent dyspnea, associated with nonproductive cough and fatigue, likely indicating underlying chronic obstructive pulmonary disease (COPD)."
  - Simplified: "The patient has trouble breathing, a dry cough, and is feeling tired, which could mean they have chronic obstructive pulmonary disease (COPD)."
  
  ### 2. Translate:
  - **What it means:** Converting medical information from one language to another while preserving its accuracy and technical detail.
  
  - **Example:**
  - English text: "The patient was diagnosed with hypertension and prescribed an antihypertensive medication."
  - Vietnamese translation: "Bệnh nhân được chẩn đoán bị tăng huyết áp và được kê thuốc điều trị huyết áp cao."
  
  ### 3. Summarize:
  - **What it means:** Condensing lengthy medical records while retaining the most important information.
  
  - **Example:**
  - Original text: "The patient presents with a fever, cough, and shortness of breath, which started five days ago. Laboratory results indicate a bacterial infection, and the patient has been prescribed antibiotics."
  - Summary: "The patient has a bacterial infection with symptoms of fever, cough, and shortness of breath, and is being treated with antibiotics."
  `;

  const annotationDetails = `
  - Click "Start" to begin annotating the medical text. The "Annotate Text" box is disabled for editing until you click "Start".
  - Pause if needed, then resume the task.
  - When done, click "Stop & Submit" to submit your annotation. A message showing successful submission will be displayed.
  `;

  const taskExplanation = `
  - **Simplify**: Reword the text to make it easier to understand.
  - **Translate**: Convert English text into Vietnamese accurately.
  - **Summarize**: Shorten the text while keeping the essential points.
  `;

  const annotationGuidelines = `
  - Click "Start" to enable text annotating.
  - Pause if needed, then resume the task.
  - When done, click "Stop & Submit", a success message will be displayed.
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <h6 className="text-xl font-semibold text-center">Task Explanation</h6>
        <ReactMarkdown className="text-sm">{taskExplanation}</ReactMarkdown> 

        <div className="flex justify-end mt-4 pr-4">
          <Dialog open={isModalOpen1} onOpenChange={setIsModalOpen1}>
            <DialogTrigger asChild>
              <Button>More Details</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Task Details</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="space-y-4">
                  <ReactMarkdown>{taskDetails}</ReactMarkdown> 
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        <h6 className="text-xl font-semibold text-center">Annotation Guidelines</h6>
        <ReactMarkdown className="text-sm">{annotationDetails}</ReactMarkdown>

        <div className="flex justify-end mt-4 pr-4">
          <Dialog open={isModalOpen2} onOpenChange={setIsModalOpen2}>
            <DialogTrigger asChild>
              <Button>More Details</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[80vh] overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle>More Details</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <ReactMarkdown>{annotationGuidelines}</ReactMarkdown>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AnnotationGuidelines;
