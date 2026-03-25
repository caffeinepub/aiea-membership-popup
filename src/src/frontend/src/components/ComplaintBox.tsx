import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";

export default function ComplaintBox() {
  const { actor } = useActor();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMsg("");

    try {
      let externalBlob: ExternalBlob | null = null;
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        externalBlob = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
      }

      await actor.submitComplaint(name, phone, subject, message, externalBlob);

      setSubmitStatus("success");
      setName("");
      setPhone("");
      setSubject("");
      setMessage("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (_err) {
      setSubmitStatus("error");
      setErrorMsg("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="complaint" className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
            Grievance Redressal
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-gray-900">
            Complaint Box
          </h2>
          <p className="mt-3 text-sm text-gray-500 max-w-lg mx-auto">
            Have an issue or concern? Submit your complaint below and our team
            will address it promptly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-gray-200 bg-white shadow-md p-8"
          data-ocid="complaint.panel"
        >
          {submitStatus === "success" ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-4 text-center"
              data-ocid="complaint.success_state"
            >
              <CheckCircle2 size={52} className="text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Complaint Submitted!
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Thank you for reaching out. We have received your complaint and
                will get back to you as soon as possible.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => setSubmitStatus("idle")}
                data-ocid="complaint.secondary_button"
              >
                Submit Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="complaint-name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="complaint-name"
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                    data-ocid="complaint.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="complaint-phone"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="complaint-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                    data-ocid="complaint.input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="complaint-subject"
                  className="text-sm font-semibold text-gray-700"
                >
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="complaint-subject"
                  type="text"
                  placeholder="Brief description of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                  data-ocid="complaint.input"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="complaint-message"
                  className="text-sm font-semibold text-gray-700"
                >
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="complaint-message"
                  placeholder="Describe your complaint in detail..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-100 resize-none"
                  data-ocid="complaint.textarea"
                />
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Photo Evidence{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>

                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                      data-ocid="complaint.close_button"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-48 h-32 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    data-ocid="complaint.upload_button"
                  >
                    <ImagePlus
                      size={24}
                      className="text-blue-400 group-hover:text-blue-600 transition-colors"
                    />
                    <span className="text-xs font-medium text-blue-500 group-hover:text-blue-700 transition-colors">
                      Attach Photo
                    </span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                  data-ocid="complaint.dropzone"
                />
              </div>

              {submitStatus === "error" && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                  data-ocid="complaint.error_state"
                >
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-2.5 font-bold text-sm uppercase tracking-wider text-white transition-all hover:brightness-110"
                  style={{ background: "#1d4ed8" }}
                  data-ocid="complaint.submit_button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
