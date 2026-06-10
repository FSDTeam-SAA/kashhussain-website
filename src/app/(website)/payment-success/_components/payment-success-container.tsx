"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, Download, Gauge, Fuel, Calendar, Clock,
  Activity, AlertTriangle, CheckCircle2, ArrowLeft, Droplets,
  ReceiptPoundSterling, TrendingUp, BarChart3, Zap,
  AlertOctagon, FileText, ShieldCheck, Ruler, Leaf, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/context/cart-context";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from "recharts";
import jsPDF from "jspdf";
import Image from "next/image";
import type { VehicleCheckData } from "@/app/(website)/vehicle-check/[regNumber]/_components/vehicle-check.types";
import type { MotHistoryData } from "@/app/(website)/mot-history/_components/mot-history.types";

// ---------- TYPES ----------

type VehicleReportData = {
  vehicle: VehicleCheckData | null;
  motHistory: MotHistoryData | null;
  registrationNumber: string;
};

type DerivedDataType = ReturnType<typeof useDerivedData> extends null ? never : NonNullable<ReturnType<typeof useDerivedData>>;

// ---------- HELPERS ----------

const FALLBACK = "N/A";

function fmt(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return FALLBACK;
  return String(val).trim() || FALLBACK;
}

function formatDate(value?: string | null): string {
  if (!value) return FALLBACK;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  }).format(d);
}

function formatMileage(val?: number | string | null): string {
  if (!val) return FALLBACK;
  const n = Number(val);
  if (isNaN(n)) return String(val);
  return new Intl.NumberFormat("en-GB").format(n);
}

function formatShortDate(value?: string | null): string {
  if (!value) return FALLBACK;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(d);
}

function getDaysLeft(value?: string | null): number | null {
  if (!value) return null;
  const expiry = new Date(value);
  const today = new Date();
  expiry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  if (isNaN(expiry.getTime())) return null;
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
}

