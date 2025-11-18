"use client";
import { useEffect, useRef, useState } from "react";
import { AppShell, Container } from "../../components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/Button";

export default function VoiceAgentPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (res.ok) setCourses(data.courses || []);
      } catch (e) {
        console.warn("Failed to load courses", e);
      }
    })();
  }, []);

  const startRecording = async () => {
    setError("");
    setTranscript("");
    setAnswer("");
    setAudioSrc("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        void sendAudio();
      };
      mr.start();
      setRecording(true);
    } catch (e) {
      setError(e.message || "Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudio = async () => {
    if (!selectedCourse) {
      setError("Please select a course first");
      return;
    }
    if (chunksRef.current.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob, "recording.webm");
      fd.append("courseId", selectedCourse);

      const res = await fetch("/api/voice/turn", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Voice agent failed");

      setTranscript(data.transcript || "");
      setAnswer(data.text || "");
      setAudioSrc(data.audio || "");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      chunksRef.current = [];
    }
  };

  return (
    <AppShell showBackground={true}>
      <Container size="lg" className="py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Voice Agent</h1>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">{error}</div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Speech-to-Speech</CardTitle>
            <CardDescription>Ask verbally and get a spoken answer powered by GPT-4.1</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <select className="w-full rounded border bg-transparent p-2" value={selectedCourse} onChange={(e)=>setSelectedCourse(e.target.value)}>
                  <option value="">Select course</option>
                  {courses.map(c => (
                    <option key={c.courseId} value={c.courseId}>{c.name} ({c.courseId})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Controls</label>
                <div className="flex gap-2">
                  {!recording ? (
                    <Button disabled={loading} onClick={startRecording}>{loading ? 'Please wait...' : 'Start Recording'}</Button>
                  ) : (
                    <Button variant="destructive" onClick={stopRecording}>Stop Recording</Button>
                  )}
                </div>
              </div>
            </div>

            {(transcript || answer || audioSrc) && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Transcript</div>
                  <div className="text-sm whitespace-pre-wrap border rounded p-2 min-h-16 bg-black/20">{transcript || '—'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">AI Answer</div>
                  <div className="text-sm whitespace-pre-wrap border rounded p-2 min-h-16 bg-black/20">{answer || '—'}</div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium">Audio</div>
                  {audioSrc ? (
                    <audio src={audioSrc} controls />
                  ) : (
                    <div className="text-sm text-muted-foreground">No audio yet</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </AppShell>
  );
}
