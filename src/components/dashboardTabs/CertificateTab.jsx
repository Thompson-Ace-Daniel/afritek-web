import React, { useEffect, useMemo, useState } from "react";
import {
  Download,
  ExternalLink,
  Loader2,
  RefreshCw,
  Layers,
  FileBadge2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { certificateAPI } from "../../api/auth.api";
import { formatUsd } from "../../utils/money";
import { useAuth } from "../../hooks/useAuth";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
};

const statusTone = (status, darkMode) => {
  if (status === "revoked") {
    return darkMode
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : "bg-red-50 text-red-600 border-red-200";
  }
  return darkMode
    ? "bg-green-500/10 text-green-400 border-green-500/20"
    : "bg-green-50 text-green-600 border-green-200";
};

const CertificateCard = ({
  cert,
  darkMode,
  busyId,
  onPdf,
}) => (
  <div
    className={`rounded-xl border p-4 ${
      darkMode ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-gray-50"
    }`}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            #{cert.certificateNumber}
          </p>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusTone(
              cert.status,
              darkMode,
            )}`}
          >
            {cert.status || "valid"}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              darkMode ? "bg-zinc-800 text-zinc-300" : "bg-gray-200 text-gray-700"
            }`}
          >
            {cert.type === "consolidated" ? "Consolidated" : "Individual"}
          </span>
        </div>
        <p className={darkMode ? "text-zinc-400 text-sm" : "text-gray-500 text-sm"}>
          {Number(cert.shares || 0).toLocaleString()} {cert.shareClass} ·{" "}
          {formatUsd(cert.totalValue || 0)}
        </p>
        <p className={darkMode ? "text-zinc-500 text-xs" : "text-gray-500 text-xs"}>
          Issued {formatDate(cert.issuedAt)}
          {cert.type === "consolidated" && cert.purchaseIds?.length
            ? ` · ${cert.purchaseIds.length} purchases`
            : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onPdf(cert.id, "view")}
          disabled={busyId === cert.id}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:opacity-60"
        >
          {busyId === cert.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4" />
          )}
          View
        </button>
        <button
          onClick={() => onPdf(cert.id, "download")}
          disabled={busyId === cert.id}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
        >
          {busyId === cert.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download PDF
        </button>
      </div>
    </div>
  </div>
);

export const CertificateTab = ({ darkMode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [backfilling, setBackfilling] = useState(false);
  const [consolidating, setConsolidating] = useState(false);

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await certificateAPI.getMine();
      setItems(normalizeList(data?.data));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load certificates");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const individual = useMemo(
    () => items.filter((c) => c.type !== "consolidated"),
    [items],
  );
  const consolidated = useMemo(
    () => items.filter((c) => c.type === "consolidated"),
    [items],
  );
  const activeConsolidated = consolidated.find((c) => c.status === "valid") || null;

  const handleBackfill = async () => {
    setBackfilling(true);
    try {
      const { data } = await certificateAPI.backfill();
      const payload = data?.data || {};
      setItems(normalizeList(payload));
      if (payload.issued > 0) toast.success(`Issued ${payload.issued} certificate(s)`);
      else await load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Could not generate certificates");
    } finally {
      setBackfilling(false);
    }
  };

  const handleConsolidated = async () => {
    setConsolidating(true);
    try {
      const { data } = await certificateAPI.consolidated();
      toast.success(data?.message || "Consolidated certificate ready");
      await load();
      if (data?.data?.id) {
        // Optionally open PDF after generate
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Could not generate consolidated certificate",
      );
    } finally {
      setConsolidating(false);
    }
  };

  const saveBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const openPdf = (blob) => {
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const handlePdf = async (id, mode) => {
    setBusyId(id);
    try {
      const blob = await certificateAPI.download(id);
      const cert = items.find((item) => item.id === id);
      const name = cert?.certificateNumber || id;
      const filename = `afritek-share-certificate-${name}.pdf`;
      if (mode === "download") saveBlob(blob, filename);
      if (mode === "view") openPdf(blob);
    } catch (err) {
      toast.error(err.message || "Failed to fetch certificate PDF");
    } finally {
      setBusyId("");
    }
  };

  const hasShares = (user?.sharesOwned || 0) > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Share Certificates
          </h1>
          <p className={darkMode ? "text-zinc-400 text-sm" : "text-gray-500 text-sm"}>
            Individual certificates per verified purchase, plus one consolidated certificate for your full holding.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleBackfill}
            disabled={backfilling || loading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 ${
              darkMode
                ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {backfilling ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sync purchases
          </button>
          <button
            onClick={handleConsolidated}
            disabled={consolidating || loading || !hasShares}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-60"
          >
            {consolidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            {activeConsolidated ? "View / Refresh Consolidated" : "Generate Consolidated"}
          </button>
        </div>
      </div>

      <div
        className={`border rounded-2xl p-4 sm:p-6 space-y-6 ${
          darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"
        }`}
      >
        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className={`w-4 h-4 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
                <h2 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Consolidated certificate
                </h2>
              </div>
              {activeConsolidated ? (
                <CertificateCard
                  cert={activeConsolidated}
                  darkMode={darkMode}
                  busyId={busyId}
                  onPdf={handlePdf}
                />
              ) : (
                <p className={darkMode ? "text-zinc-400 text-sm" : "text-gray-500 text-sm"}>
                  {hasShares
                    ? "No active consolidated certificate yet. Generate one to combine all verified shares into a single document."
                    : "Buy and verify shares to unlock a consolidated certificate."}
                </p>
              )}
              {consolidated.filter((c) => c.status === "revoked").length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className={`text-xs font-medium ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>
                    Previous consolidated versions
                  </p>
                  {consolidated
                    .filter((c) => c.status === "revoked")
                    .map((cert) => (
                      <CertificateCard
                        key={cert.id}
                        cert={cert}
                        darkMode={darkMode}
                        busyId={busyId}
                        onPdf={handlePdf}
                      />
                    ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <FileBadge2 className={`w-4 h-4 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
                <h2 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Individual certificates
                </h2>
              </div>
              {individual.length === 0 ? (
                <p className={darkMode ? "text-zinc-400 text-sm" : "text-gray-500 text-sm"}>
                  {hasShares
                    ? "No individual certificates yet. Click Sync purchases to issue certificates for verified investments."
                    : "No certificates yet. Complete a share payment and verification to generate one."}
                </p>
              ) : (
                individual.map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    cert={cert}
                    darkMode={darkMode}
                    busyId={busyId}
                    onPdf={handlePdf}
                  />
                ))
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};
