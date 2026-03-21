import {
  Award,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ComplaintBox from "./components/ComplaintBox";
import MembershipPopup from "./components/MembershipPopup";

const MEMBERSHIP_FORM_URL =
  "https://wkmwdbfw.forms.app/all-india-electrician-association-membership-form";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Benefits", href: "#benefits" },
  { label: "Programs", href: "#programs" },
  { label: "Complaint", href: "#complaint" },
  { label: "Contact", href: "#contact" },
];

const benefitCards = [
  {
    icon: "🎓",
    title: "Training Programs",
    desc: "Certified skill development courses designed for the modern electrician — from basic wiring to advanced automation.",
  },
  {
    icon: "💼",
    title: "Job Network",
    desc: "Access India's largest electrician job board. Connect with contractors, industries, and government projects.",
  },
  {
    icon: "🛡️",
    title: "Advocacy",
    desc: "We represent your interests at state and national policy levels, fighting for fair wages and worker rights.",
  },
  {
    icon: "🔧",
    title: "Technical Support",
    desc: "Access a library of standards, codes, and expert guidance for every electrical challenge.",
  },
  {
    icon: "📋",
    title: "Contract Licence",
    desc: "Dedicated support to help members obtain and renew electrical contract licences with ease.",
  },
  {
    icon: "🌐",
    title: "One Rate, One Nation",
    desc: "Our flagship initiative standardizes electrician rates across India — ensuring fair pay everywhere.",
  },
];

