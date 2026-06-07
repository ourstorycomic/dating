type Payment = {
  amount: number;
  payment_code: string;
  qr_code_url: string | null;
  status: string;
};

function normalizePayment(payment: Payment | Payment[] | null | undefined) {
  if (Array.isArray(payment)) return payment[0] ?? null;
  return payment ?? null;
}

export function PaymentLockedView({
  orderId,
  payment,
}: {
  orderId: string;
  payment: Payment | Payment[] | null | undefined;
}) {
  const currentPayment = normalizePayment(payment);
  const amount = Number(currentPayment?.amount ?? 0);

  return (
    <main className="grid min-h-screen place-items-center bg-[#05020a] px-4 py-8 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/12 bg-white/[0.06] p-5 text-center shadow-[0_0_80px_rgba(236,72,153,0.18)] backdrop-blur-2xl">
        <p className="text-sm font-semibold text-pink-200">Gift link đang được khóa</p>
        <h1 className="mt-3 text-3xl font-black">Chờ xác nhận thanh toán</h1>
        <p className="mt-3 text-sm leading-6 text-white/68">
          Đơn {orderId} đã được tạo tạm. Khi hệ thống nhận đúng chuyển khoản, món quà sẽ tự mở khóa.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
          {currentPayment?.qr_code_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="QR chuyển khoản" className="mx-auto h-56 w-56 rounded-2xl bg-white object-contain p-2" src={currentPayment.qr_code_url} />
          ) : (
            <div className="mx-auto grid h-56 w-56 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-white/50">
              QR chưa được cấu hình
            </div>
          )}
          <div className="mt-4 grid gap-2 text-left text-sm">
            <p><span className="text-white/50">Số tiền:</span> <b>{amount.toLocaleString("vi-VN")}đ</b></p>
            <p><span className="text-white/50">Nội dung:</span> <b className="text-pink-100">{currentPayment?.payment_code ?? "Đang chờ mã"}</b></p>
            <p><span className="text-white/50">Trạng thái:</span> <b>{currentPayment?.status ?? "PENDING"}</b></p>
          </div>
        </div>

        <p className="mt-5 text-xs leading-5 text-white/52">
          Trang này có thể refresh lại sau vài giây. Khi webhook ngân hàng báo tiền vào, link sẽ mở tự động theo trạng thái đơn.
        </p>
      </section>
    </main>
  );
}
