"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FaCircleNotch, FaCirclePlus, FaXmark } from "react-icons/fa6";
import ButtonSelectColor from "../button/buttonSelectColor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Equipment } from "@/types/equipment";
import { MdDelete } from "react-icons/md";
import BorrowForm from "../forms/BorrowForm";
import { BorrowListDetail } from "@/types/borrowList";
import ButtonPrimary from "../button/buttonPrimary";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import PaginationList from "../pagination/PaginationList";
import { toast, Toaster } from "react-hot-toast";

type DialogData = {
  onClick?: () => void; // ฟังก์ชันที่จะเรียกเมื่อคลิก
  className?: string; // รองรับคลาสเพิ่มเติม
  onClose: () => void;
  idDel?: string;
  open: boolean;
  title: string;
  data: BorrowListDetail[];
  handleResponse: (status: string) => void;
};

type Signature = {
  id: number;
  image_path: string;
  image_name: string;
};

export const DialogShowBorrowApproval = ({
  onClick,
  className,
  onClose,
  open,
  title,
  data,
  handleResponse,
}: DialogData) => {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<string>("");
  const user = useSelector((state: any) => state.auth.user);
  const [signatureUrls, setSignatureUrls] = useState<{ [key: string]: string }>(
    {},
  );
  const [perPage, setPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const perPageSelectorHandler = (perPage: number) => {
    setCurrentPage(1);
    setPerPage(perPage);
  };

  const pageDirectHandler = (index: number) => {
    setCurrentPage(index + 1);
  };

  const fetchSignatures = async (userId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signature/user/${userId}`,
      );
      const result = await response.json();
      if (result.data) {
        setSignatures(result.data);
      }
    } catch (error) {
      console.error("Error fetching signatures:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("user_id", user.id.toString()); // ต้องแก้เป็น user ID จริง

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signature/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        fetchSignatures(user.id); // ต้องแก้เป็น user ID จริง
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
    }
  };

  const handleSignatureImage = async (imagePath: string) => {
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/signature/image/${imagePath}`;
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleSignatureSelect = (signatureUrl: string) => {
    setSelectedSignature(signatureUrl);
  };

  const handleDeleteSignature = async (signatureId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signature/${signatureId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        fetchSignatures(user.id);
      }
    } catch (error) {
      console.error("Error deleting signature:", error);
    }
  };

  const handleGeneratePDF = async (status: string) => {
    // คำนวณจำนวนหน้าทั้งหมด
    const itemsPerPage = 12;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // แปลง base64 ของโลโก้
    const logoUrl = "/images/logo-sru.png";
    const logoResponse = await fetch(logoUrl);
    const logoBlob = await logoResponse.blob();
    const logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `คำร้องขอคืนครุภัณฑ์_${data[0].borrow_list.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: "avoid-all", before: ".page-break" },
    };

    // สร้าง element ชั่วคราวสำหรับแต่ละหน้า
    const tempContainer = document.createElement("div");
    tempContainer.style.cssText =
      "font-family: sarabun, sans-serif; color: black;";
    document.body.appendChild(tempContainer);

    let pdfContent = "";

    for (let page = 0; page < totalPages; page++) {
      const startIdx = page * itemsPerPage;
      const endIdx = Math.min((page + 1) * itemsPerPage, data.length);
      const pageItems = data.slice(startIdx, endIdx);

      pdfContent += `
                <div class="${page > 0 ? "page-break" : ""}" style="width: 100%; padding: 20px;">
                    <div style="display: flex; margin-bottom: 20px;">
                        <div style="display: flex; width: 100%;">
                            <img src="${logoBase64}" alt="Logo" style="height: 100px;" />
                            <div style="margin-left: 20px;">
                                <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">คำร้องขอคืนครุภัณฑ์</h2>
                                <h3 style="font-size: 18px; font-weight: bold;">คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสุราษฎร์ธานี</h3>
                                <div style="text-align: right; margin-top: 20px;">
                                    <p>วันที่ ${new Date().getDate()} เดือน ${new Date().toLocaleString("th-TH", { month: "long" })} พ.ศ. ${new Date().getFullYear() + 543}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <p style="font-size: 16px;">รายการคืนครุภัณฑ์ที่ ${data[0].borrow_list.id} (หน้า ${page + 1}/${totalPages})</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">ลำดับ</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">เลขที่ครุภัณฑ์</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">รายการ</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">วันที่ใช้งาน</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">วันที่ส่งคืน</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pageItems
                              .map(
                                (item, index) => `
                                <tr>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${startIdx + index + 1}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">${item.equipment.code}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">${item.equipment.equipment_name.name}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${new Date(item.borrow_list.date_borrow).toLocaleDateString("th-TH")}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${new Date(item.borrow_list.date_return).toLocaleDateString("th-TH")}</td>
                                </tr>
                            `,
                              )
                              .join("")}
                            ${Array(itemsPerPage - pageItems.length)
                              .fill(0)
                              .map(
                                (_, index) => `
                                <tr>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;"></td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">&nbsp;</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">&nbsp;</td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>

                    <div style="display: flex; justify-content: space-between; margin-top: auto; height: 100%;">
                        <div style="text-align: center; margin-top: auto;">
                            <p>ลงชื่อ ${data[0].borrow_list.user.name} ผู้คืน</p>
                            <p style="margin-top: 5px;">( ${data[0].borrow_list.user.name} )</p>
                        </div>
                        <div style="text-align: center;">
                            ${
                              selectedSignature
                                ? `
                                <img 
                                    src="${selectedSignature}"
                                    alt="ลายเซ็นผู้อนุมัติ"
                                    style="width: 80px; height: 80px; object-fit: contain; margin: 0 auto -12px;"
                                />
                            `
                                : ""
                            }
                            <p>ลงชื่อ...........................................................ผู้อนุมัติ</p>
                            <p style="margin-top: 5px;">( ${selectedSignature ? data[0].borrow_list.user.name : "......................................................"} )</p>
                        </div>
                    </div>
                </div>
            `;
    }

    tempContainer.innerHTML = pdfContent;

    try {
      const pdfBlob = await html2pdf()
        .set(opt)
        .from(tempContainer)
        .toPdf()
        .get("pdf")
        .then((pdf: any) => {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.text(
              `หน้า ${i} จาก ${totalPages}`,
              pdf.internal.pageSize.getWidth() - 30,
              pdf.internal.pageSize.getHeight() - 10,
            );
          }
          return pdf.output("blob");
        });

      // สร้าง FormData สำหรับส่งไฟล์และสถานะ
      const formData = new FormData();
      formData.append("approval_status_return_id", status);
      if (status === "1") {
        formData.append(
            "file",
            new File(
              [pdfBlob],
              `คำร้องขอคืนครุภัณฑ์_${data[0].borrow_list.id}.pdf`,
              { type: "application/pdf" },
            ),
          );
      }

      // ส่ง API request ด้วย toast.promise
      await toast.promise(
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrow-list/update-status-return/${data[0].borrow_list.id}`,
          {
            method: "PATCH",
            body: formData,
          }
        ).then(response => {
          if (!response.ok) {
            throw new Error("ไม่สามารถอัปเดตสถานะการคืนได้");
          }
          handleResponse("success");
          return response;
        }),
        {
          loading: 'กำลังอัปเดตสถานะการคืน...',
          success: 'อัปเดตสถานะการคืนสำเร็จ',
          error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะการคืน'
        }
      );

      // ถ้าสำเร็จให้ปิด dialog
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSignatures(user.id); // ต้องแก้เป็น user ID จริง
    }
  }, [open]);

  useEffect(() => {
    const loadSignatures = async () => {
      const urls: { [key: string]: string } = {};
      for (const sig of signatures) {
        urls[sig.image_path] = await handleSignatureImage(sig.image_path);
      }
      setSignatureUrls(urls);
    };

    if (signatures.length > 0) {
      loadSignatures();
    }
  }, [signatures]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <Toaster position="bottom-right" reverseOrder={false} />
      <DialogBackdrop
        transition
        className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity"
      />

      <div className="fixed inset-0 z-10 w-screen">
        <div className="flex h-full min-h-full items-start justify-center gap-4 p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative flex h-full transform gap-4 overflow-visible text-left transition-all sm:my-8 sm:max-h-[99%] sm:w-full sm:max-w-[80%] sm:p-6"
          >
            <div className="flex h-full w-4/5 flex-col gap-4 rounded-lg bg-white px-4 pb-4 pt-5 shadow-xl">
              <div className="flex justify-between">
                <DialogTitle
                  as="h2"
                  className="text-base font-semibold text-gray-900"
                >
                  {title}
                </DialogTitle>
                <FaXmark
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={onClose}
                />
              </div>

              {data.length > 0 && data[0].borrow_list && (
                <div id="pdf-content" className="w-full overflow-y-auto p-12">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex w-full items-start">
                      <img
                        src="/images/logo-sru.png"
                        alt="Logo"
                        className="h-32"
                      />
                      <div className="flex w-full flex-col gap-6">
                        <div className="ml-4 flex flex-col gap-2">
                          <h2 className="text-lg font-semibold">
                            คำร้องขอคืนครุภัณฑ์
                          </h2>
                          <h3 className="text-lg font-semibold">
                            คณะวิทยาศาสตร์และเทคโนโลยี
                            มหาวิทยาลัยราชภัฏสุราษฎร์ธานี
                          </h3>
                        </div>
                        <div className="mt-auto text-right">
                          {(() => {
                            const today = new Date();
                            const day = today.getDate();
                            const month = today.toLocaleString("th-TH", {
                              month: "long",
                            });
                            const year = today.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
                            return (
                              <p>
                                วันที่ {day} เดือน {month} พ.ศ. {year}
                              </p>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 mt-10">
                    <p className="text-lg">
                      รายการคืนครุภัณฑ์ที่ {data[0].borrow_list.id}
                    </p>
                  </div>

                  <Table className="w-full border-collapse border border-gray-300">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="border border-gray-300 p-2">
                          ลำดับ
                        </TableHead>
                        <TableHead className="border border-gray-300 p-2">
                          เลขที่ครุภัณฑ์
                        </TableHead>
                        <TableHead className="border border-gray-300 p-2">
                          รายการ
                        </TableHead>
                        <TableHead className="border border-gray-300 p-2">
                          วันที่ใช้งาน
                        </TableHead>
                        <TableHead className="border border-gray-300 p-2">
                          วันที่ส่งคืน
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data
                        ?.slice(
                          currentPage * perPage - perPage,
                          currentPage * perPage,
                        )
                        .map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="border border-gray-300 p-2">
                              {index + 1}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-2">
                              {item.equipment.code}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-2">
                              {item.equipment.equipment_name.name}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-2">
                              {new Date(
                                item.borrow_list.date_borrow,
                              ).toLocaleDateString("th-TH")}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-2">
                              {new Date(
                                item.borrow_list.date_return,
                              ).toLocaleDateString("th-TH")}
                            </TableCell>
                          </TableRow>
                        ))}
                      {data?.slice(
                        currentPage * perPage - perPage,
                        currentPage * perPage,
                      ).length < 12 &&
                        Array(
                          12 -
                            data?.slice(
                              currentPage * perPage - perPage,
                              currentPage * perPage,
                            ).length,
                        )
                          .fill(0)
                          .map((_, index) => (
                            <TableRow key={index}>
                              <TableCell className="border border-gray-300 p-2">
                                &nbsp;
                              </TableCell>
                              <TableCell className="border border-gray-300 p-2">
                                &nbsp;
                              </TableCell>
                              <TableCell className="border border-gray-300 p-2">
                                &nbsp;
                              </TableCell>
                              <TableCell className="border border-gray-300 p-2">
                                &nbsp;
                              </TableCell>
                              <TableCell className="border border-gray-300 p-2">
                                &nbsp;
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                  <div className="flex w-full justify-between">
                    <PaginationList
                      current_page={currentPage}
                      total_item={data.length}
                      onPerPageSelector={perPageSelectorHandler}
                      pageDirectHandler={pageDirectHandler}
                    />
                  </div>

                  <div className="mt-20 flex items-end justify-between">
                    <div className="text-center">
                      <p>ลงชื่อ {data[0].borrow_list.user.name} ผู้คืน</p>
                      <p className="mt-1">
                        ( {data[0].borrow_list.user.name} )
                      </p>
                    </div>
                    <div className="text-center">
                      <div style={{ position: "relative", minHeight: "50px" }}>
                        {selectedSignature && (
                          <img
                            src={selectedSignature}
                            alt="ลายเซ็นผู้อนุมัติ"
                            className="mx-auto -mt-3 h-20 w-20 object-contain"
                          />
                        )}
                        <p>
                          ลงชื่อ...........................................................ผู้อนุมัติ
                        </p>
                      </div>
                      <p className="mt-1">
                        ({" "}
                        {selectedSignature
                          ? data[0].borrow_list.user.name
                          : "......................................................"}{" "}
                        )
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex h-full w-1/5 flex-col gap-4 rounded-lg bg-white px-4 pb-4 pt-5 shadow-xl">
              <h3 className="font-semibold">ลายเซ็น</h3>
              <div className="grid grid-cols-2 gap-4 overflow-y-auto">
                {signatures.map((sig) => (
                  <div key={sig.id} className="group relative cursor-pointer">
                    <img
                      src={signatureUrls[sig.image_path] || ""}
                      alt="ลายเซ็น"
                      className={`h-32 w-full rounded-lg border object-contain p-2 ${selectedSignature === signatureUrls[sig.image_path] ? "border-2 border-primary_1" : ""}`}
                      loading="lazy"
                      onClick={() =>
                        handleSignatureSelect(signatureUrls[sig.image_path])
                      }
                    />
                    <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSignature(sig.id);
                        }}
                        className="rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                <label className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-8 transition-colors hover:bg-gray-200">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <FaCirclePlus size={20} className="text-gray-500" />
                </label>
              </div>
              <div className="mt-auto flex justify-end gap-4">
                <button
                  onClick={() => handleGeneratePDF("2")}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  ไม่อนุมัติ
                </button>
                <button
                  onClick={() => handleGeneratePDF("1")}
                  className="rounded-lg bg-primary_1 px-4 py-2 text-white hover:bg-dark"
                >
                  อนุมัติ
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogShowBorrowApproval;
