import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Users, ArrowRight } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";

export function Step8Connect({ onConnect }: { onConnect: (conn: any, isHost: boolean) => void }) {
  const [mode, setMode] = useState<"select" | "host" | "guest">("select");
  const [peerId, setPeerId] = useState<string>("");
  const [guestInput, setGuestInput] = useState("");
  const [status, setStatus] = useState("Đang khởi tạo...");
  const [copied, setCopied] = useState(false);
  const peerRef = useRef<any>(null);

  useEffect(() => {
    // Only init Peer when we choose a mode
    if (mode === "select") return;

    let peer: any;

    const initPeer = async () => {
      const { default: Peer } = await import("peerjs");
      
      // Generate random 5 digit ID for Host, or random long ID for guest
      const id = mode === "host" 
        ? Math.floor(10000 + Math.random() * 90000).toString() 
        : "guest_" + Math.floor(Math.random() * 100000);

      peer = new Peer(id, {
        debug: 2
      });

      peer.on("open", (id: string) => {
        setPeerId(id);
        setStatus(mode === "host" ? "Đang đợi người ấy vào phòng..." : "Sẵn sàng kết nối!");
      });

      peer.on("connection", (conn: any) => {
        setStatus("Đã kết nối! Chuẩn bị vào rạp...");
        setTimeout(() => onConnect(conn, mode === "host"), 1500);
      });

      peerRef.current = peer;
    };

    initPeer();

    return () => {
      if (peer) peer.destroy();
    };
  }, [mode, onConnect]);

  const handleConnect = () => {
    if (!peerRef.current || !guestInput) return;
    setStatus("Đang kết nối...");
    
    const conn = peerRef.current.connect(guestInput, { reliable: true });
    
    conn.on("open", () => {
      setStatus("Đã kết nối thành công!");
      setTimeout(() => onConnect(conn, false), 1500);
    });

    conn.on("error", (err: any) => {
      setStatus("Kết nối thất bại. Vui lòng kiểm tra lại mã!");
      console.error(err);
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 bg-transparent text-white"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }} // fade to black effect handled by background
    >
      <FloatingParticles />
      <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-8 border border-rose-500/30">
        <Users size={40} className="text-rose-500" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Kết Nối Yêu Thương</h2>
      <p className="text-slate-400 text-center mb-10 text-sm">Xem chung phim dù ở bất cứ đâu</p>

      <AnimatePresence mode="wait">
        {mode === "select" && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4 w-full max-w-[280px]"
          >
            <button 
              onClick={() => setMode("host")}
              className="bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
            >
              Tạo phòng xem chung
            </button>
            <button 
              onClick={() => setMode("guest")}
              className="bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              Vào phòng đã có
            </button>
          </motion.div>
        )}

        {mode === "host" && (
          <motion.div 
            key="host"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center w-full max-w-[280px]"
          >
            <p className="text-slate-400 mb-4">Mã phòng của bạn</p>
            <div className="bg-slate-800 border border-slate-700 w-full py-6 rounded-2xl flex flex-col items-center justify-center mb-6 relative group">
              <span className="text-5xl font-black tracking-[0.2em] text-rose-400">{peerId || "..."}</span>
              <button 
                onClick={copyCode}
                className="absolute top-2 right-2 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-300" />}
              </button>
            </div>
            
            <div className="flex items-center gap-3 text-rose-300 bg-rose-500/10 px-6 py-3 rounded-full">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="text-sm font-medium">{status}</span>
            </div>
          </motion.div>
        )}

        {mode === "guest" && (
          <motion.div 
            key="guest"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center w-full max-w-[280px]"
          >
            <p className="text-slate-400 mb-4">Nhập mã phòng</p>
            <input 
              type="text"
              maxLength={5}
              value={guestInput}
              onChange={e => setGuestInput(e.target.value.replace(/\D/g, ''))}
              placeholder="12345"
              className="bg-slate-800 border border-slate-700 w-full py-6 rounded-2xl text-center text-5xl font-black tracking-[0.2em] text-white focus:border-rose-500 outline-none mb-6"
            />
            
            <button 
              onClick={handleConnect}
              disabled={guestInput.length !== 5}
              className="bg-rose-500 disabled:bg-slate-700 disabled:text-slate-500 hover:bg-rose-600 text-white w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Kết nối <ArrowRight size={20} />
            </button>

            <p className="mt-6 text-sm text-slate-500 text-center">{status}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
