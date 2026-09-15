"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const JASMINE_API_URL =
  process.env.NEXT_PUBLIC_JASMINE_API_URL ||
  "http://127.0.0.1:8000";

const SESSION_ID = "wakefield-admin";

type ChatResponse = {
  reply?: string;
  session_id?: string;
};

type VoiceToolResponse = {
  ok?: boolean;
  result?: unknown;
};

type RealtimeFunctionCall = {
  type?: string;
  name?: string;
  call_id?: string;
  arguments?: string;
};

type RealtimeEvent = {
  type?: string;

  response?: {
    output?: RealtimeFunctionCall[];
  };

  error?: {
    message?: string;
  };
};

export default function JasmineAdminPage() {
  // -----------------------------
  // TEXT CHAT
  // -----------------------------

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // LIVE VOICE
  // -----------------------------

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceConnecting, setVoiceConnecting] =
    useState(false);
  const [voiceConnected, setVoiceConnected] =
    useState(false);

  const [voiceStatus, setVoiceStatus] =
    useState("Ready");

  const [voiceStatusSub, setVoiceStatusSub] =
    useState(
      "Start Live Voice to speak with Jasmine."
    );

  const [micMuted, setMicMuted] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  const peerConnectionRef =
    useRef<RTCPeerConnection | null>(null);

  const dataChannelRef =
    useRef<RTCDataChannel | null>(null);

  const microphoneStreamRef =
    useRef<MediaStream | null>(null);

  const realtimeAudioRef =
    useRef<HTMLAudioElement | null>(null);

  const handledToolCallsRef =
    useRef<Set<string>>(new Set());

  // -----------------------------
  // TEXT CHAT SEND
  // -----------------------------

  async function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setReply("");

    try {
      const response = await fetch(
        `${JASMINE_API_URL}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: cleanMessage,
            session_id: SESSION_ID,
          }),
        }
      );

      const data =
        (await response.json()) as ChatResponse;

      if (!response.ok) {
        throw new Error(
          "Jasmine backend returned an error."
        );
      }

      setReply(
        data.reply ??
          "Jasmine returned no response."
      );

      setMessage("");
    } catch (err) {
      console.error(
        "Jasmine connection error:",
        err
      );

      setError(
        "Could not connect to Jasmine. Make sure the Jasmine FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // END REALTIME CONNECTION
  // -----------------------------

  const endRealtimeConnection =
    useCallback(() => {
      const dataChannel =
        dataChannelRef.current;

      if (dataChannel) {
        try {
          dataChannel.close();
        } catch {}

        dataChannelRef.current = null;
      }

      const peerConnection =
        peerConnectionRef.current;

      if (peerConnection) {
        try {
          peerConnection.close();
        } catch {}

        peerConnectionRef.current = null;
      }

      const microphoneStream =
        microphoneStreamRef.current;

      if (microphoneStream) {
        microphoneStream
          .getTracks()
          .forEach((track) => track.stop());

        microphoneStreamRef.current = null;
      }

      const audio = realtimeAudioRef.current;

      if (audio) {
        audio.pause();
        audio.srcObject = null;
        audio.remove();

        realtimeAudioRef.current = null;
      }

      handledToolCallsRef.current.clear();

      setVoiceConnected(false);
      setVoiceConnecting(false);
      setMicMuted(false);

      setVoiceStatus("Ended");

      setVoiceStatusSub(
        "Live Voice session has ended."
      );
    }, []);

  // -----------------------------
  // SEND TOOL RESULT TO REALTIME
  // -----------------------------

  const sendToolOutput =
    useCallback(
      (
        callId: string,
        output: string
      ) => {
        const dataChannel =
          dataChannelRef.current;

        if (
          !dataChannel ||
          dataChannel.readyState !== "open"
        ) {
          throw new Error(
            "Realtime data channel is not open."
          );
        }

        dataChannel.send(
          JSON.stringify({
            type: "conversation.item.create",

            item: {
              type: "function_call_output",
              call_id: callId,
              output,
            },
          })
        );

        dataChannel.send(
          JSON.stringify({
            type: "response.create",
          })
        );
      },
      []
    );

  // -----------------------------
  // HANDLE REALTIME EVENTS
  // -----------------------------

  const handleRealtimeEvent =
    useCallback(
      async (event: RealtimeEvent) => {
        console.log(
          "Jasmine Realtime:",
          event.type,
          event
        );

        let jasmineToolCall:
          | RealtimeFunctionCall
          | null = null;

        /*
         * Preserve the working Jasmine behaviour:
         * execute backend tools from response.done.
         */

        if (
          event.type === "response.done" &&
          event.response &&
          Array.isArray(
            event.response.output
          )
        ) {
          const functionItem =
            event.response.output.find(
              (item) =>
                item &&
                item.type ===
                  "function_call" &&
                item.name ===
                  "ask_jasmine_backend"
            );

          if (functionItem) {
            jasmineToolCall = functionItem;
          }
        }

        if (
          jasmineToolCall &&
          jasmineToolCall.call_id
        ) {
          const callId =
            jasmineToolCall.call_id;

          if (
            handledToolCallsRef.current.has(
              callId
            )
          ) {
            console.log(
              "Jasmine tool call already handled:",
              callId
            );

            return;
          }

          handledToolCallsRef.current.add(
            callId
          );

          setVoiceStatus("Working");

          setVoiceStatusSub(
            "Checking Jasmine's business tools..."
          );

          try {
            let args: {
              message?: string;
            } = {};

            try {
              args = JSON.parse(
                jasmineToolCall.arguments ||
                  "{}"
              );
            } catch {
              throw new Error(
                "Invalid Jasmine tool arguments."
              );
            }

            const backendMessage =
              (args.message || "").trim();

            if (!backendMessage) {
              throw new Error(
                "Jasmine backend request was empty."
              );
            }

            const response = await fetch(
              `${JASMINE_API_URL}/voice/tool`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  message: backendMessage,
                  session_id: SESSION_ID,
                }),
              }
            );

            const responseText =
              await response.text();

            if (!response.ok) {
              throw new Error(
                responseText ||
                  "Jasmine backend failed."
              );
            }

            let data: VoiceToolResponse;

            try {
              data = JSON.parse(
                responseText
              ) as VoiceToolResponse;
            } catch {
              throw new Error(
                "Jasmine backend returned invalid JSON."
              );
            }

            const backendResult =
              data.result !== undefined &&
              data.result !== null
                ? String(data.result)
                : "The Jasmine backend completed the request but returned no message.";

            sendToolOutput(
              callId,
              backendResult
            );

            setVoiceStatus("Responding");

            setVoiceStatusSub(
              "Jasmine is answering..."
            );
          } catch (toolError) {
            console.error(
              "Jasmine tool bridge error:",
              toolError
            );

            const errorMessage =
              toolError instanceof Error
                ? toolError.message
                : "Unknown backend error.";

            try {
              sendToolOutput(
                callId,
                "The Jasmine backend request failed. " +
                  "Do not claim that it is still running. " +
                  "Do not claim success. Error: " +
                  errorMessage
              );
            } catch (sendError) {
              console.error(
                "Could not return tool error:",
                sendError
              );
            }

            setVoiceStatus("Error");
            setVoiceStatusSub(errorMessage);
          }

          return;
        }

        if (
          event.type ===
          "input_audio_buffer.speech_started"
        ) {
          setVoiceStatus("Listening");

          setVoiceStatusSub(
            "I can hear you..."
          );

          return;
        }

        if (
          event.type ===
          "input_audio_buffer.speech_stopped"
        ) {
          setVoiceStatus("Thinking");

          setVoiceStatusSub(
            "Jasmine is responding..."
          );

          return;
        }

        if (
          event.type === "response.created"
        ) {
          setVoiceStatus("Thinking");

          setVoiceStatusSub(
            "Jasmine is preparing her response..."
          );

          return;
        }

        if (
          event.type ===
            "response.output_audio.delta" ||
          event.type ===
            "response.audio.delta" ||
          event.type ===
            "response.output_audio_transcript.delta"
        ) {
          setVoiceStatus("Speaking");

          setVoiceStatusSub(
            "Jasmine is speaking..."
          );

          return;
        }

        if (event.type === "error") {
          console.error(
            "OpenAI Realtime error:",
            event
          );

          setVoiceStatus(
            "Realtime error"
          );

          setVoiceStatusSub(
            event.error?.message ||
              "A voice error occurred."
          );

          return;
        }

        if (
          event.type === "response.done"
        ) {
          setVoiceStatus("Listening");

          setVoiceStatusSub(
            "Speak naturally. Jasmine is listening."
          );
        }
      },
      [sendToolOutput]
    );

  // -----------------------------
  // START REALTIME VOICE
  // -----------------------------

  const startRealtimeVoice =
    useCallback(async () => {
      if (voiceConnecting) {
        return;
      }

      endRealtimeConnection();

      setVoiceOpen(true);
      setVoiceConnecting(true);
      setVoiceStatus("Connecting");

      setVoiceStatusSub(
        "Starting Jasmine Live Voice..."
      );

      try {
        const peerConnection =
          new RTCPeerConnection();

        peerConnectionRef.current =
          peerConnection;

        const audio =
          document.createElement("audio");

        audio.autoplay = true;
        audio.muted = soundMuted;

        document.body.appendChild(audio);

        realtimeAudioRef.current = audio;

        peerConnection.ontrack =
          (event) => {
            audio.srcObject =
              event.streams[0];

            audio
              .play()
              .catch((playError) => {
                console.warn(
                  "Realtime audio autoplay:",
                  playError
                );
              });
          };

        const microphoneStream =
          await navigator.mediaDevices
            .getUserMedia({
              audio: true,
            });

        microphoneStreamRef.current =
          microphoneStream;

        const audioTrack =
          microphoneStream
            .getAudioTracks()[0];

        if (!audioTrack) {
          throw new Error(
            "No microphone was available."
          );
        }

        peerConnection.addTrack(
          audioTrack,
          microphoneStream
        );

        const dataChannel =
          peerConnection.createDataChannel(
            "oai-events"
          );

        dataChannelRef.current =
          dataChannel;

        dataChannel.addEventListener(
          "open",
          () => {
            console.log(
              "Jasmine Realtime connected"
            );

            setVoiceConnecting(false);
            setVoiceConnected(true);
            setVoiceStatus("Listening");

            setVoiceStatusSub(
              "Speak naturally. Jasmine is listening."
            );
          }
        );

        dataChannel.addEventListener(
          "message",
          async (messageEvent) => {
            try {
              const data =
                JSON.parse(
                  messageEvent.data
                ) as RealtimeEvent;

              await handleRealtimeEvent(
                data
              );
            } catch (messageError) {
              console.error(
                "Realtime message error:",
                messageError
              );
            }
          }
        );

        dataChannel.addEventListener(
          "close",
          () => {
            setVoiceConnected(false);
            setVoiceConnecting(false);

            setVoiceStatus(
              "Disconnected"
            );

            setVoiceStatusSub(
              "The Live Voice connection closed."
            );
          }
        );

        const offer =
          await peerConnection.createOffer();

        await peerConnection
          .setLocalDescription(offer);

        if (!offer.sdp) {
          throw new Error(
            "Could not create the Realtime SDP offer."
          );
        }

        const response = await fetch(
          `${JASMINE_API_URL}/realtime/session`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/sdp",
            },

            body: offer.sdp,
          }
        );

        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            "Realtime session failed: " +
              errorText
          );
        }

        const answerSdp =
          await response.text();

        await peerConnection
          .setRemoteDescription({
            type: "answer",
            sdp: answerSdp,
          });
      } catch (voiceError) {
        console.error(
          "Jasmine Live Voice error:",
          voiceError
        );

        const errorMessage =
          voiceError instanceof Error
            ? voiceError.message
            : "Unable to start Live Voice.";

        endRealtimeConnection();

        setVoiceOpen(true);
        setVoiceStatus("Error");
        setVoiceStatusSub(errorMessage);
      }
    }, [
      endRealtimeConnection,
      handleRealtimeEvent,
      soundMuted,
      voiceConnecting,
    ]);

  // -----------------------------
  // MICROPHONE
  // -----------------------------

  function toggleMicrophone() {
    const microphoneStream =
      microphoneStreamRef.current;

    if (!microphoneStream) {
      return;
    }

    const track =
      microphoneStream.getAudioTracks()[0];

    if (!track) {
      return;
    }

    track.enabled = !track.enabled;

    const isMuted = !track.enabled;

    setMicMuted(isMuted);

    if (isMuted) {
      setVoiceStatus(
        "Microphone muted"
      );

      setVoiceStatusSub(
        "Tap the microphone to continue."
      );
    } else {
      setVoiceStatus("Listening");

      setVoiceStatusSub(
        "Speak naturally. Jasmine is listening."
      );
    }
  }

  // -----------------------------
  // SOUND
  // -----------------------------

  function toggleSound() {
    const nextMuted =
      !soundMuted;

    setSoundMuted(nextMuted);

    if (realtimeAudioRef.current) {
      realtimeAudioRef.current.muted =
        nextMuted;
    }
  }

  // -----------------------------
  // CLOSE VOICE
  // -----------------------------

  function closeVoice() {
    endRealtimeConnection();
    setVoiceOpen(false);
  }

  // -----------------------------
  // CLEAN UP IF PAGE UNMOUNTS
  // -----------------------------

  useEffect(() => {
    return () => {
      const stream =
        microphoneStreamRef.current;

      if (stream) {
        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      dataChannelRef.current?.close();
      peerConnectionRef.current?.close();

      const audio =
        realtimeAudioRef.current;

      if (audio) {
        audio.pause();
        audio.srcObject = null;
        audio.remove();
      }
    };
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[#071b3a] px-5 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#efad3f]">
              Wakefield Property Lettings
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Jasmine AI
            </h1>

            <p className="mt-3 text-white/70">
              Your private business assistant.
            </p>
          </div>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="flex min-h-[320px] flex-col justify-center">
              {!reply && !error && (
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-4xl shadow-xl">
                    ✦
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold">
                    How can I help?
                  </h2>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/60">
                    Ask Jasmine about your
                    business, emails, applicants,
                    properties or other connected
                    information.
                  </p>

                  <button
                    type="button"
                    onClick={
                      startRealtimeVoice
                    }
                    className="mt-7 rounded-2xl bg-[#efad3f] px-7 py-4 font-bold text-[#071b3a] transition hover:bg-[#f6bb54]"
                  >
                    🎧 Start Live Voice
                  </button>
                </div>
              )}

              {reply && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#efad3f]">
                    Jasmine
                  </p>

                  <p className="whitespace-pre-wrap leading-7 text-white/90">
                    {reply}
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-red-100">
                  {error}
                </div>
              )}
            </div>

            <form
              onSubmit={sendMessage}
              className="mt-6 flex gap-3"
            >
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder="Message Jasmine..."
                rows={2}
                disabled={loading}
                className="min-h-[60px] flex-1 resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-white/40 focus:border-[#efad3f]"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !message.trim()
                }
                className="rounded-2xl bg-[#efad3f] px-6 font-bold text-[#071b3a] transition hover:bg-[#f6bb54] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Thinking..."
                  : "Send"}
              </button>
            </form>

            {(reply || error) && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={
                    startRealtimeVoice
                  }
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  🎧 Live Voice
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {voiceOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020b19]/95 px-5 text-white backdrop-blur-xl">
          <button
            type="button"
            onClick={closeVoice}
            className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xl transition hover:bg-white/10"
            aria-label="Close Live Voice"
          >
            ✕
          </button>

          <div className="w-full max-w-xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#efad3f]">
              Jasmine Live
            </p>

            <div
              className={`mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-full border text-6xl shadow-2xl transition ${
                voiceConnected
                  ? "border-[#efad3f]/60 bg-[#efad3f]/10 shadow-[#efad3f]/20"
                  : "border-white/10 bg-white/5"
              }`}
            >
              ✦
            </div>

            <h2 className="mt-8 text-4xl font-bold">
              {voiceStatus}
            </h2>

            <p className="mt-3 min-h-12 text-base leading-7 text-white/60">
              {voiceStatusSub}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={toggleMicrophone}
                disabled={
                  !voiceConnected
                }
                className="min-w-28 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 font-semibold transition hover:bg-white/10 disabled:opacity-40"
              >
                {micMuted
                  ? "🔇 Mic"
                  : "🎙 Mic"}
              </button>

              <button
                type="button"
                onClick={toggleSound}
                className="min-w-28 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 font-semibold transition hover:bg-white/10"
              >
                {soundMuted
                  ? "🔇 Sound"
                  : "🔊 Sound"}
              </button>

              <button
                type="button"
                onClick={closeVoice}
                className="min-w-28 rounded-2xl bg-red-500/90 px-5 py-4 font-bold text-white transition hover:bg-red-500"
              >
                End
              </button>
            </div>

            {voiceConnecting && (
              <p className="mt-7 text-sm text-white/45">
                Establishing secure Realtime
                connection...
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}