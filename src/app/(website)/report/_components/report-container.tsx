import React from 'react'

const carDetailsLeft = [
  { label: 'Make', value: 'Bentley' },
  { label: 'First registered', value: '04/10/2021' },
  { label: 'Category of origin', value: 'UK' },
  { label: 'Police', value: 'No' },
  { label: 'Finance record', value: 'Yes' },
  { label: 'Police station', value: 'No' },
  { label: 'VSC count', value: '2' },
  { label: 'Colour Changes', value: 'No' },
  { label: 'Exported', value: 'No' },
  { label: 'Internet History', value: 'Yes' },
];

const carDetailsRight = [
  { label: 'Model', value: 'GT Auto' },
  { label: 'Engine Capacity', value: '5485' },
  { label: 'Colour', value: 'Blue' },
  { label: 'Salvage History', value: 'Yes' },
  { label: 'High Risk', value: 'No' },
  { label: 'Write-off', value: 'Yes' },
  { label: 'Total Keepers', value: '2' },
  { label: 'Plate Changed', value: 'Yes' },
  { label: 'Imported', value: 'No' },
  { label: 'Service History', value: 'Available' },
];

const alerts = [
  { title: 'FINANCE DATA RECORDED ON THIS VEHICLE', desc: 'See details in finance report' },
  { title: 'CAT N NON STRUCTURAL DAMAGE', desc: 'See details in write off report' },
  { title: 'PLATE CHANGE RECORD', desc: 'See details in plate changes' },
  { title: 'THIS VEHICLE WAS SEEN AT SALVAGE AUCTION', desc: 'See details and pictures in salvage history' },
  { title: 'INTERNET LISTING HISTORY FOUND', desc: 'See timeline and details in Internet History section' },
];

const ReportContainer = () => {
  return (
    <div className="w-full bg-white font-sans min-h-screen">
      {/* Header Section with Gradient */}
      <div className="relative w-full overflow-hidden bg-[#F0F5FF] px-4 py-16 sm:py-24 text-center">
        {/* Soft blur blobs for gradient effect */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#DCE6FF] rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#DCE6FF] rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
            <span className="text-[#2747A1]">Your Vehicle Report is Ready</span>
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Review the complete vehicle history, important alerts, and key details to better understand the condition and background of the vehicle.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container py-12">
        {/* Data Grid */}
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-12 relative">
          
          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#E5E7EB] transform -translate-x-1/2"></div>

          {/* Left Column */}
          <div className="flex-1 w-full pb-8 lg:pb-0">
            {carDetailsLeft.map((item, index) => (
              <div 
                key={index}
                className={`flex justify-between items-center px-4 py-3 text-sm sm:text-base rounded-md ${
                  index % 2 === 1 ? "bg-[#F8FAFC]" : "bg-white"
                }`}
              >
                <span className="text-[#6B7280] font-medium">{item.label}</span>
                <span className="text-[#111827] font-semibold">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex-1 w-full">
            {carDetailsRight.map((item, index) => (
              <div 
                key={index}
                className={`flex justify-between items-center px-4 py-3 text-sm sm:text-base rounded-md ${
                  index % 2 === 1 ? "bg-[#F8FAFC]" : "bg-white"
                }`}
              >
                <span className="text-[#6B7280] font-medium">{item.label}</span>
                <span className="text-[#111827] font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts / Warnings Section */}
        <div className="mt-12 bg-[#FEF2F2] rounded-xl p-6 sm:p-8 border border-[#FEE2E2]">
          <div className="flex flex-col gap-6">
            {alerts.map((alert, index) => (
              <div key={index} className="flex flex-col gap-1">
                <p className="text-[#DC2626] font-bold text-sm sm:text-base uppercase tracking-wide">
                  {alert.title}
                </p>
                <p className="text-[#DC2626] text-sm sm:text-base">
                  {alert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportContainer