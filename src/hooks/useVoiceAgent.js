import { useCallback, useMemo, useRef, useState } from "react";

function formatTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useVoiceAgent({ token, courseId, onMessages } = {}) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [quota, setQuota] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const resetStream = useCallback(() => {
    mediaRecorderRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    chunksRef.current = [];
  }, []);

  const appendVoiceMessages = useCallback(
    ({ transcript, answer, audio, replyType, greeting, quota: quotaInfo }) => {
      const timestamp = formatTimestamp();
      const entries = [];
      if (transcript) {
        entries.push({
          id: Date.now(),
          sender: "user",
          text: transcript,
          timestamp,
          meta: { source: "voice" },
        });
      }
      entries.push({
        id: Date.now() + 1,
        sender: "bot",
        text: answer || "Let me think about that and get back to you.",
        timestamp,
        audio: replyType === "audio" ? audio : null,
        meta: {
          replyType,
          greeting,
          source: "voice",
          quota: quotaInfo,
        },
      });
      onMessages?.(entries);
    },
    [onMessages]
  );

  const playAudio = useCallback((base64) => {
    if (!base64) return;
    const audio = new Audio(base64);
    audio.play().catch(() => {
      // Autoplay might be blocked; ignore silently
    });
  }, []);

  const startRecording = useCallback(async () => {
    if (processing || recording) return;
    if (!courseId) {
      setError("Choose a course so I know what to answer.");
      return;
    }
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setRecording(false);
        setStatus("processing");
        try {
          if (chunksRef.current.length === 0) return;
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("audio", blob, "voice.webm");
          formData.append("courseId", courseId);

          setProcessing(true);
          const res = await fetch("/api/voice/turn", {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: formData,
          });

          let data = null;
          try {
            data = await res.json();
          } catch (parseErr) {
            // ignore JSON errors, handled below
          }

          if (!res.ok) {
            const friendly = data?.message || "Our voice agent is taking a break.";
            setError(friendly);
            if (res.status === 429 && friendly) {
              appendVoiceMessages({
                transcript: data?.transcript,
                answer: friendly,
                audio: null,
                replyType: "text",
                greeting: null,
                quota: data?.quota || quota,
              });
            }
            throw new Error(friendly);
          }

          const payload = {
            transcript: data?.transcript || "",
            answer: data?.text || "",
            audio: data?.audio || null,
            replyType: data?.replyType || "audio",
            greeting: data?.greeting || null,
            quota: data?.quota || null,
          };

          setQuota(payload.quota);
          setLastResponse(payload);
          appendVoiceMessages(payload);
          if (payload.replyType === "audio") {
            playAudio(payload.audio);
          }
          setError("");
        } catch (err) {
          console.error("voice agent error", err);
        } finally {
          resetStream();
          setProcessing(false);
          setStatus("idle");
        }
      };

      recorder.start();
      setRecording(true);
      setStatus("listening");
    } catch (err) {
      console.error("voice agent start error", err);
      setError(err.message || "Microphone access denied.");
      resetStream();
      setStatus("idle");
    }
  }, [appendVoiceMessages, courseId, playAudio, processing, recording, resetStream, token, quota]);

  const stopRecording = useCallback(() => {
    if (!recording) return;
    try {
      mediaRecorderRef.current?.stop();
    } catch (err) {
      console.error("voice agent stop error", err);
      resetStream();
      setProcessing(false);
      setStatus("idle");
    }
  }, [recording, resetStream]);

  const dismissError = useCallback(() => setError(""), []);

  const canRecord = useMemo(() => !!courseId && !processing, [courseId, processing]);

  return {
    startRecording,
    stopRecording,
    recording,
    processing,
    status,
    error,
    dismissError,
    quota,
    canRecord,
    lastResponse,
  };
}
