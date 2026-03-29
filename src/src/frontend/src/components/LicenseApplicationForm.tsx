import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";

interface FileField {
  key: string;
  label: string;
  accept: string;
  required: boolean;
  note?: string;
}

const fileFields: FileField[] = [
  {
    key: "iti",
    label: "ITI / Qualification Certificate",
    accept: ".pdf,image/*",
    required: true,
  },
  {
    key: "ageProof",
    label: "Age Proof / Date of Birth Certificate",
    accept: ".pdf,image/*",
    required: true,
  },
  {
    key: "photo",
    label: "Passport Size Photo",
    accept: "image/*",
    required: true,
  },
  {
    key: "aadhaar",
    label: "Aadhaar Card",
    accept: ".pdf,image/*",
    required: true,
  },
  {
    key: "challan",
    label: "Treasury Challan",
    accept: ".pdf,image/*",
    required: true,
  },
  {
    key: "experience",
    label: "Experience Certificate",
    accept: ".pdf,image/*",
    required: false,
    note: "Required for Supervisor/Contractor",
  },
  {
    key: "pan",
    label: "PAN Card",
    accept: ".pdf,image/*",
    required: false,
    note: "Required for Contractor",
  },
  {
    key: "businessProof",
    label: "Business Address Proof",
    accept: ".pdf,image/*",
    required: false,
    note: "Required for Contractor",
  },
];

