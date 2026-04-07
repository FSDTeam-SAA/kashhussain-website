"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

import type {
  MotHistoryData,
  MotHistoryVehicle,
} from "./mot-history.types";
import {
  formatDate,
  formatMileage,
  formatRegistrationNumber,
  formatValue,
} from "./mot-history.utils";

type Props = {
  registrationNumber?: string;
  vehicle?: MotHistoryVehicle | null;
  motHistory?: MotHistoryData | null;
};

export default function MotHistoryDownloadButton({
  registrationNumber,
  vehicle,
  motHistory,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 16;
      const contentWidth = pageWidth - marginX * 2;
      let y = 0;

      const normalizedReg = formatRegistrationNumber(
        vehicle?.heroSection?.registrationNumber ||
          motHistory?.registrationNumber ||
          registrationNumber,
      );

      const ensureSpace = (neededHeight = 10) => {
        if (y + neededHeight > pageHeight - 16) {
          doc.addPage();
          y = 16;
        }
      };

      const writeWrappedText = (
        text: string,
        options?: {
          size?: number;
          color?: [number, number, number];
          indent?: number;
          lineHeight?: number;
          font?: "normal" | "bold";
        },
      ) => {
        const size = options?.size ?? 10;
        const indent = options?.indent ?? 0;
        const lineHeight = options?.lineHeight ?? 5;
        const color = options?.color ?? [71, 85, 105];
        const font = options?.font ?? "normal";

        doc.setFont("helvetica", font);
        doc.setFontSize(size);
        doc.setTextColor(...color);

        const lines = doc.splitTextToSize(text, contentWidth - indent);
        const blockHeight = lines.length * lineHeight;
        ensureSpace(blockHeight + 2);
        doc.text(lines, marginX + indent, y);
        y += blockHeight;
      };

      const writeSectionTitle = (title: string) => {
        ensureSpace(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text(title, marginX, y);
        y += 6;

        doc.setDrawColor(203, 213, 225);
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 8;
      };

      const writeField = (label: string, value?: string | number | null) => {
        const fieldText = `${label}: ${formatValue(value)}`;
        writeWrappedText(fieldText, {
          size: 10,
          color: [51, 65, 85],
          lineHeight: 5,
        });
        y += 1;
      };

      // --- HEADER ---
      doc.setFillColor(240, 245, 255); // #F0F5FF
      doc.rect(0, 0, pageWidth, 55, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(39, 71, 161); // #2747A1
      doc.text("Your Vehicle Report is Ready", pageWidth / 2, 24, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128); // #6B7280
      const subtitle = "Review the complete vehicle history, important alerts, and key details to better understand the condition and background of the vehicle.";
      const subtitleLines = doc.splitTextToSize(subtitle, pageWidth - 40);
      doc.text(subtitleLines, pageWidth / 2, 32, { align: "center", lineHeightFactor: 1.5 });

      y = 65;

      // --- DATA GRID ---
      const important = vehicle?.importantVehicleInformation || {};
      const specs = vehicle?.vehicleDetails || {};

      const leftFields = [
        { label: "Make", value: motHistory?.make || vehicle?.heroSection?.vehicleName || "Unknown" },
        { label: "First registered", value: formatDate(motHistory?.firstUsedDate) || specs?.registrationDate || "Unknown" },
        { label: "Category of origin", value: specs?.registrationPlace || "UK" },
        { label: "Police", value: important?.stolen || important?.exTaxiNhsPoliceCheck || "No" },
        { label: "Finance record", value: important?.onFinance || "No" },
        { label: "VSC count", value: specs?.lastV5CIssuedDate ? "Available" : "N/A" },
        { label: "Colour Changes", value: important?.keeperPlateChangesImportExportVinLogbookCheck?.toLowerCase().includes("colour") ? "Yes" : "No" },
        { label: "Exported", value: important?.exported || "No" },
        { label: "Internet History", value: important?.internetHistory || "No" },
      ];

      const rightFields = [
        { label: "Model", value: motHistory?.model || specs?.modelVariant || "Unknown" },
        { label: "Engine Capacity", value: motHistory?.engineSize ? `${motHistory.engineSize} cc` : specs?.engine || "Unknown" },
        { label: "Colour", value: motHistory?.primaryColour || specs?.primaryColour || "Unknown" },
        { label: "Salvage History", value: important?.salvageHistory || "No" },
        { label: "High Risk", value: important?.damageHistory || "No" },
        { label: "Write-off", value: important?.writtenOff || "No" },
        { label: "Plate Changed", value: important?.keeperPlateChangesImportExportVinLogbookCheck?.toLowerCase().includes("plate") ? "Yes" : "No" },
        { label: "Imported", value: important?.keeperPlateChangesImportExportVinLogbookCheck?.toLowerCase().includes("import") ? "Yes" : "No" },
        { label: "Service History", value: important?.fullServiceHistory || "N/A" },
      ];

      const rowHeight = 9;
      const colW = (contentWidth / 2) - 4;
      const numRows = Math.max(leftFields.length, rightFields.length);

      doc.setDrawColor(229, 231, 235); // #E5E7EB
      doc.setLineWidth(0.3);
      doc.line(pageWidth / 2, y - 5, pageWidth / 2, y + (numRows * rowHeight) - 5);

      for (let i = 0; i < numRows; i++) {
        ensureSpace(rowHeight);
        
        if (i % 2 !== 0) {
          doc.setFillColor(248, 250, 252); // #F8FAFC
          doc.rect(marginX, y - 6, colW, rowHeight, "F");
          doc.rect(pageWidth / 2 + 4, y - 6, colW, rowHeight, "F");
        }

        doc.setFontSize(9);
        
        if (leftFields[i]) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(107, 114, 128);
          doc.text(leftFields[i].label, marginX + 3, y);
          
          doc.setFont("helvetica", "bold");
          doc.setTextColor(17, 24, 39);
          doc.text(formatValue(leftFields[i].value), marginX + colW - 3, y, { align: "right" });
        }

        if (rightFields[i]) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(107, 114, 128);
          doc.text(rightFields[i].label, pageWidth / 2 + 7, y);
          
          doc.setFont("helvetica", "bold");
          doc.setTextColor(17, 24, 39);
          doc.text(formatValue(rightFields[i].value), pageWidth - marginX - 3, y, { align: "right" });
        }

        y += rowHeight;
      }

      y += 5;

      // --- ALERTS ---
      ensureSpace(80);
      const alerts: Array<{ title: string; desc: string }> = [];
      if (important?.onFinance && important.onFinance !== "No" && important.onFinance !== "N/A") {
        alerts.push({ title: "FINANCE DATA RECORDED ON THIS VEHICLE", desc: "See details in finance report" });
      }
      if (important?.writtenOff && important.writtenOff !== "No" && important.writtenOff !== "N/A") {
        alerts.push({ title: "CAT N NON STRUCTURAL DAMAGE", desc: "See details in write off report" });
      }
      if (important?.keeperPlateChangesImportExportVinLogbookCheck?.toLowerCase().includes("plate")) {
        alerts.push({ title: "PLATE CHANGE RECORD", desc: "See details in plate changes" });
      }
      if (important?.salvageHistory && important.salvageHistory !== "No" && important.salvageHistory !== "N/A") {
        alerts.push({ title: "THIS VEHICLE WAS SEEN AT SALVAGE AUCTION", desc: "See details and pictures in salvage history" });
      }
      if (important?.internetHistory && important.internetHistory !== "No" && important.internetHistory !== "N/A") {
        alerts.push({ title: "INTERNET LISTING HISTORY FOUND", desc: "See timeline and details in Internet History section" });
      }

      if (alerts.length === 0) {
        alerts.push({ title: "NO ALERTS RECORDED", desc: "This vehicle appears to have a clean history based on our records." });
      }

      const alertRowHeight = 11;
      const alertsHeight = alerts.length * alertRowHeight + 10;
      
      doc.setFillColor(254, 242, 242); // #FEF2F2
      doc.setDrawColor(254, 226, 226); // #FEE2E2
      doc.setLineWidth(0.5);
      doc.roundedRect(marginX, y, contentWidth, alertsHeight, 3, 3, "FD");

      let alertY = y + 8;
      alerts.forEach(alert => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        if (alerts[0].title === "NO ALERTS RECORDED") {
           doc.setTextColor(34, 197, 94); // Green for clean
        } else {
           doc.setTextColor(220, 38, 38); // #DC2626
        }
        
        doc.text(alert.title, marginX + 6, alertY);
        
        doc.setFont("helvetica", "normal");
        doc.text(alert.desc, marginX + 6, alertY + 4);
        
        alertY += alertRowHeight;
      });

      y += alertsHeight + 15;

      // --- EXTRA MOT DATA FOR COMPLETENESS ---
      writeSectionTitle("MOT Summary");
      writeField("Total Tests", motHistory?.totalTests);
      writeField("Total Passed", motHistory?.totalPassed);
      writeField("Total Failed", motHistory?.totalFailed);
      writeField("Latest Test Result", motHistory?.latestTestResult);
      writeField("Latest Expiry Date", formatDate(motHistory?.latestExpiryDate));

      y += 3;
      writeSectionTitle("MOT Timeline");

      const tests = motHistory?.motTests ?? [];
      if (!tests.length) {
        writeWrappedText("No MOT tests were returned for this vehicle.", {
          size: 10,
          color: [100, 116, 139],
        });
      } else {
        tests.forEach((test, index) => {
          ensureSpace(28);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(
            `${index + 1}. ${formatValue(test.testResult)} - ${formatDate(test.completedDate)}`,
            marginX,
            y,
          );
          y += 5;

          writeField(
            "Mileage",
            formatMileage(
              test.odometerValue,
              test.odometerUnit,
              test.odometerResultType,
            ),
          );
          writeField("Expiry Date", formatDate(test.expiryDate));

          const comments =
            test.rfrAndComments?.filter((comment) => Boolean(comment?.text)) ?? [];

          if (comments.length) {
            comments.forEach((comment) => {
              writeWrappedText(
                `- ${formatValue(comment.type)}: ${formatValue(comment.text)}`,
                {
                  size: 9,
                  color: [71, 85, 105],
                  indent: 3,
                  lineHeight: 4.5,
                },
              );
            });
          } else {
            writeWrappedText("- Refusals/advisories: N/A", {
              size: 9,
              color: [100, 116, 139],
              indent: 3,
            });
          }

          y += 3;
        });
      }

      const fileName = `${normalizedReg || "mot-history"}-full-report.pdf`;
      doc.save(fileName);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-[18px] border border-[#8FB3FF]/40 bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(49,89,200,0.35)] transition hover:bg-[#2747a3] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span>Download Full Report</span>
    </button>
  );
}
