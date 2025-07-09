'use client'

import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { MessageCircle, UploadCloud } from "lucide-react";

export default function AIMockExamBot() {
  const [syllabusText, setSyllabusText] = useState("");
  const [papers, setPapers] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      setSyllabusText(text);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setQuestions([]); // Clear previous questions
    try {
      const res = await fetch("http://localhost:3001/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syllabus: syllabusText.trim(),
          papers: papers.trim(), // Optional field
        }),
      });

      const data = await res.json();

      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        setQuestions(["Could not generate questions. Please try again."]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setQuestions(["Something went wrong. Please try again."]);
    }
    setLoading(false);
  };


  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🎓 AI Mock Examiner</h1>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Upload Syllabus (TXT or PDF)</label>
            <Input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
          </div>

          <Textarea
            placeholder="Or paste your syllabus manually..."
            rows={4}
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
          />

          <Textarea
            placeholder="Paste previous year questions here (optional)"
            rows={4}
            value={papers}
            onChange={(e) => setPapers(e.target.value)}
          />

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? "Generating Question..." : "Generate Question"}
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="text-blue-500" /> Generated Questions
            </h2>
            {questions.map((q, idx) => (
              <p key={idx} className="text-gray-800">
                Q{idx + 1}: {q}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

