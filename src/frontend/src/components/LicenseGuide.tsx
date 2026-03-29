import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  FileText,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const keyDetails = [
  {
    icon: BookOpen,
    title: "Application Process",
    content:
      "Apply online through the Sewa Setu portal using the 'Apply Online' tab, or via Public Facilitation Centres (PFC).",
  },
  {
    icon: FileText,
    title: "Documentation — Worker/Supervisor",
    content:
      "ITI Electrician Certificate (NCVT), age proof, passport photo, and treasury challan.",
  },
  {
    icon: FileText,
    title: "Documentation — Contractor",
    content:
      "PAN card, Aadhaar card, educational qualifications (ITI/Diploma/Degree), experience certificates, and business address proof.",
  },
  {
    icon: CheckCircle,
    title: "Eligibility for Supervisor",
    content:
      "Candidates need a degree/diploma in Electrical Engineering or at least 10 years of experience.",
  },
  {
    icon: Zap,
    title: "Licence Types",
    content:
      "Covers different voltage capacities (LT/MV up to 33 kV, 250 kVA generators).",
  },
  {
    icon: RefreshCw,
    title: "Renewal",
    content:
      "Contractor licenses require regular renewal — updated Electrical Supervisor License, Wireman License, and Financial Soundness Certificate.",
  },
];

const costData = [
  { type: "Wireman", appFee: "₹350" },
  { type: "Supervisor", appFee: "₹450" },
  { type: "Contractor (Class C)", appFee: "₹500" },
  { type: "Contractor (Class B)", appFee: "₹1,000" },
  { type: "Contractor (Class A)", appFee: "₹2,000" },
];

export default function LicenseGuide() {
  return (
    <section
      id="license"
      className="py-20 px-4 bg-gray-50"
      data-ocid="license.section"
    >
      <div className="max-w-6xl mx-auto">
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
              Licence Guide
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            How to Apply for an Electrician Licence in Assam
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-600 leading-relaxed">
            To obtain an electrical license in Assam, apply through the{" "}
            <strong className="text-blue-700">Sewa Setu portal</strong> or the{" "}
            <strong className="text-blue-700">ARTPS Portal</strong>, submitting
            proof of ITI certification, experience, and ID. Licenses are
            required to legally perform electrical work and are categorized by
            worker level (Wireman/Supervisor) or contractor class.
          </p>
        </motion.div>

        {/* Key Details Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {keyDetails.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-xl p-6 border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow"
              data-ocid={`license.item.${i + 1}`}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-blue-50">
                <item.icon size={20} className="text-blue-700" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cost Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700">
              <Shield size={14} /> Total Cost Breakdown
            </span>
            <h3 className="text-2xl font-extrabold mt-2 text-gray-900">
              Licence Fee Structure
            </h3>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <Table data-ocid="license.table">
              <TableHeader>
                <TableRow className="bg-blue-700 hover:bg-blue-700">
                  <TableHead className="text-white font-bold">
                    Licence Type
                  </TableHead>
                  <TableHead className="text-white font-bold">
                    Application Fee
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costData.map((row, i) => (
                  <TableRow
                    key={row.type}
                    className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    data-ocid={`license.row.${i + 1}`}
                  >
                    <TableCell className="font-semibold text-gray-800">
                      {row.type}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {row.appFee}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
            <AlertCircle
              size={14}
              className="text-yellow-600 flex-shrink-0 mt-0.5"
            />
            <p>
              Fees are indicative and subject to change. Verify latest fees at
              the official{" "}
              <a
                href="https://sewasetu.assam.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-semibold hover:underline"
              >
                Sewa Setu portal
              </a>{" "}
              or Inspectorate of Electricity (IEC) Assam.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
