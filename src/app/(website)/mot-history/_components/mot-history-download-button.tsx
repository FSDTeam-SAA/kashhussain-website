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
      const sectionGap = 8;
      let y = 18;

      const normalizedReg = formatRegistrationNumber(
        vehicle?.heroSection?.registrationNumber ||
          motHistory?.registrationNumber ||
          registrationNumber,
      );
      const vehicleTitle =
        [motHistory?.make, motHistory?.model].filter(Boolean).join(" ") ||
        vehicle?.heroSection?.vehicleName ||
        vehicle?.vehicleDetails?.modelVariant ||
        "Vehicle record";

      const ensureSpace = (neededHeight = 10) => {
        if (y + neededHeight > pageHeight - 16) {
          doc.addPage();
          y = 18;
        }
      };

      const writeWrappedText = (
        text: string,
        options?: {
          size?: number;
          color?: [number, number, number];
          indent?: number;
          lineHeight?: number;
        },
      ) => {
        const size = options?.size ?? 10;
        const indent = options?.indent ?? 0;
        const lineHeight = options?.lineHeight ?? 5;
        const color = options?.color ?? [71, 85, 105];

        doc.setFont("helvetica", "normal");
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
        y += sectionGap;
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

      doc.setFillColor(12, 21, 40);
      doc.rect(0, 0, pageWidth, 34, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text("MOT History Report", marginX, 15);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(vehicleTitle, marginX, 22);
      doc.text(`Registration: ${normalizedReg || "N/A"}`, marginX, 28);

      y = 42;

      writeSectionTitle("Vehicle Overview");
      writeField("Make", motHistory?.make || vehicle?.heroSection?.vehicleName);
      writeField("Model", motHistory?.model || vehicle?.vehicleDetails?.modelVariant);
      writeField(
        "Primary Colour",
        motHistory?.primaryColour || vehicle?.vehicleDetails?.primaryColour,
      );
      writeField("Fuel Type", motHistory?.fuelType || vehicle?.vehicleDetails?.fuelType);
      writeField(
        "Engine Size",
        motHistory?.engineSize
          ? `${motHistory.engineSize} cc`
          : vehicle?.vehicleDetails?.engine,
      );
      writeField("First Used Date", formatDate(motHistory?.firstUsedDate));
      writeField(
        "Year of Manufacture",
        vehicle?.vehicleDetails?.yearOfManufacture,
      );
      writeField(
        "Registration Date",
        vehicle?.vehicleDetails?.registrationDate,
      );
      writeField(
        "Last V5C Issued Date",
        formatDate(vehicle?.vehicleDetails?.lastV5CIssuedDate),
      );
      writeField(
        "Wheel Plan",
        vehicle?.vehicleDetails?.wheelPlan,
      );
      writeField(
        "Exported",
        vehicle?.importantVehicleInformation?.exported,
      );
      writeField("CO2 Emission", vehicle?.co2EmissionFigures?.value);

      y += 3;
      writeSectionTitle("MOT Summary");
      writeField("Total Tests", motHistory?.totalTests);
      writeField("Total Passed", motHistory?.totalPassed);
      writeField("Total Failed", motHistory?.totalFailed);
      writeField("Latest Test Result", motHistory?.latestTestResult);
      writeField("Latest Expiry Date", formatDate(motHistory?.latestExpiryDate));
      writeField(
        "Last Mileage",
        formatMileage(
          motHistory?.lastMileage,
          motHistory?.motTests?.[0]?.odometerUnit,
          motHistory?.motTests?.[0]?.odometerResultType,
        ),
      );

      y += 3;
      writeSectionTitle("Timeline");

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
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text(
            `${index + 1}. ${formatValue(test.testResult)} - ${formatDate(test.completedDate)}`,
            marginX,
            y,
          );
          y += 6;

          writeField(
            "Mileage",
            formatMileage(
              test.odometerValue,
              test.odometerUnit,
              test.odometerResultType,
            ),
          );
          writeField("Expiry Date", formatDate(test.expiryDate));
          writeField("Odometer Status", test.odometerResultType);

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
              y += 1;
            });
          } else {
            writeWrappedText("- Refusals/advisories: N/A", {
              size: 9,
              color: [100, 116, 139],
              indent: 3,
              lineHeight: 4.5,
            });
            y += 1;
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
      className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-[18px] border border-[#8FB3FF]/40 bg-[#3159C8] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(49,89,200,0.35)] transition hover:bg-[#2747a3] disabled:cursor-not-allowed disabled:opacity-70"
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