function getDaysLeftText(value?: string | null): string {
  const days = getDaysLeft(value);
  if (days === null) return "Expiry unavailable";
  if (days < 0) return `Expired ${Math.abs(days)} days ago`;
  if (days === 0) return "Expires today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

const EMISSION_BANDS = [
  { range: "0 - 100", letter: "A", color: "bg-[#10B981]", w: "15%" },
  { range: "101 - 130", letter: "B/C", color: "bg-[#34D399]", w: "30%" },
  { range: "131 - 140", letter: "D/E", color: "bg-[#A7F3D0]", w: "45%" },
  { range: "141 - 165", letter: "F/G", color: "bg-[#FBBF24]", w: "60%" },
  { range: "166 - 225", letter: "H/I/J/K", color: "bg-[#F59E0B]", w: "80%" },
  { range: "225+", letter: "L/M", color: "bg-[#EF4444]", w: "100%" },
];

// ---------- STORAGE KEYS ----------

const STORAGE_KEY_VEHICLE = "vehicleCheckData";
const STORAGE_KEY_MOT = "motHistoryData";
const STORAGE_KEY_REG = "vehicleCheckReg";

// ---------- PDF GENERATOR ----------

async function generateVehiclePDF(
  data: VehicleReportData,
  derived: DerivedDataType,
  motTestItems: { completedDate: string | null | undefined; testResult: string | null | undefined; odometerValue: string | null | undefined; expiryDate: string | null | undefined }[]
): Promise<Blob> {

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const primaryColor = [30, 58, 138] as const;
  const darkText = [30, 41, 59] as const;
  const grayText = [100, 116, 139] as const;
  const borderColor = [203, 213, 225] as const;
  const greenColor = [22, 163, 74] as const;
  const redColor = [220, 38, 38] as const;

  const addHeader = (text: string, y: number) => {
    if (y + 15 > pageHeight - 20) { pdf.addPage(); y = margin; }
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor); pdf.text(text, margin, y);
    pdf.setDrawColor(...borderColor); pdf.setLineWidth(0.3);
    pdf.line(margin, y + 1.5, margin + contentWidth, y + 1.5);
    return y + 8;
  };

  const addField = (label: string, value: string, y: number): number => {
    if (y > pageHeight - 25) { pdf.addPage(); y = margin; }
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
    pdf.setTextColor(...grayText); pdf.text(label, margin, y);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9);
    pdf.setTextColor(...darkText);
    const labelW = pdf.getTextWidth(label + " :");
    pdf.text(value, margin + labelW + 2, y);
    return y + 6;
  };

  const addSection = (title: string, fields: { label: string; value: string }[], y: number): number => {
    y = addHeader(title, y);
    fields.forEach((f) => { y = addField(f.label, f.value, y); });
    return y + 5;
  };

  // ===== HEADER =====
  pdf.setFillColor(...primaryColor); pdf.rect(0, 0, pageWidth, 35, "F");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255); pdf.text("VEHICLE REPORT", margin, 16);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
  pdf.setTextColor(198, 208, 235);
  pdf.text(`Registration: ${(derived.reg || "N/A").toUpperCase()}`, margin, 27);
  pdf.setFontSize(7.5);
  pdf.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, pageWidth - margin - 55, 23);
  pdf.text("Payment: Completed", pageWidth - margin - pdf.getTextWidth("Payment: Completed"), 30);

  yPos = 44;
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(15);
  pdf.setTextColor(...darkText); pdf.text(derived.vehicleName, margin, yPos);
  yPos += 9;

  // Reg plate box
  pdf.setFillColor(30, 58, 138); pdf.roundedRect(margin, yPos - 2, 60, 13, 2, 2, "F");
  pdf.setFont("courier", "bold"); pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.text((derived.reg || "N/A").toUpperCase(), margin + 3, yPos + 6);
  yPos += 20;

  // ===== TAX & MOT STATUS CARDS =====
  const cardW = (contentWidth - 6) / 2;
  const cardH = 30;
  const taxHealthy = derived.taxStatus?.toLowerCase() === "taxed" || derived.taxStatus?.toLowerCase() === "valid";
  const motHealthyPdf = derived.motStatus?.toLowerCase() === "valid" || derived.motStatus?.toLowerCase() === "passed" || derived.motStatus?.toLowerCase() === "pass";

  [["TAX", derived.taxStatus, derived.taxDue, taxHealthy], ["MOT", derived.motStatus, derived.motDue, motHealthyPdf]].forEach((item, i) => {
    const x = i === 0 ? margin : margin + cardW + 6;
    const s = item[1] as string;
    const exp = item[2] as string | null;
    const healthy = item[3] as boolean;
    pdf.setFillColor(255, 255, 255); pdf.setDrawColor(...borderColor);
    pdf.roundedRect(x, yPos, cardW, cardH, 3, 3, "FD");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
    pdf.setTextColor(...primaryColor); pdf.text(item[0] as string, x + 4, yPos + 7);
    if (healthy) { pdf.setFillColor(220, 252, 231); pdf.setTextColor(...greenColor); }
    else { pdf.setFillColor(254, 226, 226); pdf.setTextColor(...redColor); }
    const bw = Math.max(pdf.getTextWidth(s) + 5, 12);
    pdf.roundedRect(x + 4, yPos + 10, bw, 5.5, 2, 2, "F");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(7);
    pdf.text(s, x + 6, yPos + 14.2);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
    pdf.setTextColor(...grayText); pdf.text(`Expires: ${formatDate(exp)}`, x + 4, yPos + 22);
  });
  yPos += cardH + 12;

  // ===== SECTIONS =====
  yPos = addSection("Vehicle Details", [
    { label: "Make", value: derived.make }, { label: "Model", value: derived.model },
    { label: "Variant", value: derived.modelVariant }, { label: "Fuel Type", value: derived.fuelType },
    { label: "Engine", value: derived.engineSizeRaw }, { label: "Colour", value: derived.colour },
    { label: "Body Style", value: derived.bodyStyle }, { label: "Year", value: String(derived.year) },
    { label: "ULEZ", value: derived.ulez }, { label: "Vehicle Age", value: derived.vehicleAge },
    { label: "First Registered", value: derived.dateFirstRegistered },
    { label: "Last V5C Issue", value: derived.lastV5cIssueDate },
    { label: "Wheel Plan", value: derived.wheelPlan },
    { label: "Type Approval", value: derived.typeApproval },
  ], yPos);

  yPos = addSection("Performance", [
    { label: "Power (BHP)", value: derived.powerBhp },
    { label: "Power (kW)", value: derived.powerKw },
    { label: "Max Speed", value: derived.maxSpeed },
    { label: "Speed (kph)", value: derived.maxSpeedKph },
    { label: "Max Torque", value: derived.maxTorque },
    { label: "0-60 mph", value: derived.zeroTo60 },
  ], yPos);

  yPos = addSection("Dimensions & Weight", [
    { label: "Power (kW)", value: derived.powerKw },
    { label: "Max Speed (kph)", value: derived.maxSpeedKph },
    { label: "Wheel Plan", value: derived.wheelPlan },
    { label: "Body Type", value: derived.bodyStyle },
  ], yPos);

  yPos = addSection("Mileage Information", [
    { label: "Last MOT Mileage", value: formatMileage(derived.lastMotMileage) },
    { label: "Mileage Issues", value: derived.mileageIssues },
    { label: "Average Mileage", value: derived.averageMileage },
    { label: "Est. Current Mileage", value: derived.estimatedMileage },
    { label: "Mileage Status", value: derived.mileageStatus },
  ], yPos);

  yPos = addSection("MOT History Summary", [
    { label: "Total Tests", value: String(derived.totalTests) },
    { label: "Passed", value: String(derived.totalPassed) },
    { label: "Failed", value: String(derived.totalFailed) },
    { label: "Pass Rate", value: derived.passRate },
    { label: "Latest Result", value: derived.motStatus },
    { label: "Last MOT Expiry", value: formatDate(derived.latestExpiryDate) },
  ], yPos);

  yPos = addSection("Safety Ratings", [
    { label: "Tax Status", value: derived.taxStatus },
    { label: "MOT Status", value: derived.motStatus },
    { label: "ULEZ", value: derived.ulez },
  ], yPos);

  yPos = addSection("CO2 Emission Figures", [
    { label: "CO2 Value", value: derived.co2 },
    { label: "Emission Band", value: derived.co2Band },
  ], yPos);

  yPos = addSection("Fuel Economy", [
    { label: "Urban", value: "N/A" },
    { label: "Extra Urban", value: "N/A" },
    { label: "Combined", value: "N/A" },
  ], yPos);

  yPos = addSection("Road Tax & Emissions", [
    { label: "Annual Cost", value: derived.taxCost },
    { label: "6 Month Cost", value: derived.taxCost6 },
    { label: "CO2 Emissions", value: derived.co2 },
    { label: "Emission Band", value: derived.co2Band },
  ], yPos);

  yPos = addSection("Important Vehicle Information", [
    { label: "Exported", value: derived.exported }, { label: "Stolen", value: derived.stolen },
    { label: "Written Off", value: derived.writtenOff }, { label: "On Finance", value: derived.onFinance },
    { label: "Damage History", value: derived.damageHistory }, { label: "Salvage History", value: derived.salvageHistory },
    { label: "Full Service History", value: derived.fullServiceHistory },
    { label: "Safety Recalls", value: derived.safetyRecalls },
    { label: "Internet History", value: derived.internetHistory },
  ], yPos);

  // ===== MOT TEST HISTORY =====
  if (motTestItems.length > 0) {
    yPos = addHeader("MOT Test History", yPos);
    motTestItems.slice(0, 15).forEach((test, idx) => {
      if (yPos > pageHeight - 25) { pdf.addPage(); yPos = margin; }
      const isPass = test.testResult?.toLowerCase() === "passed" || test.testResult?.toLowerCase() === "pass";
      pdf.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      pdf.rect(margin, yPos - 4, contentWidth, 10, "F");
      if (isPass) { pdf.setFillColor(220, 252, 231); pdf.setTextColor(...greenColor); }
      else { pdf.setFillColor(254, 226, 226); pdf.setTextColor(...redColor); }
      pdf.roundedRect(margin, yPos - 3, 12, 5.5, 1.5, 1.5, "F");
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(6);
      pdf.text(isPass ? "PASS" : "FAIL", margin + 1.5, yPos + 1);
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(8);
      pdf.setTextColor(...darkText);
      pdf.text(formatDate(test.completedDate), margin + 16, yPos + 1);
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(8);
      pdf.setTextColor(...grayText);
      pdf.text(test.odometerValue ? `${formatMileage(test.odometerValue)} mi` : FALLBACK, margin + contentWidth - 45, yPos + 1);
      yPos += 12;
    });
  }

  // ===== FOOTER =====
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text("CarCheckAI - Vehicle Report", margin, pageHeight - 8);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - pdf.getTextWidth(`Page ${i} of ${totalPages}`), pageHeight - 8);
    pdf.setDrawColor(...borderColor); pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
  }

  return pdf.output("blob");
}