const stats = [
  { value: "50,000+", label: "Active Members" },
  { value: "28", label: "States Covered" },
  { value: "200+", label: "Training Centers" },
  { value: "15 Yrs", label: "Of Advocacy" },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-poppins bg-white">
      <MembershipPopup />

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b bg-white shadow-sm"
        style={{ borderColor: "#e2e8f0" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-3"
            data-ocid="nav.link"
          >
            <img
              src="/assets/uploads/IMG_20260321_231245-1.png"
              alt="AIEA Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <p
                className="text-xs font-bold leading-tight"
                style={{ color: "#1d4ed8" }}
              >
                ALL INDIA ELECTRICIAN
              </p>
              <p className="text-xs font-semibold leading-tight text-gray-500">
                ASSOCIATION
              </p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
            <a
              href={MEMBERSHIP_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: "#1d4ed8" }}
              data-ocid="nav.primary_button"
            >
              Join Now
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-2"
            style={{ borderColor: "#e2e8f0" }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-2 text-sm font-medium text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
            <a
              href={MEMBERSHIP_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 py-2.5 rounded-lg text-sm font-bold text-center text-white"
              style={{ background: "#1d4ed8" }}
              data-ocid="nav.primary_button"
            >
              Join Now
            </a>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section
          id="hero"
          className="relative overflow-hidden py-20 sm:py-28 px-4"
          style={{
            background:
              "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)",
          }}
        >
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: "white" }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: "white" }}
          />

          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <Zap size={12} /> India's Largest Electrician Association
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white">
                Empowering India's
                <span style={{ color: "#93c5fd" }}> Electricians</span>
              </h1>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                Uniting skilled electricians across every state to promote safe
                practices, fair wages, and professional growth. Together, we
                power the nation.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={MEMBERSHIP_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:brightness-110 text-blue-800"
                  style={{ background: "white" }}
                  data-ocid="hero.primary_button"
                >
                  Become a Member <ChevronRight size={16} />
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/40 text-white hover:bg-white/10 transition-colors"
                  data-ocid="hero.secondary_button"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="bg-blue-700">
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {s.value}
                </p>
                <p
                  className="text-xs font-medium mt-1"
                  style={{ color: "#bfdbfe" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <section id="about" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                  About Us
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 text-gray-900">
                    Our Mission & Vision
                  </h2>
                  <p className="leading-relaxed mb-4 text-gray-600">
                    The All India Electrician Association (AIEA) was founded to
                    be the unified voice of India's electrician community. We
                    are committed to upholding professional standards, ensuring
                    worker safety, and advocating for fair compensation.
                  </p>
                  <p className="leading-relaxed text-gray-600">
                    Our{" "}
                    <strong className="text-blue-700">
                      One Rate, One Nation
                    </strong>{" "}
                    initiative is transforming the industry by standardizing
                    electrical service rates across all 28 states, bringing
                    fairness and transparency to every corner of India.
                  </p>
                </div>
                <div className="rounded-2xl p-8 border border-blue-100 bg-blue-50">
                  <div className="flex items-center gap-3 mb-6">
                    <Users size={28} className="text-blue-700" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Why Join AIEA?
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Largest electrician network in India",
                      "Government-recognized advocacy body",
                      "Certified training partnerships",
                      "Legal aid for members",
                      "Monthly knowledge seminars",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                          <Zap size={11} className="text-blue-700" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Membership Benefits
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-gray-900">
                Everything You Need to Thrive
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefitCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="rounded-xl p-6 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                  data-ocid={`benefits.item.${i + 1}`}
                >
                  <span className="text-3xl mb-4 block">{card.icon}</span>
                  <h3 className="font-bold mb-2 text-gray-900">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs */}
        <section id="programs" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Training
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-gray-900">
                Featured Programs
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  badge: "Beginner",
                  title: "Wiring Fundamentals",
                  duration: "4 Weeks",
                  desc: "Master domestic and commercial wiring from scratch with hands-on lab sessions.",
                },
                {
                  badge: "Advanced",
                  title: "Industrial Automation",
                  duration: "8 Weeks",
                  desc: "Learn PLC programming, motor control, and industrial electrical systems.",
                },
                {
                  badge: "Certification",
                  title: "Safety & Compliance",
                  duration: "2 Weeks",
                  desc: "Government-recognized certification covering IS codes, safety standards, and compliance.",
                },
              ].map((prog, i) => (
                <motion.div
                  key={prog.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                  data-ocid={`programs.item.${i + 1}`}
                >
                  <div className="h-1 bg-blue-700" />
                  <div className="p-6">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-blue-700"
                      style={{ background: "#dbeafe" }}
                    >
                      {prog.badge}
                    </span>
                    <h3 className="text-lg font-bold mt-3 mb-1 text-gray-900">
                      {prog.title}
                    </h3>
                    <p className="text-xs font-semibold mb-3 text-gray-500">
                      Duration: {prog.duration}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {prog.desc}
                    </p>
                    <a
                      href={MEMBERSHIP_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                      data-ocid={`programs.link.${i + 1}`}
                    >
                      Enroll Now <ChevronRight size={14} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section
          className="py-20 px-4"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <Award size={48} className="mx-auto mb-4 text-white opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white">
              Ready to Join 50,000+ Members?
            </h2>
            <p
              className="text-lg mb-8"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Take the next step in your career. Join AIEA today and access
              India's most comprehensive electrician support network.
            </p>
            <a
              href={MEMBERSHIP_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base uppercase tracking-wider bg-white text-blue-800 hover:brightness-105 transition-all"
              data-ocid="cta.primary_button"
            >
              Join Now 💡
            </a>
          </div>
        </section>

        {/* Complaint Box */}
        <ComplaintBox />

        {/* Contact */}
        <section id="contact" className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Get In Touch
              </span>
              <h2 className="text-3xl font-extrabold mt-2 text-gray-900">
                Contact Us
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Phone, label: "Phone", value: "+91 86384 93216" },
                {
                  icon: Mail,
                  label: "Email",
                  value: "allindiaelectricianassociation@gmail.com",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "Diphu, Karbi Anglong, Assam - 782462",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-6 text-center border border-gray-200 bg-white shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-blue-100">
                    <Icon size={22} className="text-blue-700" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 break-all">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8 px-4 bg-white"
        style={{ borderColor: "#e2e8f0" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/IMG_20260321_231245-1.png"
              alt="AIEA"
              className="h-8 w-auto object-contain"
            />
            <span className="text-sm font-semibold text-gray-500">
              All India Electrician Association
            </span>
          </div>
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
