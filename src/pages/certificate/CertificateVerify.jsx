import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import { certificateAPI } from "../../api/auth.api";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
};

export default function CertificateVerify() {
  const { number } = useParams();
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await certificateAPI.verifyNumber(number);
        setCert(data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || "Certificate was not found.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [number]);

  const isValid = cert?.valid && cert?.status !== "revoked";

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-white">Certificate Verification</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Verify AFRITEK share certificate authenticity using certificate number or QR code.
        </p>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="flex items-center gap-2 text-red-300 font-medium">
              <ShieldX className="w-4 h-4" /> Not verified
            </p>
            <p className="mt-1 text-sm text-red-200">{error}</p>
          </div>
        ) : (
          <div
            className={`mt-6 rounded-xl border p-4 space-y-2 ${
              isValid
                ? "border-green-500/30 bg-green-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}
          >
            <p
              className={`flex items-center gap-2 font-medium ${
                isValid ? "text-green-300" : "text-red-300"
              }`}
            >
              {isValid ? (
                <>
                  <ShieldCheck className="w-4 h-4" /> Valid certificate
                </>
              ) : (
                <>
                  <ShieldX className="w-4 h-4" /> Revoked certificate
                </>
              )}
            </p>
            <p className="text-sm text-zinc-200">
              <span className="text-zinc-400">Status:</span>{" "}
              <span className="capitalize">{cert?.status || "—"}</span>
            </p>
            <p className="text-sm text-zinc-200">
              <span className="text-zinc-400">Type:</span>{" "}
              <span className="capitalize">{cert?.type || "individual"}</span>
            </p>
            <p className="text-sm text-zinc-200">
              <span className="text-zinc-400">Certificate No:</span> {cert?.certificateNumber}
            </p>
            <p className="text-sm text-zinc-200">
              <span className="text-zinc-400">Investor:</span> {cert?.holderName || "—"}
            </p>
            <p className="text-sm text-zinc-200">
              <span className="text-zinc-400">Shares:</span>{" "}
              {Number(cert?.shares || 0).toLocaleString()} {cert?.shareClass}
            </p>
            {cert?.sharesInWords && (
              <p className="text-sm text-zinc-200">
                <span className="text-zinc-400">Shares in words:</span> {cert.sharesInWords}
              </p>
            )}
            <p className="text-sm text-zinc-200">
              <span className="text-zinc-400">Issue Date:</span> {formatDate(cert?.issueDate)}
            </p>
            <p className="text-sm text-zinc-200">
              <span className="text-zinc-400">Company:</span> {cert?.companyName || "—"}
            </p>
            {cert?.revokedAt && (
              <p className="text-sm text-zinc-200">
                <span className="text-zinc-400">Revoked:</span> {formatDate(cert.revokedAt)}
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <Link to="/" className="text-sm text-amber-400 hover:text-amber-300">
            Back to AFRITEK
          </Link>
        </div>
      </div>
    </div>
  );
}