// ---------- DERIVED DATA HOOK ----------

function useDerivedData(reportData: VehicleReportData | null) {
  const motHistory = reportData?.motHistory;

  const mileageChartData = useMemo(() => {
    if (!motHistory?.motTests) return [];
    const records = motHistory.motTests
      .filter((t) => t.odometerValue && t.completedDate)
      .map((t) => ({
        year: new Date(t.completedDate as string).getFullYear().toString(),
        mileage: Number.parseInt(String(t.odometerValue), 10),
        fullDate: new Date(t.completedDate as string),
      }))
      .filter((item) => !Number.isNaN(item.mileage))
      .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
    const seen = new Set();
    return records.filter((r) => {
      if (seen.has(r.year)) return false;
      seen.add(r.year);
      return true;
    });
  }, [motHistory]);

  return useMemo(() => {
    if (!reportData?.vehicle && !reportData?.motHistory) return null;
    const { vehicle, motHistory: md } = reportData;
    const det = vehicle?.vehicleDetails;
    const stat = vehicle?.status;
    const mile = vehicle?.mileage;
    const motSum = vehicle?.motHistory;
    const perf = vehicle?.performance;
    const roadT = vehicle?.roadTax;
    const fl = vehicle?.vehicleFlags;

    let hasMileageIssues = false;
    if (md?.motTests && md.motTests.length >= 2) {
      const sorted = [...md.motTests]
        .filter((t) => t.completedDate && t.odometerValue)
        .sort((a, b) => new Date(a.completedDate!).getTime() - new Date(b.completedDate!).getTime());
      for (let i = 1; i < sorted.length; i++) {
        if (Number(sorted[i].odometerValue) < Number(sorted[i - 1].odometerValue)) { hasMileageIssues = true; break; }
      }
    }

    const totalTests = md?.totalTests ?? motSum?.totalTests ?? 0;
    const totalPassed = md?.totalPassed ?? motSum?.passed ?? 0;
    const totalFailed = md?.totalFailed ?? motSum?.failed ?? 0;
    const motChartData = [
      { name: "Passed", value: totalPassed, color: "#16a34a" },
      { name: "Failed", value: totalFailed, color: "#dc2626" },
    ];

    const motTestItems = (md?.motTests || [])
      .filter((t) => t.completedDate)
      .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime());

    const co2Value = roadT?.co2Emissions || vehicle?.emissions?.co2Gkm || FALLBACK;
    const co2Band = roadT?.co2EmissionBand || FALLBACK;

    return {
      vehicleName: [det?.make, det?.model, det?.modelVariant].filter(Boolean).join(" ") || "Vehicle Details Unavailable",
      fuelType: det?.fuelType || md?.fuelType || FALLBACK,
      engineSize: (() => {
        const raw = det?.engineCapacity || md?.engineSize;
        if (!raw) return FALLBACK;
        const n = Number.parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
        if (!isNaN(n) && n > 500) return (n / 1000).toFixed(1) + "L";
        return String(raw);
      })(),
      colour: det?.colour || md?.primaryColour || FALLBACK,
      year: det?.yearOfManufacture || FALLBACK,
      bodyStyle: det?.bodyStyle || det?.modelVariant || FALLBACK,
      regDate: det?.dateFirstRegistered || FALLBACK,
      ulez: det?.ulezCompliant || FALLBACK,
      make: det?.make || FALLBACK,
      model: det?.model || FALLBACK,
      taxStatus: stat?.taxStatus || FALLBACK,
      taxDue: stat?.taxDueDate || null,
      motStatus: stat?.motStatus || md?.latestTestResult || FALLBACK,
      motDue: stat?.motExpiryDate || md?.latestExpiryDate || null,
      lastMotMileage: mile?.lastMotMileage || md?.lastMileage?.toString() || FALLBACK,
      averageMileage: mile?.averageMileage || FALLBACK,
      estimatedMileage: mile?.estimatedCurrentMileage || FALLBACK,
      mileageIssues: hasMileageIssues ? "Yes" : (mile?.mileageIssues || "No"),
      mileageStatus: hasMileageIssues ? "FLAGGED" : (mile?.mileageStatus?.toUpperCase() || "VERIFIED"),
      totalTests, totalPassed, totalFailed,
      passRate: motSum?.passRate || (totalTests ? `${((totalPassed / totalTests) * 100).toFixed(0)}%` : FALLBACK),
      powerBhp: perf?.powerBhp ? `${perf.powerBhp} bhp` : FALLBACK,
      maxSpeed: perf?.maxSpeedMph ? `${perf.maxSpeedMph} mph` : FALLBACK,
      maxTorque: perf?.maxTorqueNm ? `${perf.maxTorqueNm} Nm` : FALLBACK,
      zeroTo60: perf?.zeroTo60Mph ? `${perf.zeroTo60Mph}s` : FALLBACK,
      powerKw: perf?.powerKw ? `${perf.powerKw} kW` : FALLBACK,
      maxSpeedKph: perf?.maxSpeedKph ? `${perf.maxSpeedKph} kph` : FALLBACK,
      co2: co2Value,
      co2Band,
      taxCost: roadT?.cost12Months || FALLBACK,
      taxCost6: roadT?.cost6Months || FALLBACK,
      reg: reportData.registrationNumber,
      exported: fl?.exported || FALLBACK,
      stolen: fl?.stolen || FALLBACK,
      writtenOff: fl?.writtenOff || FALLBACK,
      onFinance: fl?.onFinance || FALLBACK,
      damageHistory: fl?.damageHistory || FALLBACK,
      salvageHistory: fl?.salvageHistory || FALLBACK,
      fullServiceHistory: fl?.fullServiceHistory || FALLBACK,
      safetyRecalls: fl?.safetyRecalls || FALLBACK,
      internetHistory: fl?.internetHistory || FALLBACK,
      mileageChartData, motChartData, motTestItems,
      vehicleAge: det?.vehicleAge || FALLBACK,
      wheelPlan: det?.wheelPlan || FALLBACK,
      typeApproval: det?.typeApproval || FALLBACK,
      dateFirstRegistered: det?.dateFirstRegistered || FALLBACK,
      lastV5cIssueDate: det?.lastV5cIssueDate || FALLBACK,
      modelVariant: det?.modelVariant || FALLBACK,
      latestExpiryDate: md?.latestExpiryDate || FALLBACK,
      lastMileage: formatMileage(md?.lastMileage),
      engineSizeRaw: det?.engineCapacity || md?.engineSize || FALLBACK,
    };
  }, [reportData, mileageChartData]);
}

