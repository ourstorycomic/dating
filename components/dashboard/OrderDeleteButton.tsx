"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrderDeleteButton({ orderId }: { orderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn này và toàn bộ ảnh/video kèm theo không? Hành động này không thể hoàn tác.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Xóa đơn thất bại.");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi xóa đơn.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-red-400 hover:text-red-300 transition-colors p-2 disabled:opacity-50"
      title="Xóa đơn"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  );
}
