import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Filter,
  ImageIcon,
  Inbox,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Shield,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Complaint, LicenseApplication } from "../backend";
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

const LICENCE_LABELS: Record<string, string> = {
  wireman: "Wireman",
  supervisor: "Electrical Supervisor",
  "contractor-c": "Contractor Class C",
  "contractor-b": "Contractor Class B",
  "contractor-a": "Contractor Class A",
};

type ApplicationStatus = "Pending" | "Approved" | "Rejected";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { icon: React.ReactNode; className: string }
> = {
  Pending: {
    icon: <Clock size={11} />,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Approved: {
    icon: <CheckCircle size={11} />,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  Rejected: {
    icon: <XCircle size={11} />,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

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

function LicenseApplicationCard({
  application,
  index,
}: { application: LicenseApplication; index: number }) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const photoUrl = application.photo ? application.photo.getDirectURL() : null;
  const paymentScreenshotBlob = (application as any).paymentScreenshot;
  const paymentScreenshotUrl = paymentScreenshotBlob
    ? paymentScreenshotBlob.getDirectURL()
    : null;
  const licenceLabel =
    LICENCE_LABELS[application.licenceType] || application.licenceType;

  const currentStatus = ((application as any).status ||
    "Pending") as ApplicationStatus;
  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Pending;

  async function handleStatusChange(newStatus: string) {
    if (!actor) return;
    setUpdating(true);
    try {
      await (actor as any).updateLicenseApplicationStatus(
        application.id,
        newStatus,
      );
      await queryClient.invalidateQueries({
        queryKey: ["licenseApplications"],
      });
    } finally {
      setUpdating(false);
    }
  }

  async function handleDownloadAll() {
    setDownloadingAll(true);
    try {
      const downloads: { url: string; filename: string }[] = [];
      if (photoUrl) {
        downloads.push({
          url: photoUrl,
          filename: `applicant-${application.fullName}-passport.jpg`,
        });
      }
      if (paymentScreenshotUrl) {
        downloads.push({
          url: paymentScreenshotUrl,
          filename: `applicant-${application.fullName}-payment.jpg`,
        });
      }
      for (const { url, filename } of downloads) {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }
    } finally {
      setDownloadingAll(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      data-ocid={`admin.applications.item.${index + 1}`}
    >
      <div className="h-1 bg-blue-600" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <User size={14} className="text-blue-600" />
              {application.fullName}
            </h3>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Clock size={11} />
              {formatTimestamp(application.timestamp)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              #{String(application.id)}
            </span>
            <span
              className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${statusConfig.className}`}
              data-ocid={`admin.applications.item.${index + 1}.success_state`}
            >
              {statusConfig.icon}
              {currentStatus}
            </span>
            <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Briefcase size={10} className="inline mr-1" />
              {licenceLabel}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={14} className="text-blue-500 shrink-0" />
            <span>{application.mobile}</span>
          </div>
          {application.email && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail size={14} className="text-blue-500 shrink-0" />
              <span className="truncate">{application.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar size={14} className="text-blue-500 shrink-0" />
            <span>DOB: {application.dob}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin size={14} className="text-blue-500 shrink-0" />
            <span>
              {application.district}, {application.state}
            </span>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-700">
          <p className="flex items-start gap-2">
            <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{application.address}</span>
          </p>
        </div>

        {/* Status update */}
        <div className="mb-4 border-t border-gray-100 pt-4">
          <label
            className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
            htmlFor={`status-${String(application.id)}`}
          >
            Update Status
          </label>
          <div className="flex items-center gap-2">
            <select
              id={`status-${String(application.id)}`}
              value={currentStatus}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
              data-ocid={`admin.applications.item.${index + 1}.select`}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            {updating && (
              <Loader2
                size={16}
                className="animate-spin text-blue-600 shrink-0"
                data-ocid={`admin.applications.item.${index + 1}.loading_state`}
              />
            )}
          </div>
        </div>

        {photoUrl ? (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
              <ImageIcon size={11} /> Passport Photo
            </p>
            <a href={photoUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={photoUrl}
                alt="Applicant passport"
                className="w-24 h-28 rounded-xl border border-gray-200 object-cover hover:opacity-90 transition-opacity cursor-pointer"
              />
            </a>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic flex items-center gap-1">
            <ImageIcon size={11} /> No photo attached
          </p>
        )}

        {/* Payment Screenshot */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          {paymentScreenshotUrl ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                <CreditCard size={11} /> Payment Screenshot
              </p>
              <a
                href={paymentScreenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={paymentScreenshotUrl}
                  alt="Payment screenshot"
                  className="w-full rounded-xl border border-gray-200 object-contain hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ maxHeight: 200 }}
                />
              </a>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic flex items-center gap-1">
              <CreditCard size={11} /> No payment screenshot uploaded
            </p>
          )}

          {(photoUrl || paymentScreenshotUrl) && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                type="button"
                data-ocid="admin.application.download_button"
                onClick={handleDownloadAll}
                disabled={downloadingAll}
                className="w-full border border-blue-600 text-blue-700 hover:bg-blue-50 rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {downloadingAll ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Download size={15} />
                )}
                {downloadingAll ? "Downloading..." : "Download All Documents"}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ComplaintsList() {
  const { actor, isFetching } = useActor();
  const [search, setSearch] = useState("");

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

  const filtered = (complaints ?? []).filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Search bar */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, subject, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
            data-ocid="admin.complaints.search"
          />
        </div>
        {complaints && complaints.length > 0 && (
          <span className="text-xs text-gray-400 shrink-0">
            {filtered.length} of {complaints.length}
          </span>
        )}
      </div>

      {!complaints || complaints.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400"
          data-ocid="admin.complaints.empty_state"
        >
          <Inbox size={48} strokeWidth={1.5} />
          <p className="font-semibold text-lg">No complaints yet</p>
          <p className="text-sm">Submitted complaints will appear here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <Search size={40} strokeWidth={1.5} />
          <p className="font-semibold text-lg">No results found</p>
          <p className="text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div
          className="grid gap-4 sm:grid-cols-2"
          data-ocid="admin.complaints.list"
        >
          {filtered.map((c, i) => (
            <ComplaintCard key={String(c.id)} complaint={c} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function LicenseApplicationsList() {
  const { actor, isFetching } = useActor();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>(
    "all",
  );

  const {
    data: applications,
    isLoading,
    isError,
  } = useQuery<LicenseApplication[]>({
    queryKey: ["licenseApplications"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getLicenseApplications();
      return [...result].sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
    },
    enabled: !!actor && !isFetching,
  });

  if (isLoading || isFetching) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 gap-4"
        data-ocid="admin.applications.loading_state"
      >
        <Loader2 size={36} className="animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading applications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 gap-3 text-red-600"
        data-ocid="admin.applications.error_state"
      >
        <AlertCircle size={36} />
        <p className="font-semibold">
          Failed to load applications. Please try again.
        </p>
      </div>
    );
  }

  const filtered = (applications ?? []).filter((a) => {
    const status = ((a as any).status || "Pending") as ApplicationStatus;
    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const licenceLabel = (
        LICENCE_LABELS[a.licenceType] || a.licenceType
      ).toLowerCase();
      if (
        !a.fullName.toLowerCase().includes(q) &&
        !a.mobile.toLowerCase().includes(q) &&
        !(a.email ?? "").toLowerCase().includes(q) &&
        !licenceLabel.includes(q) &&
        !a.district.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <div>
      {/* Search + Status filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, phone, licence type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
            data-ocid="admin.applications.search"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | ApplicationStatus)
            }
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
            data-ocid="admin.applications.status_filter"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        {applications && applications.length > 0 && (
          <span className="text-xs text-gray-400 shrink-0">
            {filtered.length} of {applications.length}
          </span>
        )}
      </div>

      {!applications || applications.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400"
          data-ocid="admin.applications.empty_state"
        >
          <Inbox size={48} strokeWidth={1.5} />
          <p className="font-semibold text-lg">No applications yet</p>
          <p className="text-sm">
            Submitted licence applications will appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <Search size={40} strokeWidth={1.5} />
          <p className="font-semibold text-lg">No results found</p>
          <p className="text-sm">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div
          className="grid gap-4 sm:grid-cols-2"
          data-ocid="admin.applications.list"
        >
          {filtered.map((a, i) => (
            <LicenseApplicationCard
              key={String(a.id)}
              application={a}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"complaints" | "applications">(
    "complaints",
  );

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
                  Enter your password to view the admin panel
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    View complaints and licence applications
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

              {/* Tabs */}
              <div
                className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit"
                data-ocid="admin.panel.tab"
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("complaints")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "complaints"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  data-ocid="admin.complaints.tab"
                >
                  Complaints
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("applications")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "applications"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  data-ocid="admin.applications.tab"
                >
                  Licence Applications
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "complaints" ? (
                  <motion.div
                    key="complaints"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ComplaintsList />
                  </motion.div>
                ) : (
                  <motion.div
                    key="applications"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LicenseApplicationsList />
                  </motion.div>
                )}
              </AnimatePresence>
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