// ---------- COMPONENT ----------

export default function PaymentSuccessContainer() {
  const router = useRouter();
  const { clearOrderData } = useCart();
  const hasClearedRef = useRef(false);

  const [reportData, setReportData] = useState<VehicleReportData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const derivedData = useDerivedData(reportData);
  const hasReportData = !!reportData && (!!reportData.vehicle || !!reportData.motHistory);
  const formatMileageNumber = (val: number) => new Intl.NumberFormat("en-GB").format(val);

  useEffect(() => {
    try {
      const storedVehicle = localStorage.getItem(STORAGE_KEY_VEHICLE);
      const storedMot = localStorage.getItem(STORAGE_KEY_MOT);
      const storedReg = localStorage.getItem(STORAGE_KEY_REG);
      if (storedVehicle || storedReg) {
        const vehicle: VehicleCheckData | null = storedVehicle ? JSON.parse(storedVehicle) : null;
        const motHistoryData: MotHistoryData | null = storedMot ? JSON.parse(storedMot) : null;
        const regNumber = storedReg || vehicle?.registrationNumber || motHistoryData?.registrationNumber || "";
        setReportData({ vehicle, motHistory: motHistoryData, registrationNumber: regNumber });
      }
    } catch (error) {
      console.error("Failed to load vehicle report data:", error);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasClearedRef.current) return;
    hasClearedRef.current = true;
    try {
      localStorage.removeItem("product_cart");
      localStorage.removeItem("product_delivery_info");
      clearOrderData?.();
    } catch (error) {
      console.error("Failed to clear checkout data:", error);
    }
  }, [clearOrderData]);

  const handleContinueBrowsing = () => router.push("/");

  const handleDownloadPdf = useCallback(async () => {
    if (!reportData || !derivedData) return;
    setIsPdfGenerating(true);
    try {
      const motTests = derivedData.motTestItems.map(t => ({
        completedDate: t.completedDate,
        testResult: t.testResult,
        odometerValue: t.odometerValue,
        expiryDate: t.expiryDate,
      }));
      const blob = await generateVehiclePDF(reportData, derivedData, motTests);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const reg = reportData.registrationNumber || "vehicle";
      link.download = `vehicle-report-${reg.toUpperCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  }, [reportData, derivedData]);

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-lg mx-4">
          <div className="h-12 bg-gray-200 rounded-xl w-1/2 mx-auto" />
          <div className="h-8 bg-gray-200 rounded-xl w-3/4 mx-auto" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-100 rounded-2xl" /><div className="h-32 bg-gray-100 rounded-2xl" />
          </div>
          <div className="h-48 bg-gray-100 rounded-2xl" /><div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <section className="relative bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3730a3] pt-16 pb-28 md:pb-36 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-400/20 backdrop-blur-sm border-2 border-green-400/30 shadow-lg shadow-green-500/10">
              <CheckCircle className="text-green-400" size={44} />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Payment Successful!</h1>
          <p className="text-blue-200 max-w-lg mx-auto text-sm md:text-base">
            Thank you! Your payment has been processed successfully.
            {hasReportData && " Your comprehensive vehicle report is ready below."}
          </p>
        </div>
      </section>

      <div className="relative z-20 -mt-16 md:-mt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">

          <div className="bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 border border-green-100">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">Payment Completed</p>
                  <p className="text-[13px] text-[#64748B]">via Stripe &bull; {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              {hasReportData && (
                <Button onClick={handleDownloadPdf} disabled={isPdfGenerating}
                  className="h-[46px] px-6 text-sm font-semibold rounded-[12px] gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]">
                  {isPdfGenerating ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating...</>
                  ) : (<><Download className="h-4 w-4" /> Download PDF Report</>)}
                </Button>
              )}
            </div>
          </div>

          {hasReportData && derivedData ? (
            <>
              <div className="rounded-2xl border border-white/50 bg-white/95 p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-stretch gap-6">
                <div className="relative h-32 w-48 sm:h-[130px] sm:w-[200px] shrink-0 overflow-hidden rounded-[14px] bg-gradient-to-br from-gray-50 to-gray-100 border border-slate-200/50 shadow-inner">
                  <Image src="/assets/images/car.jpg" alt="Car" width={200} height={130} className="object-cover w-full h-full" />
                </div>
                <div className="flex flex-col justify-center flex-1 w-full text-center sm:text-left">
                  <div className="mx-auto sm:mx-0 inline-flex items-center gap-2.5 rounded-lg bg-[#1e3a8a] px-3.5 py-1.5 font-bold tracking-widest text-white shadow-[0_4px_12px_rgba(30,58,138,0.2)] mb-4">
                    <span className="text-[14px]">🏁</span>
                    <span className="border-r border-white/20 pr-2.5 text-[15px] uppercase">{derivedData.reg?.toUpperCase() || "N/A"}</span>
                    <Gauge className="w-4 h-4 text-white/70 ml-2.5" />
                  </div>
                  <h2 className="text-[24px] sm:text-[28px] font-extrabold text-slate-800 mb-4 leading-tight">{derivedData.vehicleName}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <Badge icon={<Fuel className="h-[14px] w-[14px]" />} text={derivedData.fuelType.toLowerCase()} />
                    <Badge icon={<Droplets className="h-[14px] w-[14px]" />} text={derivedData.engineSize} />
                    <Badge icon={<Calendar className="h-[14px] w-[14px]" />} text={String(derivedData.year)} />
                    <Badge icon={<Activity className="h-[14px] w-[14px]" />} text={derivedData.colour} />
                    <StatusBadge text={`MOT ${derivedData.motStatus?.toLowerCase() === "valid" || derivedData.motStatus?.toLowerCase() === "passed" || derivedData.motStatus?.toLowerCase() === "pass" ? "Valid" : "Expired"}`}
                      valid={derivedData.motStatus?.toLowerCase() === "valid" || derivedData.motStatus?.toLowerCase() === "passed" || derivedData.motStatus?.toLowerCase() === "pass"} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatusCard title="Tax" status={derivedData.taxStatus} expiry={derivedData.taxDue}
                  healthy={derivedData.taxStatus?.toLowerCase() === "taxed" || derivedData.taxStatus?.toLowerCase() === "valid"} />
                <StatusCard title="MOT" status={derivedData.motStatus} expiry={derivedData.motDue}
                  healthy={derivedData.motStatus?.toLowerCase() === "valid" || derivedData.motStatus?.toLowerCase() === "passed" || derivedData.motStatus?.toLowerCase() === "pass"} />
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<TrendingUp className="h-5 w-5 text-[#1e3a8a]" />} title="Mileage Information" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <StatBox label="Last MOT Mileage" value={formatMileage(derivedData.lastMotMileage)} />
                  <StatBox label="Average Mileage" value={fmt(derivedData.averageMileage)} />
                  <StatBox label="Est. Current" value={fmt(derivedData.estimatedMileage)} />
                  <StatBox label="Issues" value={derivedData.mileageIssues} danger={derivedData.mileageIssues === "Yes"} />
                </div>
                <div className="flex items-center justify-between px-1 mb-6">
                  <span className="text-[13px] font-medium text-gray-500">Mileage Status</span>
                  <span className={`inline-flex items-center rounded-full px-3.5 py-1 text-[10px] uppercase font-bold border ${derivedData.mileageStatus === "FLAGGED" ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>{derivedData.mileageStatus}</span>
                </div>
                {derivedData.mileageChartData.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6 mt-4 border-t border-gray-100 pt-6">
                    <div className="rounded-xl border border-slate-100/80 bg-gray-50/50 p-5 min-h-[300px]">
                      <h4 className="text-[12px] font-bold text-[#1e3a8a] mb-6 tracking-wider uppercase">Mileage Timeline</h4>
                      <div className="relative pl-[14px]">
                        <div className="absolute left-[19.5px] top-3 bottom-8 w-[2px] bg-slate-200 rounded-full z-0" />
                        {[...derivedData.mileageChartData].reverse().map((record, index) => (
                          <div key={index} className="relative flex items-start gap-5 mb-6 last:mb-2 z-10 group">
                            <div className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white border-[2.5px] border-emerald-400 shadow-[0_0_0_4px_rgba(255,255,255,1)] mt-[6px]" />
                            <div className="flex flex-col">
                              <span className="text-[11px] font-extrabold text-slate-500/80 tracking-wide flex items-center gap-1.5">{record.year}<Gauge className="w-[10px] h-[10px] opacity-40" /></span>
                              <span className="text-[14px] font-extrabold text-[#1e3a8a] mt-1">{formatMileageNumber(record.mileage)} miles</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-100/80 bg-gray-50/50 p-5 min-h-[300px]">
                      <h4 className="text-[12px] font-bold text-[#1e3a8a] mb-6 tracking-wider uppercase">Mileage Trend</h4>
                      <div className="h-[230px] -ml-2">
                        {derivedData.mileageChartData.length > 1 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={derivedData.mileageChartData} margin={{ top: 10, right: 10, left: -5, bottom: 5 }}>
                              <defs><linearGradient id="gM4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} /></linearGradient></defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={15} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} tickFormatter={(v: number) => v >= 1000 ? `${v / 1000}k` : String(v)} dx={-10} />
                              <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 14px' }}
                                labelStyle={{ fontWeight: 800, color: '#1e3a8a', marginBottom: 6, fontSize: 13 }}
                                itemStyle={{ padding: 0, fontWeight: 700, fontSize: 12, color: '#475569' }}
                                formatter={(value: number) => [`${formatMileageNumber(value)} miles`, ""]} />
                              <Area type="monotone" dataKey="mileage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#gM4)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2.5 }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (<div className="h-full flex items-center justify-center text-[13px] text-slate-400 italic">Need at least two recordings for a trend line.</div>)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<BarChart3 className="h-5 w-5 text-green-600" />} title="MOT History Summary" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[{ l: "Total", v: derivedData.totalTests, c: "text-gray-900" }, { l: "Passed", v: derivedData.totalPassed, c: "text-green-600" }, { l: "Failed", v: derivedData.totalFailed, c: "text-red-600" }].map((item) => (
                        <div key={item.l} className="rounded-xl bg-gray-50 p-4 text-center border border-gray-100">
                          <p className="text-[11px] font-medium text-gray-500">{item.l}</p>
                          <p className={`mt-2 text-2xl font-bold ${item.c}`}>{item.v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between px-1"><span className="text-[13px] font-medium text-gray-500">Pass Rate</span><span className="font-bold text-gray-900 text-sm">{derivedData.passRate}</span></div>
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: derivedData.totalTests > 0 ? `${(derivedData.totalPassed / derivedData.totalTests) * 100}%` : "0%" }} />
                    </div>
                    {derivedData.latestExpiryDate !== FALLBACK && <p className="mt-3 text-[12px] text-gray-500">Last MOT Expiry: {formatShortDate(derivedData.latestExpiryDate)}</p>}
                  </div>
                  <div className="flex items-center justify-center h-[200px]">
                    {derivedData.totalTests > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={derivedData.motChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                            {derivedData.motChartData.map((entry, idx) => (<Cell key={idx} fill={entry.color} stroke={entry.color} strokeWidth={0} />))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '8px 12px' }} formatter={(value: number, name: string) => [value, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (<p className="text-[13px] text-slate-400 italic">No MOT data</p>)}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<Zap className="h-5 w-5 text-amber-500" />} title="Performance" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatBox label="Power" value={derivedData.powerBhp} />
                  <StatBox label="Max Speed" value={derivedData.maxSpeed} />
                  <StatBox label="Max Torque" value={derivedData.maxTorque} />
                  <StatBox label="0-60 mph" value={derivedData.zeroTo60} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<Ruler className="h-5 w-5 text-indigo-500" />} title="Dimensions & Weight" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatBox label="Power (kW)" value={derivedData.powerKw} />
                  <StatBox label="Max Speed (kph)" value={derivedData.maxSpeedKph} />
                  <StatBox label="Wheel Plan" value={fmt(derivedData.wheelPlan)} />
                  <StatBox label="Body Type" value={derivedData.bodyStyle} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<FileText className="h-5 w-5 text-purple-600" />} title="Vehicle Details" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  {[
                    { l: "Make", v: derivedData.make }, { l: "Model", v: derivedData.model },
                    { l: "Model Variant", v: derivedData.modelVariant }, { l: "Fuel Type", v: derivedData.fuelType },
                    { l: "Engine", v: derivedData.engineSizeRaw }, { l: "Colour", v: derivedData.colour },
                    { l: "Body Style", v: derivedData.bodyStyle }, { l: "Year", v: String(derivedData.year) },
                    { l: "First Registered", v: derivedData.dateFirstRegistered }, { l: "Last V5C Issue", v: derivedData.lastV5cIssueDate },
                    { l: "ULEZ Compliant", v: derivedData.ulez }, { l: "Vehicle Age", v: derivedData.vehicleAge },
                    { l: "Wheel Plan", v: derivedData.wheelPlan }, { l: "Type Approval", v: derivedData.typeApproval },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2.5 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">{item.l}</span>
                      <span className="text-[13px] font-semibold text-gray-900 text-right ml-4">{item.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<ShieldCheck className="h-5 w-5 text-blue-600" />} title="Safety Ratings" />
                <div className="space-y-4">
                  {[{ l: "Tax Status", v: derivedData.taxStatus }, { l: "MOT Status", v: derivedData.motStatus }, { l: "ULEZ", v: derivedData.ulez }].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2 text-[13px]"><span className="font-semibold text-gray-600">{item.l}</span><span className="font-bold text-gray-900">{item.v}</span></div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-800 rounded-full" style={{ width: "100%" }} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<Leaf className="h-5 w-5 text-green-600" />} title="CO2 Emission Figures" />
                <div className="mb-4 text-center"><p className="text-[22px] font-bold text-gray-900">{derivedData.co2} ({derivedData.co2Band})</p></div>
                <div className="space-y-2.5 px-2">
                  {EMISSION_BANDS.map((band, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-[11px]">
                      <span className="w-14 text-right font-medium text-gray-500 whitespace-nowrap">{band.range}</span>
                      <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden"><div className={`h-full rounded-r-full ${band.color}`} style={{ width: band.w }} /></div>
                      <span className="w-6 font-bold text-gray-900">{band.letter}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<Fuel className="h-5 w-5 text-blue-500" />} title="Fuel Economy" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatBox label="Urban" value="N/A" />
                  <StatBox label="Extra Urban" value="N/A" />
                  <StatBox label="Combined" value="N/A" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<ReceiptPoundSterling className="h-5 w-5 text-emerald-600" />} title="Road Tax & Emissions" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatBox label="Annual Cost" value={derivedData.taxCost} />
                  <StatBox label="CO2 Emissions" value={derivedData.co2} />
                  <StatBox label="Emission Band" value={derivedData.co2Band} />
                </div>
                {derivedData.taxCost6 !== FALLBACK && <p className="mt-3 text-[12px] text-gray-400">6 Month Cost: {derivedData.taxCost6}</p>}
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<AlertOctagon className="h-5 w-5 text-red-500" />} title="Important Vehicle Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  {[
                    { l: "Exported", v: derivedData.exported }, { l: "Stolen", v: derivedData.stolen },
                    { l: "Written Off", v: derivedData.writtenOff }, { l: "On Finance", v: derivedData.onFinance },
                    { l: "Damage History", v: derivedData.damageHistory }, { l: "Salvage History", v: derivedData.salvageHistory },
                    { l: "Full Service History", v: derivedData.fullServiceHistory }, { l: "Safety Recalls", v: derivedData.safetyRecalls },
                    { l: "Internet History", v: derivedData.internetHistory },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2.5 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">{item.l}</span>
                      <span className="text-[13px] font-semibold text-gray-900">{item.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                <SectionHeader icon={<Star className="h-5 w-5 text-rose-500" />} title="Service History Check" />
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <span className="mb-4 inline-flex items-center justify-center rounded-full bg-rose-50 px-3.5 py-1 text-[10px] font-bold tracking-wider text-rose-500 border border-rose-100 uppercase">NEW</span>
                  <h4 className="text-[15px] font-bold text-gray-900 leading-snug">Check the full service history for {derivedData.reg?.toUpperCase()}</h4>
                  <p className="mt-2.5 max-w-xs text-[12px] leading-relaxed text-gray-500">We check where, by whom, mileage at each visit, the type of service performed, and details of the work carried out.</p>
                </div>
              </div>

              {derivedData.motTestItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
                  <SectionHeader icon={<Clock className="h-5 w-5 text-blue-600" />} title="MOT Test History" />
                  <div className="space-y-1">
                    {derivedData.motTestItems.map((test, idx) => {
                      const isPass = test.testResult?.toLowerCase() === "passed" || test.testResult?.toLowerCase() === "pass";
                      return (
                        <div key={idx} className="flex items-center justify-between py-2.5 px-4 rounded-xl even:bg-gray-50 hover:bg-gray-50/80 transition-colors">
                          <div className="flex items-center gap-3">
                            {isPass ? <CheckCircle2 className="h-[18px] w-[18px] text-green-500 shrink-0" /> : <AlertTriangle className="h-[18px] w-[18px] text-red-500 shrink-0" />}
                            <span className="text-sm font-semibold text-gray-900">{formatShortDate(test.completedDate)}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[12px] text-gray-500 font-medium">{test.odometerValue ? `${formatMileage(test.odometerValue)} mi` : "N/A"}</span>
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${isPass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{test.testResult || "N/A"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : null}

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Button onClick={handleContinueBrowsing} className="h-[48px] px-8 text-sm text-white font-semibold rounded-[12px] bg-[#1e3a8a] hover:bg-[#1e40af]">
              <ArrowLeft className="h-4 w-4 mr-2" /> Continue Browsing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50/50 px-3 py-1.5 text-[12px] font-bold text-slate-600 shadow-sm">
      {icon}<span className="capitalize">{text}</span>
    </span>
  );
}

function StatusBadge({ text, valid }: { text: string; valid: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold shadow-sm border transition-all ${valid ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
      {valid ? <CheckCircle2 className="h-[14px] w-[14px]" /> : <AlertTriangle className="h-[14px] w-[14px]" />}
      <span>{text}</span>
    </span>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 border border-blue-100">{icon}</div>
      <h3 className="font-bold text-[#1E293B] text-[16px]">{title}</h3>
    </div>
  );
}

function StatBox({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-center border border-gray-100">
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-lg font-bold ${danger ? "text-red-600" : "text-[#1e3a8a]"}`}>{value}</p>
    </div>
  );
}

function StatusCard({ title, status, expiry, healthy }: { title: string; status: string; expiry: string | null; healthy: boolean }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#111827]">{title}</p>
          <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${healthy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{status}</span>
          <p className="mt-2 text-sm text-[#4B5563]">Expires: {formatDate(expiry)}</p>
          <p className={`mt-1 text-sm font-semibold ${healthy ? "text-green-600" : "text-red-600"}`}>{getDaysLeftText(expiry)}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${healthy ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          {healthy ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
        </div>
      </div>
    </div>
  );
}