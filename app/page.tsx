"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Role = "user" | "assistant" | "system";

type Msg = {
  id: string;
  role: Role;
  content: string;
  createdAt: number; // timestamp (ms)
};

const STORAGE_KEY = "ai_chatbox_state_v1";
const THEME_KEY = "ai_chatbox_theme_v1";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatTime(ts: number) {
  // Example: 2:41 PM
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Bubble({
  role,
  content,
  createdAt,
}: {
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[88%] gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`mt-1 h-8 w-8 shrink-0 rounded-full border flex items-center justify-center text-[11px] font-semibold
          ${isUser ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                   : "bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-700"}`}
        >
          {isUser ? "You" : "AI"}
        </div>

        {/* Message */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm border
          ${isUser
            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
            : "bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-700"}`}
        >
          <div className="whitespace-pre-wrap">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: (props) => (
                  <a
                    {...props}
                    className="underline underline-offset-2 opacity-90 hover:opacity-100"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
                ul: (props) => <ul {...props} className="list-disc pl-5 my-2" />,
                ol: (props) => <ol {...props} className="list-decimal pl-5 my-2" />,
                code: (props) => (
                  <code
                    {...props}
                    className="rounded bg-black/10 px-1 py-0.5 dark:bg-white/10"
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          <div className={`mt-2 text-[11px] opacity-70 ${isUser ? "text-white/80 dark:text-zinc-700" : ""}`}>
            {formatTime(createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
    </div>
  );
}

const initialMessages = (): Msg[] => [
  { id: uid(), role: "system", content: "You are a helpful assistant.", createdAt: Date.now() },
  { id: uid(), role: "assistant", content: "Hi! Ask me anything 😊\n\nYou can use **bold**, lists, and links.", createdAt: Date.now() },
];

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>(initialMessages());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // theme: "light" | "dark"
const [theme, setTheme] = useState<"light" | "dark">("light");  const [theme, setTheme] = useState<"light" | "dark">("light");

  const listRef = useRef<HTMLDivElement | null>(null);

  const visibleMessages = useMemo(
    () =>
      messages.filter((m) => m.role !== "system") as Array<{
        id: string;
        role: "user" | "assistant";
        content: string;
        createdAt: number;
      }>,
    [messages]
  );

  // Load saved state + theme
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      }

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages }));
    } catch {}
  }, [messages]);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  // Auto-scroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [visibleMessages.length, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const now = Date.now();
    const nextMessages: Msg[] = [
      ...messages,
      { id: uid(), role: "user", content: text, createdAt: now },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // backend only needs role/content; timestamps are fine to send but not necessary
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setMessages([
        ...nextMessages,
        { id: uid(), role: "assistant", content: data.reply, createdAt: Date.now() },
      ]);
    } catch (e) {
      console.error(e);
      setMessages([
        ...nextMessages,
        {
          id: uid(),
          role: "assistant",
          content: "Sorry—something went wrong. (Check the server tab for errors.)",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages(initialMessages());
    setInput("");
  }

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Chatbox</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Bubbles • timestamps • clear chat • dark mode • markdown
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-zinc-50
                         dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>

            <button
              onClick={clearChat}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-zinc-50
                         dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear chat
            </button>
          </div>
        </header>

        {/* Chat container */}
        <section className="mt-6 flex flex-1 flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm
                            dark:border-zinc-800 dark:bg-zinc-900">
          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
            {visibleMessages.map((m) => (
              <Bubble key={m.id} role={m.role} content={m.content} createdAt={m.createdAt} />
            ))}

            {loading && (
              <div className="flex w-full justify-start">
                <div className="flex max-w-[88%] gap-3">
                  <div className="mt-1 h-8 w-8 shrink-0 rounded-full border border-zinc-200 bg-white text-zinc-900
                                  dark:border-zinc-700 dark:bg-zinc-900 dark:text-white
                                  flex items-center justify-center text-[11px] font-semibold">
                    AI
                  </div>
                  <div className="rounded-2xl px-4 py-3 text-sm shadow-sm border border-zinc-200 bg-white text-zinc-900
                                  dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                    <TypingDots />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-zinc-200 bg-white p-3 md:p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none
                           focus:border-zinc-300 focus:bg-white
                           dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700 dark:focus:bg-zinc-950"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Type a message…"
              />

              <button
                className="rounded-xl border border-zinc-200 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm
                           disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:border-white"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>

            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Tip: Press <span className="font-semibold">Enter</span> to send. Markdown works: **bold**, lists, links.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

