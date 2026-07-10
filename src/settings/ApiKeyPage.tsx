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
import { KeyRound, X, Check, Copy, Info } from "lucide-react";

interface ApiKeyModalProps {
  onClose: () => void;
}

type KeyStatus = "loading" | "exists" | "none" | "error";

const generateApiKey = (): string => {
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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

          setApiKey(docSnap.id);
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

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    setError(null);

    try {
      const newKey = generateApiKey();

      await setDoc(doc(db, "api_keys", newKey), {
        userId:    user.uid,
        email:     user.email ?? "",
        label:     label.trim() || "Default",
        active:    true,
        createdAt: serverTimestamp(),
      });

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

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const masked = (key: string) =>
    key.slice(0, 10) + "•".repeat(16) + key.slice(-4);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-surface-raised rounded-card shadow-card-hover border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 bg-info-bg rounded-control p-2.5">
              <KeyRound size={20} className="text-info" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">API Key</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Authenticate your requests to the Football API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="min-h-11 min-w-11 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-control transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="h-px bg-border" />

        <div className="px-6 py-5 space-y-4">

          {status === "loading" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-7 h-7 border-[3px] border-border border-t-info rounded-full animate-spin" />
              <p className="text-sm text-text-secondary">Checking your access…</p>
            </div>
          )}

          {status === "error" && (
            <InfoBanner type="error"
              message="Could not load your API key. Check your connection and refresh." />
          )}

          {status === "exists" && apiKey && (
            <div className="space-y-4">

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-control bg-info-bg
                  border border-info/20 text-info text-xs font-bold tracking-widest">
                  LT-
                </span>
                <span className="text-xs text-text-secondary">prefixed unique key</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  Your API Key
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 bg-surface-muted border border-border rounded-control px-3 py-2.5
                    text-xs font-data text-text-secondary truncate tracking-wide">
                    {masked(apiKey)}
                  </code>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 min-h-11 px-3 py-2.5 rounded-control text-xs font-semibold
                      transition-colors shrink-0 border
                      ${copied
                        ? "bg-success-bg border-success/20 text-success"
                        : "bg-brand-black border-brand-black text-brand-white dark:bg-brand-white dark:border-brand-white dark:text-brand-black hover:opacity-90"
                      }`}
                  >
                    {copied ? (
                      <>
                        <Check size={14} aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} aria-hidden="true" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                {createdAt && (
                  <p className="text-xs text-text-secondary mt-1.5">Generated on {createdAt}</p>
                )}
              </div>

              <InfoBanner type="info"
                message="Pass your key in every request as the X-API-Key header." />

              {/* Code snippet — intentionally always-dark, like a terminal; not theme-toggled */}
              <div className="bg-gray-900 rounded-card p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Example request
                </p>
                <pre className="text-xs font-data text-gray-300 whitespace-pre-wrap break-all leading-relaxed">
{`curl https://your-api.onrender.com/matches \\
  -H "X-API-Key: ${apiKey}"`}
                </pre>
              </div>

              {/* Revoke */}
              <div className="bg-danger-bg border border-danger/20 rounded-card p-4 space-y-2">
                <p className="text-xs font-bold text-danger">Revoke Key</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  This immediately invalidates your key. All requests using it
                  will fail until you generate a new one.
                </p>
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="mt-1 min-h-11 px-4 py-2 text-xs font-semibold text-danger border border-danger/30
                    rounded-control hover:bg-danger-bg transition-colors disabled:opacity-50"
                >
                  {revoking ? "Revoking…" : "Revoke Key"}
                </button>
              </div>
            </div>
          )}

          {status === "none" && (
            <div className="space-y-4">

              <div className="bg-surface-muted border border-border rounded-card px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold text-info tracking-widest bg-info-bg
                  border border-info/20 rounded px-2 py-0.5">LT-</span>
                <span className="text-xs font-data text-text-secondary tracking-wide">
                  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                </span>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                You don't have an active API key. Generate one to start making
                authenticated requests.
              </p>

              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  Key label <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. My App, Production"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  maxLength={48}
                  className="mt-2 w-full min-h-11 px-3 py-2.5 border border-border rounded-control text-sm
                    text-text-primary bg-surface-muted placeholder:text-text-secondary"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full min-h-11 py-3 bg-brand-black hover:opacity-90 disabled:opacity-50
                  text-brand-white dark:bg-brand-white dark:text-brand-black text-sm font-bold rounded-control transition-opacity"
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

const InfoBanner: React.FC<{ type: "info" | "error"; message: string }> = ({
  type, message,
}) => (
  <div className={`flex items-start gap-2.5 px-3.5 py-3 rounded-control border text-xs leading-relaxed
    ${type === "error"
      ? "bg-danger-bg border-danger/20 text-danger"
      : "bg-info-bg border-info/20 text-info"
    }`}
  >
    <Info size={16} className="shrink-0 mt-px" aria-hidden="true" />
    <span>{message}</span>
  </div>
);