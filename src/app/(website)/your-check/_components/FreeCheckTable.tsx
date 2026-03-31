"use client";

import { Trash2 } from "lucide-react";


import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CarChecksApiResponse } from "./free-car-check-data-type";
import { toast } from "sonner";
import MireyagsPagination from "@/components/ui/mireyags-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import Link from "next/link";

export default function FreeCheckTable() {
    const [currentPage, setCurrentPage] = useState(1);
   const queryClient = useQueryClient();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const { data, isLoading, isError } = useQuery<CarChecksApiResponse>({
    queryKey: ["contacts", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/check-car/my-checkcar?page=${currentPage}&limit=9`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch contacts");
      }

      return res.json();
    },
    enabled: !!token,
  });

  const contacts = data?.data ?? [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

  const { mutate } = useMutation({
    mutationKey: ["delete-contact"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/check-car/single/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.json();
    },
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Something went wrong");
        return;
      }

      toast.success(response?.message || "Your check deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: () => {
      toast.error("Failed to delete contact");
    },
  });

  const handleDelete = () => {
    if (selectedId) {
      mutate(selectedId);
    }
    setDeleteModalOpen(false);
  };
  return (
    <div className="w-full">
      
        {/* table */}
        <div className="overflow-x-auto rounded-xl border border-white">
          <table className="min-w-full">
            <thead className="bg-[#9DC2FF33]">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Reg Number
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Vehicle Name
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  View
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-center text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-[#9DC2FF33]">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-t border-white">
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-sm text-red-500"
                  >
                    Failed to load contacts.
                  </td>
                </tr>
              ) : contacts.length ? (
                contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="border-t-[1.5px] border-white transition-colors hover:bg-[#F1F6FD]"
                  >
                    <td className="px-6 py-4 text-base font-normal text-[#343A40] leading-normal">
                      {contact?.heroSection?.registrationNumber || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-base font-normal text-[#343A40] leading-normal">
                      <span className="block max-w-[260px] truncate">
                        {contact?.heroSection?.vehicleName || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-base font-normal text-[#3B82F6] underline leading-normal">
                      <Link href={`/?reg=${contact?.heroSection?.registrationNumber || ""}`}>
                      Check Again
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">

                        <button
                          type="button"
                          className="text-[#111827] transition hover:scale-105 hover:text-red-600"
                          onClick={() => {
                            setDeleteModalOpen(true);
                            setSelectedId(contact._id);
                          }}
                        >
                          <Trash2 className="h-6 w-6 text-black" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-sm text-[#6B7280]"
                  >
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}

        {totalPages > 1 && (
          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-primary leading-normal font-normal">
              Showing {currentPage} to{" "}
              9 of {data?.meta?.total || 0} results
            </p>

            <div>
              <MireyagsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}

        {/* delete modal */}
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Are You Sure?"
            desc="Are you sure you want to delete this Free Check?"
          />
        )}

      <div className="mt-5 flex justify-center">
        <Link href="/">
        <button
          type="button"
          className="h-[38px] border border-[#7F96D5] px-5 text-[16px] font-medium text-[#27459B] transition hover:bg-[#eef3ff]"
        >
          Click here to check another vehicle
        </button>
        </Link>
      </div>
    </div>
  );
}