export default function LicenseApplicationForm() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    dob: "",
    licenceType: "",
    address: "",
    district: "",
    state: "Assam",
  });
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [declared, setDeclared] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInput = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFile = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required.";
    if (!form.dob) newErrors.dob = "Date of birth is required.";
    if (!form.licenceType)
      newErrors.licenceType = "Please select a licence type.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.district.trim()) newErrors.district = "District is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    for (const f of fileFields) {
      if (f.required && !files[f.key]) {
        newErrors[f.key] = `${f.label} is required.`;
      }
    }
    if (!paymentFile)
      newErrors.paymentScreenshot = "Payment screenshot is required.";
    if (!declared) newErrors.declaration = "Please accept the declaration.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstError = document.querySelector("[data-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!actor) {
      setSubmitError("Unable to connect to the server. Please try again.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      let photo: ExternalBlob | null = null;
      if (files.photo) {
        photo = ExternalBlob.fromBytes(
          new Uint8Array(await files.photo.arrayBuffer()),
        );
      }

      let paymentScreenshot: ExternalBlob | null = null;
      if (paymentFile) {
        paymentScreenshot = ExternalBlob.fromBytes(
          new Uint8Array(await paymentFile.arrayBuffer()),
        );
      }

      let aadhaarCard: ExternalBlob | null = null;
      if (files.aadhaar) {
        aadhaarCard = ExternalBlob.fromBytes(
          new Uint8Array(await files.aadhaar.arrayBuffer()),
        );
      }

      let ageProof: ExternalBlob | null = null;
      if (files.ageProof) {
        ageProof = ExternalBlob.fromBytes(
          new Uint8Array(await files.ageProof.arrayBuffer()),
        );
      }

      await (actor as any).submitLicenseApplication(
        form.fullName,
        form.mobile,
        form.email,
        form.dob,
        form.licenceType,
        form.address,
        form.district,
        form.state,
        photo,
        paymentScreenshot,
        aadhaarCard,
        ageProof,
      );

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError(
        "Something went wrong submitting your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section
        id="apply-licence"
        className="py-20 px-4 bg-white"
        data-ocid="apply_licence.section"
      >
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center shadow-sm"
            data-ocid="apply_licence.success_state"
          >
            <CheckCircle size={56} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We will review your documents and contact you within{" "}
              <strong>5–7 working days</strong>.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSubmitted(false);
                setForm({
                  fullName: "",
                  mobile: "",
                  email: "",
                  dob: "",
                  licenceType: "",
                  address: "",
                  district: "",
                  state: "Assam",
                });
                setFiles({});
                setPaymentFile(null);
                setDeclared(false);
              }}
              data-ocid="apply_licence.secondary_button"
            >
              Submit Another Application
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="apply-licence"
      className="py-20 px-4 bg-white"
      data-ocid="apply_licence.section"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Licence Application
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Apply for Electrician Licence
          </h2>
          <p className="mt-3 text-gray-500 text-sm">
            Fill in the form below. All required documents must be uploaded in
            PDF or image format.
          </p>
        </motion.div>

        {/* Payment QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-blue-200 bg-blue-50 p-6 mb-8 text-center"
          data-ocid="apply_licence.payment_qr.panel"
        >
          <h3 className="font-bold text-blue-800 text-lg mb-1">
            Pay Licence Charges
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            Scan the QR code below to pay the licence fee. After payment, upload
            your payment screenshot in the form.
          </p>
          <div className="flex justify-center">
            <img
              src="/assets/uploads/screenshot_2026-03-24-23-43-54-22_b86b87620f0dd897e4c0859ecbb2d537-019d210e-8103-734e-a6fb-0e2f27cb2fb2-1.jpg"
              alt="Payment QR Code for Licence Charges"
              className="w-56 h-56 object-contain rounded-xl border border-blue-200 bg-white p-2 shadow-sm"
              data-ocid="apply_licence.payment_qr.image"
            />
          </div>
          <p className="text-xs text-blue-600 mt-3 font-medium">
            Keep your payment receipt or screenshot ready before filling the
            form.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Personal Info */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-200 pb-3">
              Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div data-error={!!errors.fullName || undefined}>
                <Label
                  htmlFor="fullName"
                  className="mb-1.5 block font-semibold text-gray-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => handleInput("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.fullName ? "border-red-400" : ""}
                  data-ocid="apply_licence.input"
                />
                {errors.fullName && (
                  <p
                    className="text-xs text-red-500 mt-1"
                    data-ocid="apply_licence.error_state"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div data-error={!!errors.mobile || undefined}>
                <Label
                  htmlFor="mobile"
                  className="mb-1.5 block font-semibold text-gray-700"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => handleInput("mobile", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className={errors.mobile ? "border-red-400" : ""}
                  data-ocid="apply_licence.input"
                />
                {errors.mobile && (
                  <p
                    className="text-xs text-red-500 mt-1"
                    data-ocid="apply_licence.error_state"
                  >
                    {errors.mobile}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="mb-1.5 block font-semibold text-gray-700"
                >
                  Email{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInput("email", e.target.value)}
                  placeholder="email@example.com"
                  data-ocid="apply_licence.input"
                />
              </div>
              <div data-error={!!errors.dob || undefined}>
                <Label
                  htmlFor="dob"
                  className="mb-1.5 block font-semibold text-gray-700"
                >
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleInput("dob", e.target.value)}
                  className={errors.dob ? "border-red-400" : ""}
                  data-ocid="apply_licence.input"
                />
                {errors.dob && (
                  <p
                    className="text-xs text-red-500 mt-1"
                    data-ocid="apply_licence.error_state"
                  >
                    {errors.dob}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Licence Details */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-200 pb-3">
              Licence Details
            </h3>
            <div data-error={!!errors.licenceType || undefined}>
              <Label
                htmlFor="licenceType"
                className="mb-1.5 block font-semibold text-gray-700"
              >
                Licence Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.licenceType}
                onValueChange={(v) => handleInput("licenceType", v)}
              >
                <SelectTrigger
                  id="licenceType"
                  className={errors.licenceType ? "border-red-400" : ""}
                  data-ocid="apply_licence.select"
                >
                  <SelectValue placeholder="Select licence type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wireman">Wireman</SelectItem>
                  <SelectItem value="supervisor">
                    Electrical Supervisor
                  </SelectItem>
                  <SelectItem value="contractor-c">
                    Contractor Class C
                  </SelectItem>
                  <SelectItem value="contractor-b">
                    Contractor Class B
                  </SelectItem>
                  <SelectItem value="contractor-a">
                    Contractor Class A
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.licenceType && (
                <p
                  className="text-xs text-red-500 mt-1"
                  data-ocid="apply_licence.error_state"
                >
                  {errors.licenceType}
                </p>
              )}
            </div>
            <div data-error={!!errors.address || undefined}>
              <Label
                htmlFor="address"
                className="mb-1.5 block font-semibold text-gray-700"
              >
                Full Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => handleInput("address", e.target.value)}
                placeholder="House No., Street, Area, City..."
                rows={3}
                className={errors.address ? "border-red-400" : ""}
                data-ocid="apply_licence.textarea"
              />
              {errors.address && (
                <p
                  className="text-xs text-red-500 mt-1"
                  data-ocid="apply_licence.error_state"
                >
                  {errors.address}
                </p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div data-error={!!errors.district || undefined}>
                <Label
                  htmlFor="district"
                  className="mb-1.5 block font-semibold text-gray-700"
                >
                  District <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="district"
                  value={form.district}
                  onChange={(e) => handleInput("district", e.target.value)}
                  placeholder="e.g. Karbi Anglong"
                  className={errors.district ? "border-red-400" : ""}
                  data-ocid="apply_licence.input"
                />
                {errors.district && (
                  <p
                    className="text-xs text-red-500 mt-1"
                    data-ocid="apply_licence.error_state"
                  >
                    {errors.district}
                  </p>
                )}
              </div>
              <div data-error={!!errors.state || undefined}>
                <Label
                  htmlFor="state"
                  className="mb-1.5 block font-semibold text-gray-700"
                >
                  State <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => handleInput("state", e.target.value)}
                  className={errors.state ? "border-red-400" : ""}
                  data-ocid="apply_licence.input"
                />
                {errors.state && (
                  <p
                    className="text-xs text-red-500 mt-1"
                    data-ocid="apply_licence.error_state"
                  >
                    {errors.state}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-200 pb-3">
              Document Uploads
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {fileFields.map((f) => (
                <div key={f.key} data-error={!!errors[f.key] || undefined}>
                  <Label className="mb-1.5 block font-semibold text-gray-700 text-sm">
                    {f.label}{" "}
                    {f.required ? (
                      <span className="text-red-500">*</span>
                    ) : (
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    )}
                  </Label>
                  {f.note && (
                    <p className="text-xs text-blue-600 mb-1.5">{f.note}</p>
                  )}
                  <label
                    className={`flex items-center gap-3 cursor-pointer rounded-lg border-2 border-dashed px-4 py-3 transition-colors ${
                      errors[f.key]
                        ? "border-red-400 bg-red-50"
                        : files[f.key]
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    data-ocid="apply_licence.upload_button"
                  >
                    <Upload
                      size={16}
                      className={
                        files[f.key] ? "text-blue-600" : "text-gray-400"
                      }
                    />
                    <span className="text-sm truncate text-gray-600">
                      {files[f.key] ? files[f.key]?.name : "Click to upload"}
                    </span>
                    <input
                      type="file"
                      accept={f.accept}
                      className="sr-only"
                      onChange={(e) =>
                        handleFile(f.key, e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                  {errors[f.key] && (
                    <p
                      className="text-xs text-red-500 mt-1"
                      data-ocid="apply_licence.error_state"
                    >
                      {errors[f.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Screenshot Upload */}
          <div
            className={`rounded-2xl border p-6 space-y-3 ${
              errors.paymentScreenshot
                ? "border-red-300 bg-red-50"
                : "border-green-200 bg-green-50"
            }`}
            data-ocid="apply_licence.payment_screenshot.panel"
          >
            <h3 className="font-bold text-gray-800 text-lg border-b border-green-200 pb-3">
              Payment Screenshot <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600">
              After scanning the QR code and completing payment, upload your
              payment confirmation screenshot here.
            </p>
            <div data-error={!!errors.paymentScreenshot || undefined}>
              <label
                className={`flex items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed px-5 py-4 transition-colors ${
                  errors.paymentScreenshot
                    ? "border-red-400 bg-red-50"
                    : paymentFile
                      ? "border-green-500 bg-green-100"
                      : "border-green-300 bg-white hover:border-green-400 hover:bg-green-50"
                }`}
                data-ocid="apply_licence.payment_screenshot.upload_button"
              >
                <Upload
                  size={20}
                  className={paymentFile ? "text-green-600" : "text-gray-400"}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    {paymentFile
                      ? paymentFile.name
                      : "Upload Payment Screenshot"}
                  </p>
                  {!paymentFile && (
                    <p className="text-xs text-gray-400">
                      JPG, PNG or PDF accepted
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="sr-only"
                  onChange={(e) => {
                    setPaymentFile(e.target.files?.[0] ?? null);
                    setErrors((prev) => ({ ...prev, paymentScreenshot: "" }));
                  }}
                />
              </label>
              {paymentFile && (
                <div className="mt-3">
                  {paymentFile.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(paymentFile)}
                      alt="Payment preview"
                      className="max-h-40 rounded-lg border border-green-200 object-contain"
                    />
                  )}
                </div>
              )}
              {errors.paymentScreenshot && (
                <p
                  className="text-xs text-red-500 mt-1"
                  data-ocid="apply_licence.error_state"
                >
                  {errors.paymentScreenshot}
                </p>
              )}
            </div>
          </div>

          {/* Declaration */}
          <div
            className={`rounded-xl border px-5 py-4 flex items-start gap-3 ${
              errors.declaration
                ? "border-red-300 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            data-ocid="apply_licence.panel"
          >
            <Checkbox
              id="declaration"
              checked={declared}
              onCheckedChange={(v) => {
                setDeclared(!!v);
                setErrors((prev) => ({ ...prev, declaration: "" }));
              }}
              className="mt-0.5"
              data-ocid="apply_licence.checkbox"
            />
            <div>
              <label
                htmlFor="declaration"
                className="text-sm text-gray-700 cursor-pointer leading-relaxed"
              >
                I declare that all the information provided is true and correct
                to the best of my knowledge.
              </label>
              {errors.declaration && (
                <p
                  className="text-xs text-red-500 mt-1"
                  data-ocid="apply_licence.error_state"
                >
                  {errors.declaration}
                </p>
              )}
            </div>
          </div>

          <AnimatePresence>
            {Object.keys(errors).length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-600 text-center"
                data-ocid="apply_licence.error_state"
              >
                Please fix the errors above before submitting.
              </motion.p>
            )}
          </AnimatePresence>

          {submitError && (
            <p
              className="text-sm text-red-600 text-center"
              data-ocid="apply_licence.error_state"
            >
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full py-6 text-base font-bold rounded-xl"
            style={{ background: submitting ? undefined : "#1d4ed8" }}
            data-ocid="apply_licence.submit_button"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
