"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function TiltPhonePreview() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full flex justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative mx-auto flex aspect-[9/16] max-h-[500px] min-h-[420px] max-w-[280px] sm:max-h-[600px] sm:min-h-[500px] sm:max-w-[340px] lg:max-h-[720px] lg:min-h-[580px] lg:max-w-[400px] w-full flex-col overflow-hidden rounded-[2.2rem] border-[8px] border-[#3a233a] bg-[#fff5fb] shadow-[0_24px_60px_rgba(96,54,91,0.22)] cursor-pointer"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff7fb_0%,#ffe8f3_46%,#e8f7ff_100%)] pointer-events-none" style={{ transform: "translateZ(-20px)" }} />
        
        <div className="relative flex items-center justify-between px-5 pt-5 text-xs font-bold text-[#7f5872]" style={{ transform: "translateZ(30px)" }}>
          <span>Preview quà</span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-[#c04b86]">Món quà bí mật</span>
        </div>
        
        <div className="relative grid flex-1 place-items-center px-5 text-center" style={{ transform: "translateZ(50px)" }}>
          <div>
            <div className="float-delay mx-auto grid h-28 w-28 place-items-center rounded-full bg-white/78 text-4xl shadow-[0_20px_50px_rgba(255,126,184,0.26)]">
              <span aria-hidden>♡</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#321a32]">
              Mở khóa món quà nhỏ
            </h2>
            <p className="mx-auto mt-3 max-w-[240px] text-sm leading-6 text-[#74536a]">
              Nhập ngày đặc biệt, xem thư, ảnh và chọn câu trả lời cuối.
            </p>
          </div>
        </div>

        <div className="relative m-4 rounded-[24px] border border-white/80 bg-white/76 p-4 shadow-[0_16px_38px_rgba(215,112,158,0.14)]" style={{ transform: "translateZ(40px)" }}>
          <p className="text-center text-sm font-semibold text-[#76556d]">
            Em có muốn đi hẹn hò với anh không?
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="rounded-full bg-[#ff7eb8] px-4 py-3 text-sm font-extrabold text-[#fff]">
              Có chứ
            </button>
            <button className="rounded-full border border-[#f4bdd8] bg-white px-4 py-3 text-sm font-extrabold text-[#b83276]">
              Để em nghĩ
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
