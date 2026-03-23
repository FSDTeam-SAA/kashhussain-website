"use client";

import { Trash2 } from "lucide-react";

type FreeCheckItem = {
  id: number;
  regNumber: string;
  vehicleName: string;
};

type FreeCheckTableProps = {
  data: FreeCheckItem[];
};

export default function FreeCheckTable({ data }: FreeCheckTableProps) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-[6px] bg-[#9DC2FF33]">
        <table className="container mx-auto  border-collapse">
          <thead>
            <tr className="border-b border-[white]">
              <th className="px-4 py-3 text-center text-[18px] font-semibold text-[#3A3A3A]">
                Reg Number
              </th>
              <th className="px-4 py-3 text-center text-[18px] font-semibold text-[#3A3A3A]">
                Vehicle Name
              </th>
              <th className="px-4 py-3 text-center text-[18px] font-semibold text-[#3A3A3A]">
                View
              </th>
              <th className="px-4 py-3 text-center text-[18px] font-semibold text-[#3A3A3A]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={index !== data.length - 1 ? "border-b border-[white]" : ""}
              >
                <td className="px-4 py-4 text-center text-[14px] text-[#4B4B4B]">
                  {item.regNumber}
                </td>
                <td className="px-4 py-4 text-center text-[14px] text-[#4B4B4B]">
                  {item.vehicleName}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    type="button"
                    className="text-[14px] text-[#3D6BFF] underline-offset-2 hover:underline"
                  >
                    Check Again
                  </button>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center text-[#1E1E1E]"
                  >
                    <Trash2 size={15} strokeWidth={1.8} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          className="h-[38px] border border-[#7F96D5] px-5 text-[16px] font-medium text-[#27459B] transition hover:bg-[#eef3ff]"
        >
          Click here to check another vehicle
        </button>
      </div>
    </div>
  );
}