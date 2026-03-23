import {
  Briefcase,
  FileText,
  Globe,
  GraduationCap,
  Shield,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const MEMBERSHIP_FORM_URL =
  "https://wkmwdbfw.forms.app/all-india-electrician-association-membership-form";
const SESSION_KEY = "aiea_popup_dismissed";

const benefits = [
  {
    icon: GraduationCap,
    title: "Training & Skill Development",
    desc: "Access certified programs to upgrade your electrical expertise",
  },
  {
    icon: Briefcase,
    title: "Job Opportunities & Networking",
    desc: "Connect with contractors, companies and fellow professionals",
  },
  {
    icon: Shield,
    title: "Advocacy Support",
    desc: "We fight for your rights and represent your interests",
  },
  {
    icon: Wrench,
    title: "Technical Resources & Expertise",
    desc: "Access manuals, standards, and expert guidance",
  },
  {
    icon: FileText,
    title: "Electrical Contract Licence Support",
    desc: "Guidance and assistance with licensing requirements",
  },
  {
    icon: Globe,
    title: "One Rate, One Nation",
    desc: "Standardized rates for electricians across all of India",
  },
];

export default function MembershipPopup() {
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setVisible(true);
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };

    const onScroll = () => {
      const scrolled =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= 0.25) trigger();
    };

    const timer = setTimeout(trigger, 30000);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-ocid="membership.modal"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={dismiss}
            onKeyDown={(e) => e.key === "Escape" && dismiss()}
            role="presentation"
          />

          {/* Modal card */}
          <motion.dialog
            open
            className="relative w-full max-w-[580px] rounded-2xl overflow-hidden p-0 border-0 bg-white shadow-2xl"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Membership invitation"
          >
            {/* Blue top accent bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background: "linear-gradient(90deg, #1d4ed8, #60a5fa, #1d4ed8)",
              }}
            />

            <div className="px-7 pt-6 pb-7">
              {/* Top row: logo + close */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/uploads/IMG_20260321_231245-1-1.png"
                    alt="All India Electrician Association"
                    className="h-12 w-auto object-contain"
                  />
                  <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">
                    All India Electrician Association
                  </span>
                </div>
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                  data-ocid="membership.close_button"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight leading-tight mb-3 text-gray-900">
                Join India's Largest
                <br />
                <span className="text-blue-700">Electrician Community! 🚀</span>
              </h2>

              {/* Subtext */}
              <p className="text-sm leading-relaxed mb-6 text-gray-600">
                Get access to training, job opportunities, and advocacy support.
                Support our mission to promote{" "}
                <strong className="text-blue-700">safe and efficient</strong>{" "}
                electrical practices.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {benefits.map(({ icon: Icon, title, desc }, i) => (
                  <div
                    key={title}
                    className="flex items-start gap-3"
                    data-ocid={`membership.item.${i + 1}`}
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-blue-100">
                      <Icon size={17} className="text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight mb-0.5 text-gray-900">
                        {title}
                      </p>
                      <p className="text-xs leading-snug text-gray-500">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                className="rounded-xl p-5 text-center"
                style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
              >
                <a
                  href={MEMBERSHIP_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 rounded-xl text-base font-bold uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                  }}
                  data-ocid="membership.primary_button"
                >
                  Join Now 💡
                </a>
                <a
                  href={MEMBERSHIP_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  data-ocid="membership.link"
                >
                  Learn more about member benefits →
                </a>
              </div>
            </div>
          </motion.dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
