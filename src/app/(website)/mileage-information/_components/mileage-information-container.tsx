"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Gauge, CheckCircle2, Calendar, Droplets, Fuel, AlertCircle, ArrowLeft } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { VehicleCheckData } from "@/app/(website)/vehicle-check/[regNumber]/_components/vehicle-check.types";
import Image from "next/image";

type Props = {
  vehicle?: VehicleCheckData | null;
};

type RawVehicleData = {
  vehicle?: {
    mot?: {
      test_result?: Array<{
        test_date?: string;
        odometer_reading?: string;
      }>;
    };
  };
};

export default function MileageInformationContainer({ vehicle }: Props) {


  const router = useRouter();
  const regNumber = vehicle?.registrationNumber || "";
  
  const vehicleName =
    [vehicle?.vehicleDetails?.make, vehicle?.vehicleDetails?.model, vehicle?.vehicleDetails?.modelVariant]
      .filter(Boolean)
      .join(" ") || "Unknown Vehicle";

  const fuelType = vehicle?.vehicleDetails?.fuelType || "N/A";
  
  // Format engine capacity to Litres if it's in cc (e.g. 2998 -> 3.0L)
  const engineSize = useMemo(() => {
    const raw = vehicle?.vehicleDetails?.engineCapacity;
    if (!raw) return "N/A";
    const numeric = parseInt(raw.toString().replace(/[^0-9]/g, ""), 10);
    if (!isNaN(numeric) && numeric > 500) {
      return (numeric / 1000).toFixed(1) + "L";
    }
    return raw;
  }, [vehicle]);

  const year = vehicle?.vehicleDetails?.yearOfManufacture || "N/A";

  const motStatus = (vehicle?.status?.motStatus || "").toLowerCase();
  const motValid = motStatus === "valid" || motStatus === "passed" || motStatus === "pass";

  // Parse actual chronological records
  const rawResponse = vehicle?.rawResponse as RawVehicleData | undefined;
  const motTestResult = rawResponse?.vehicle?.mot?.test_result;

  const mileageRecords = useMemo(() => {
    if (!motTestResult) return [];
    
    // Sort descending for timeline viewing
    const records = motTestResult
      .filter((test) => test.odometer_reading && test.test_date)
      .map((test) => {
        const date = new Date(test.test_date as string);
        const mileage = parseInt(
          String(test.odometer_reading).replace(/[^0-9]/g, ""),
          10,
        );
        return {
          year: date.getFullYear().toString(),
          mileage,
          fullDate: date,
        };
      })
      .filter((record) => !Number.isNaN(record.mileage) && !Number.isNaN(record.fullDate.getTime()))
      .sort((a, b) => b.fullDate.getTime() - a.fullDate.getTime());

    // De-duplication for timeline (keeping the latest valid record for that specific year)
    const uniqueRecords = [];
    const seenYears = new Set();
    for (const rec of records) {
      if (!seenYears.has(rec.year)) {
        seenYears.add(rec.year);
        uniqueRecords.push(rec);
      }
    }
    
    return uniqueRecords;
  }, [motTestResult]);

  const chartData = useMemo(() => {
      // Recharts plots nicely from oldest (left) to newest (right). We reverse our descending list.
      return [...mileageRecords].reverse();
  }, [mileageRecords]);

  const formatMileageNumber = (val: number) => new Intl.NumberFormat("en-GB").format(val);

  return (
    <div className="flex flex-col pb-24 font-sans text-gray-900 border-t border-gray-100/50">
      
      {/* HEADER GRADIENT HERO */}
      <section className="relative h-[300px] md:h-[361px] bg-[linear-gradient(135deg,_#EAF5FF_25%,_#CFE1FF_60.36%,_#C6CCDD_95.71%)] pt-6">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1100px]">
           <button 
             onClick={() => router.back()} 
             className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-800 transition-colors bg-white/40 hover:bg-white/70 px-3.5 py-2 rounded-full backdrop-blur-sm border border-white/40 shadow-sm"
           >
             <ArrowLeft className="w-4 h-4" />
             Back to vehicle
           </button>
        </div>

        <div className="container h-full flex flex-col items-center justify-center text-center -mt-10 pb-8">
          <h1 className="text-[36px] sm:text-[42px] font-extrabold text-primary tracking-tight leading-tight">
            Vehicle Mileage History
          </h1>
          <p className="mt-4 text-[14px] sm:text-[15px] text-[#6B7280] leading-relaxed font-medium">
            View the complete mileage records of this vehicle and track its usage over time with verified data sources.
          </p>
        </div>
      </section>

      {/* CORE CONTENT LAYOUT */}
      <section className="container mt-8 relative z-20">
        
        {/* CAR OVERVIEW BANNER */}
        <div className="rounded-2xl border border-white/50 bg-white/95 p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-stretch gap-6 transition-all">
          
          <div className="relative h-32 w-48 sm:h-[130px] sm:w-[200px] shrink-0 overflow-hidden rounded-[14px] bg-[linear-gradient(to_bottom_right,#F8FAFC,#E2E8F0)] flex flex-col items-center justify-center border border-slate-200/50 shadow-inner">
             <Image src="/assets/images/car.jpg" alt="Car" width={200} height={130} className="object-cover w-full h-full" />
          </div>

          <div className="flex flex-col justify-center flex-1 w-full text-center sm:text-left">
            {/* Premium Reg Plate Badge */}
            <div className="mx-auto sm:mx-0 inline-flex items-center gap-2.5 rounded-lg bg-[#1e3a8a] px-3.5 py-1.5 font-bold tracking-widest text-white shadow-[0_4px_12px_rgba(30,58,138,0.2)] mb-4">
               <div className="flex items-center gap-1.5 border-r border-white/20 pr-2.5">
                  <span className="text-[14px]">🏁</span>
               </div>
               <span className="text-[15px] uppercase">{regNumber}</span>
               <div className="flex items-center gap-1.5 border-l border-white/20 pl-2.5">
                  <Gauge className="w-4 h-4 text-white/70" />
               </div>
            </div>

            <h2 className="text-[24px] sm:text-[28px] font-extrabold text-slate-800 mb-5 leading-tight">{vehicleName}</h2>

            {/* Badges Flow */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-auto pb-1">
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50/50 px-3 py-1.5 text-[12px] font-bold text-slate-600 shadow-sm transition-colors hover:bg-white hover:border-blue-200">
                <Fuel className="h-[14px] w-[14px] text-blue-500 stroke-[2.5]" />
                <span className="capitalize">{fuelType.toLowerCase()}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50/50 px-3 py-1.5 text-[12px] font-bold text-slate-600 shadow-sm transition-colors hover:bg-white hover:border-blue-200">
                <Droplets className="h-[14px] w-[14px] text-blue-500 stroke-[2.5]" />
                <span>{engineSize}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50/50 px-3 py-1.5 text-[12px] font-bold text-slate-600 shadow-sm transition-colors hover:bg-white hover:border-blue-200">
                <Calendar className="h-[14px] w-[14px] text-blue-500 stroke-[2.5]" />
                <span>{year}</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold shadow-sm border transition-all ${motValid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {motValid ? <CheckCircle2 className="h-[14px] w-[14px] stroke-[2.5]" /> : <AlertCircle className="h-[14px] w-[14px] stroke-[2.5]" />}
                <span>MOT {motValid ? "Valid" : "Expired"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION DRIVER */}
        <div className="mt-14 mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
             <Gauge className="h-5 w-5 text-[#1e3a8a] stroke-[2]" />
          </div>
          <h3 className="text-[22px] font-bold text-[#1e3a8a] tracking-tight">Mileage History</h3>
        </div>

        {/* DATA PANELS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6">
          
          {/* TIMELINE COLUMN */}
          <div className="rounded-[20px] border border-slate-100/80 bg-white p-7 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col h-full min-h-[400px]">
            <h4 className="text-[13px] font-bold text-[#1e3a8a] mb-8 tracking-wider uppercase opacity-90">Mileage Timeline</h4>
            
            <div className="relative pl-[14px] flex-1">
              {mileageRecords.length > 0 && (
                <div className="absolute left-[19.5px] top-3 bottom-8 w-[2px] bg-slate-100 rounded-full z-0"></div>
              )}

              {mileageRecords.map((record, index) => (
                <div key={index} className="relative flex items-start gap-5 mb-9 last:mb-2 z-10 group">
                  <div className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white border-[2.5px] border-emerald-400 shadow-[0_0_0_4px_rgba(255,255,255,1)] mt-[6px] transition-transform group-hover:scale-110" />
                  <div className="flex flex-col bg-white pr-2 py-0.5">
                     <span className="text-[12px] font-extrabold text-slate-500/80 flex items-center gap-1.5 tracking-wide">
                        {record.year}
                        <Gauge className="w-[11px] h-[11px] opacity-40 ml-0.5" />
                     </span>
                     <span className="text-[15px] font-extrabold text-[#1e3a8a] mt-1.5 transition-colors">
                        {formatMileageNumber(record.mileage)} miles
                     </span>
                  </div>
                </div>
              ))}

              {mileageRecords.length === 0 && (
                <div className="text-[13px] text-slate-400 py-6 italic flex flex-col items-center justify-center h-full gap-2 border-2 border-dashed border-slate-100/80 rounded-xl">
                   <Gauge className="w-8 h-8 opacity-20" />
                   No recorded mileages found.
                </div>
              )}
            </div>
          </div>

          {/* TREND CHART COLUMN */}
          <div className="rounded-[20px] border border-slate-100/80 bg-white p-7 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col h-full min-h-[400px]">
            <h4 className="text-[13px] font-bold text-[#1e3a8a] mb-8 tracking-wider uppercase opacity-90">Mileage Trend</h4>
            
            <div className="relative flex-1 w-full h-[320px] mt-2 pb-2 -ml-2">
               {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -5, bottom: 5 }}>
                    <defs>
                        <linearGradient id="gradientMileage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    
                    <XAxis 
                       dataKey="year" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                       dy={15}
                    />
                    
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                       tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                       dx={-10}
                    />
                    
                    <Tooltip 
                       cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                       contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px 14px' }}
                       labelStyle={{ fontWeight: '800', color: '#1e3a8a', marginBottom: '6px', fontSize: '13px' }}
                       itemStyle={{ padding: 0, fontWeight: '700', fontSize: '12px', color: '#475569' }}
                       formatter={(value: number) => [`${formatMileageNumber(value)} miles`, '']}
                    />
                    
                    <Area 
                       type="monotone" 
                       dataKey="mileage" 
                       stroke="#3b82f6" 
                       strokeWidth={3} 
                       fillOpacity={1}
                       fill="url(#gradientMileage)" 
                       activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2.5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
               ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-[13px] text-slate-400 italic gap-2 border-2 border-dashed border-slate-100/80 rounded-xl">
                   <Gauge className="w-8 h-8 opacity-20" />
                   {chartData.length === 1 ? "Need at least two recordings for a trend line." : "Insufficient data for trend chart."}
                </div>
               )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
