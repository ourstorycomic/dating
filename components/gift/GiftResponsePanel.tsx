"use client";

import { useRef, useState } from "react";

type GiftResponsePanelProps = {
  orderId: string;
  question?: string;
};

export function GiftResponsePanel({ orderId, question }: GiftResponsePanelProps) {
  const [answer, setAnswer] = useState("YES");
  const [message, setMessage] = useState("");
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setError("");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = () => setAudioDataUrl(String(reader.result));
      reader.readAsDataURL(blob);
      stream.getTracks().forEach((track) => track.stop());
    };

    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  async function submitResponse() {
    setIsSubmitting(true);
    setError("");

    const response = await fetch(`/api/orders/${orderId}/response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer,
        message,
        audioDataUrl,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Không gửi được phản hồi.");
      return;
    }

    setSaved(true);
  }

  return (
    <section className="glass-panel rounded-2xl p-5">
      <p className="text-sm font-semibold text-pink-100/80">Phản hồi cho người gửi</p>
      <h2 className="mt-2 text-2xl font-semibold">{question ?? "Em có đồng ý không?"}</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["YES", "Có chứ"],
          ["MAYBE", "Để em nghĩ"],
          ["CUSTOM", "Em nhắn riêng"],
        ].map(([value, label]) => (
          <button
            className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
              answer === value
                ? "bg-gradient-to-r from-pink-500 to-purple-500"
                : "border border-white/12 bg-white/[0.06]"
            }`}
            key={value}
            onClick={() => setAnswer(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <textarea
        className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none placeholder:text-white/32 focus:border-pink-300/50"
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Viết thêm vài lời cho người gửi..."
        value={message}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-full border border-white/14 bg-white/[0.06] px-5 py-3 text-sm font-semibold"
          onClick={isRecording ? stopRecording : startRecording}
          type="button"
        >
          {isRecording ? "Dừng ghi âm" : audioDataUrl ? "Ghi âm lại" : "Ghi âm lời nhắn"}
        </button>
        <button
          className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold disabled:opacity-50"
          disabled={isSubmitting}
          onClick={submitResponse}
          type="button"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
        </button>
      </div>

      {audioDataUrl ? (
        <audio className="mt-4 w-full" controls src={audioDataUrl}>
          <track kind="captions" />
        </audio>
      ) : null}
      {saved ? <p className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">Đã gửi phản hồi. Người gửi có thể xem ở track link.</p> : null}
      {error ? <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
    </section>
  );
}
