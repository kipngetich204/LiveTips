import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../FirebaseConfig/firebase";
import { useAuth } from "../context/AuthContext";

interface ApiKeyModalProps {
  onClose: () => void;
}

type KeyStatus = "loading" | "exists" | "none" | "error";

const generateApiKey = (): string => {
  // LT- followed by a random UUID (dashes removed for compactness)
  const uuid = crypto.randomUUID().replace(/-/g, "");
  return `LT-${uuid}`;
};

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose }) => {
  const { user } = useAuth();

  const [status, setStatus]       = useState<KeyStatus>("loading");
  const [apiKey, setApiKey]       = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [label, setLabel]         = useState("");
  const [copied, setCopied]       = useState(false);
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking]   = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Query Firestore for an existing active key belonging to this user ──
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const q = query(
          collection(db, "api_keys"),
          where("userId", "==", user.uid),
          where("active", "==", true)
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          const docSnap = snap.docs[0];
          const data    = docSnap.data();

          setApiKey(docSnap.id); // document ID is the key (e.g. LT-xxxx)
          setLabel(data.label ?? "");
          setCreatedAt(
            data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                })
              : null
          );
          setStatus("exists");
        } else {
          setStatus("none");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    })();
  }, [user]);

  // ── Generate a new key ──
  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    setError(null);

    try {
      const newKey = generateApiKey(); // e.g. LT-a1b2c3d4e5f6...

      await setDoc(doc(db, "api_keys", newKey), {
    
        userId:    user.uid,
        email:     user.email ?? "",
        label:     label.trim() || "Default",
        active:    true,
        createdAt: serverTimestamp(),
      });


          // 2. Register with Flask backend (for request authentication)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/keys/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: newKey,
        userId: user.uid,
        email:  user.email ?? "",
        label:  label.trim() || "Default",
      }),
    });

    if (!res.ok) throw new Error("Backend registration failed");


      setApiKey(newKey);
      setStatus("exists");
      setCreatedAt("Today");
    } catch (err) {
      console.error(err);
      setError("Failed to generate key. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // ── Revoke — soft delete (active: false), keeps the doc for audit trail ──
  const handleRevoke = async () => {
    if (!apiKey) return;
    setRevoking(true);
    setError(null);

    try {
      await setDoc(doc(db, "api_keys", apiKey), { active: false }, { merge: true });


      await fetch(`${import.meta.env.VITE_API_URL}/keys/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });
      setApiKey(null);
      setStatus("none");
    } catch (err) {
      console.error(err);
      setError("Failed to revoke key. Please try again.");
    } finally {
      setRevoking(false);
    }
  };

  // ── Copy to clipboard ──
  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Show first 10 chars + dots + last 4
  const masked = (key: string) =>
    key.slice(0, 10) + "•".repeat(16) + key.slice(-4);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-indigo-50 rounded-xl p-2.5">
              <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="M21 2l-9.6 9.6" />
                <path d="M15.5 7.5l3 3L22 7l-3-3" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">API Key</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Authenticate your requests to the Football API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="px-6 py-5 space-y-4">

          {/* Loading */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-7 h-7 border-[3px] border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Checking your access…</p>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <InfoBanner type="error"
              message="Could not load your API key. Check your connection and refresh." />
          )}

          {/* Has active key */}
          {status === "exists" && apiKey && (
            <div className="space-y-4">

              {/* Key prefix badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50
                  border border-indigo-100 text-indigo-600 text-xs font-bold tracking-widest">
                  LT-
                </span>
                <span className="text-xs text-gray-400">prefixed unique key</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Your API Key
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5
                    text-xs font-mono text-gray-600 truncate tracking-wide">
                    {masked(apiKey)}
                  </code>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold
                      transition-all flex-shrink-0 border
                      ${copied
                        ? "bg-green-50 border-green-200 text-green-600"
                        : "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                {createdAt && (
                  <p className="text-xs text-gray-400 mt-1.5">Generated on {createdAt}</p>
                )}
              </div>

              <InfoBanner type="info"
                message="Pass your key in every request as the X-API-Key header." />

              {/* Code snippet */}
              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Example request
                </p>
                <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-all leading-relaxed">
{`curl https://your-api.onrender.com/matches \\
  -H "X-API-Key: ${apiKey}"`}
                </pre>
              </div>

              {/* Revoke */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-red-600">Revoke Key</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This immediately invalidates your key. All requests using it
                  will fail until you generate a new one.
                </p>
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="mt-1 px-4 py-2 text-xs font-semibold text-red-600 border border-red-300
                    rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
                >
                  {revoking ? "Revoking…" : "Revoke Key"}
                </button>
              </div>
            </div>
          )}

          {/* No key yet */}
          {status === "none" && (
            <div className="space-y-4">

              {/* Key format preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold text-indigo-500 tracking-widest bg-indigo-50
                  border border-indigo-100 rounded px-2 py-0.5">LT-</span>
                <span className="text-xs font-mono text-gray-400 tracking-wide">
                  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                </span>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">
                You don't have an active API key. Generate one to start making
                authenticated requests.
              </p>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Key label <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. My App, Production"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  maxLength={48}
                  className="mt-2 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                    text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400
                    focus:border-transparent placeholder:text-gray-300"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
                  text-white text-sm font-bold rounded-xl transition-colors"
              >
                {generating ? "Generating…" : "Generate API Key"}
              </button>
            </div>
          )}

          {error && <InfoBanner type="error" message={error} />}
        </div>
      </div>
    </div>
  );
};

// ── Shared banner ──────────────────────────────────────────────────────────

const InfoBanner: React.FC<{ type: "info" | "error"; message: string }> = ({
  type, message,
}) => (
  <div className={`flex items-start gap-2.5 px-3.5 py-3 rounded-lg border text-xs leading-relaxed
    ${type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-blue-50 border-blue-200 text-blue-700"
    }`}
  >
    <svg className="w-4 h-4 flex-shrink-0 mt-px" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <span>{message}</span>
  </div>
);