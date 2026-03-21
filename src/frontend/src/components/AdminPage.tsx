import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  ImageIcon,
  Inbox,
  Loader2,
  Lock,
  MessageSquare,
  Phone,
  Shield,
  Tag,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Complaint } from "../backend";
import { useActor } from "../hooks/useActor";

const ADMIN_PASSWORD = "aiea2024";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function ComplaintCard({
  complaint,
  index,
}: { complaint: Complaint; index: number }) {
  const imageUrl = complaint.image ? complaint.image.getDirectURL() : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      data-ocid={`admin.complaints.item.${index + 1}`}
    >
      <div className="h-1 bg-blue-700" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Tag size={14} className="text-blue-600" />
              {complaint.subject}
            </h3>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Clock size={11} />
              {formatTimestamp(complaint.timestamp)}
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            #{String(complaint.id)}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User size={14} className="text-blue-500 shrink-0" />
            <span className="font-medium">{complaint.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={14} className="text-blue-500 shrink-0" />
            <span>{complaint.phone}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MessageSquare
              size={14}
              className="text-blue-500 shrink-0 mt-0.5"
            />
            <p className="leading-relaxed">{complaint.message}</p>
          </div>
        </div>

        {imageUrl ? (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
              <ImageIcon size={11} /> Attached Photo
            </p>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={imageUrl}
                alt="Complaint attachment"
                className="w-full max-w-xs rounded-xl border border-gray-200 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                style={{ maxHeight: 200 }}
              />
            </a>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic flex items-center gap-1">
            <ImageIcon size={11} /> No image attached
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ComplaintsList() {
  const { actor, isFetching } = useActor();

  const {
    data: complaints,
    isLoading,
    isError,
  } = useQuery<Complaint[]>({
    queryKey: ["complaints"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getComplaints();
      return [...result].sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
    },
    enabled: !!actor && !isFetching,
  });

  if (isLoading || isFetching) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 gap-4"
        data-ocid="admin.complaints.loading_state"
      >
        <Loader2 size={36} className="animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading complaints...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 gap-3 text-red-600"
        data-ocid="admin.complaints.error_state"
      >
        <AlertCircle size={36} />
        <p className="font-semibold">
          Failed to load complaints. Please try again.
        </p>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400"
        data-ocid="admin.complaints.empty_state"
      >
        <Inbox size={48} strokeWidth={1.5} />
        <p className="font-semibold text-lg">No complaints yet</p>
        <p className="text-sm">Submitted complaints will appear here.</p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 sm:grid-cols-2"
      data-ocid="admin.complaints.list"
    >
      {complaints.map((c, i) => (
        <ComplaintCard key={String(c.id)} complaint={c} index={i} />
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/IMG_20260321_231245-1.png"
              alt="AIEA Logo"
              className="h-9 w-auto object-contain"
            />
            <div>
              <p className="text-xs font-bold leading-tight text-blue-700">
                ALL INDIA ELECTRICIAN
              </p>
              <p className="text-xs font-semibold leading-tight text-gray-500">
                ASSOCIATION — Admin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.hash = "";
            }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors"
            data-ocid="admin.nav.link"
          >
            <ArrowLeft size={15} /> Back to Site
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {!authenticated ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="max-w-sm mx-auto"
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Admin Access
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your password to view complaints
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7"
                data-ocid="admin.login.modal"
              >
                <div className="mb-5">
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                    htmlFor="admin-password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter admin password"
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      autoComplete="current-password"
                      data-ocid="admin.login.input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      data-ocid="admin.login.toggle"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {error && (
                    <p
                      className="flex items-center gap-1.5 mt-2 text-xs text-red-600"
                      data-ocid="admin.login.error_state"
                    >
                      <AlertCircle size={12} /> {error}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                  data-ocid="admin.login.submit_button"
                >
                  Access Admin Panel
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    Complaints Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    All submitted complaints, newest first
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthenticated(false);
                    setPassword("");
                  }}
                  className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-red-200"
                  data-ocid="admin.panel.button"
                >
                  Sign Out
                </button>
              </div>
              <ComplaintsList />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t py-6 px-4 bg-white mt-10 border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
