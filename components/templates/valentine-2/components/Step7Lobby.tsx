import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Star, ChevronLeft, ChevronRight, Film, SlidersHorizontal, Check } from "lucide-react";
import type { MovieData } from "../Valentine2WatchParty";
import { playClick, playSwoosh } from "./soundFX";

const ITEMS_PER_PAGE = 24;

export function Step7Lobby({ onSelectMovie, compact: propCompact, fullScreen, autoPlay = false }: { onSelectMovie: (m: MovieData) => void; compact?: boolean; fullScreen?: boolean; autoPlay?: boolean }) {
  const compact = propCompact || !fullScreen;
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [typeList, setTypeList] = useState("phim-le");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const fetchMovies = useCallback(async (opts: { searchQuery?: string; tl?: string; cat?: string; ctr?: string; yr?: string; pg?: number } = {}) => {
    const { searchQuery = "", tl = "phim-le", cat = "", ctr = "", yr = "", pg = 1 } = opts;
    setLoading(true);
    try {
      let url = "";
      if (searchQuery) {
        url = `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(searchQuery)}&limit=24&page=${pg}`;
      } else {
        url = `https://phimapi.com/v1/api/danh-sach/${tl}?page=${pg}&limit=${ITEMS_PER_PAGE}`;
        if (cat) url += `&category=${cat}`;
        if (ctr) url += `&country=${ctr}`;
        if (yr) url += `&year=${yr}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      const imageDomain = "https://phimimg.com/";
      const items = data.data?.items || [];
      const pagination = data.data?.params?.pagination;
      const total = pagination ? Math.ceil(pagination.totalItems / (pagination.totalItemsPerPage || ITEMS_PER_PAGE)) : 1;

      const formatted = items.map((m: any) => ({
        _id: m._id,
        name: m.name,
        slug: m.slug,
        thumb_url: m.thumb_url?.startsWith("http") ? m.thumb_url : `${imageDomain}${m.thumb_url}`,
        poster_url: m.poster_url?.startsWith("http") ? m.poster_url : `${imageDomain}${m.poster_url}`,
        year: m.year,
      }));

      setMovies(formatted);
      setTotalPages(Math.max(1, total));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    playClick(compact && !autoPlay);
    if (!keyword.trim()) {
      setIsSearchMode(false);
      setPage(1);
      fetchMovies({ tl: typeList, cat: category, ctr: country, yr: year, pg: 1 });
      return;
    }
    setIsSearchMode(true);
    setPage(1);
    fetchMovies({ searchQuery: keyword, pg: 1 });
  };
  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    playClick(compact && !autoPlay);
    setPage(p);
    if (isSearchMode) {
      fetchMovies({ searchQuery: keyword, pg: p });
    } else {
      fetchMovies({ tl: typeList, cat: category, ctr: country, yr: year, pg: p });
    }
  };

  useEffect(() => {
    if (!isSearchMode) {
      fetchMovies({ tl: typeList, cat: category, ctr: country, yr: year, pg: page });
    }
  }, [typeList, category, country, year, page, isSearchMode, fetchMovies]);

  useEffect(() => {
    if (autoPlay && movies.length > 0) {
      const t = setTimeout(() => {
        onSelectMovie(movies[0]);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, movies, onSelectMovie]);

  // Build visible page numbers (max 5 around current)
  const visiblePages = () => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      <motion.div
        className="absolute inset-0 flex flex-col z-10 bg-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Professional Header Area */}
        <div className="flex-shrink-0 px-4 md:px-8 pt-6 pb-4">
          <div className={`w-full max-w-[1400px] mx-auto flex flex-col ${compact ? "gap-2" : "md:flex-row md:items-center justify-between gap-4"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200/50">
                <Film className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-rose-950 tracking-tight">
                  Rạp phim Valentine
                </h2>
                <p className="text-rose-500 text-xs font-semibold uppercase tracking-wider">Cùng nhau xem phim nhé!</p>
              </div>
            </div>

            {/* Search bar + Filter icon */}
            <div className={`relative flex gap-2 w-full ${compact ? "" : "md:w-auto md:min-w-[320px]"}`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300" size={17} />
                <input
                  type="text"
                  placeholder="Tìm phim..."
                  className="w-full bg-white/85 border border-pink-200 text-rose-950 pl-9 pr-14 py-2.5 rounded-xl focus:border-rose-400 outline-none text-sm shadow-inner placeholder:text-rose-300"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Tìm
                </button>
              </div>
            </div>
          </div>
          
          {/* Advanced Filter Bar */}
          {!isSearchMode && (
            <div className={`w-full max-w-[1400px] mx-auto flex flex-wrap items-center ${compact ? "gap-2 mt-3" : "gap-3 mt-4"}`}>
              <select value={typeList} onChange={(e) => { setTypeList(e.target.value); setPage(1); }} className={`bg-white/85 border border-pink-200 text-rose-950 px-3 py-1.5 rounded-lg text-sm font-semibold outline-none focus:border-rose-400 cursor-pointer shadow-inner ${compact ? "flex-1 min-w-[130px]" : ""}`}>
                <option value="phim-le">Phim Lẻ</option>
                <option value="phim-bo">Phim Bộ</option>
                <option value="hoat-hinh">Hoạt Hình</option>
                <option value="tv-shows">TV Shows</option>
              </select>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className={`bg-white/85 border border-pink-200 text-rose-950 px-3 py-1.5 rounded-lg text-sm font-semibold outline-none focus:border-rose-400 cursor-pointer shadow-inner ${compact ? "flex-1 min-w-[130px]" : ""}`}>
                <option value="">Mọi thể loại</option>
                <option value="hanh-dong">Hành động</option>
                <option value="tinh-cam">Tình cảm</option>
                <option value="hai-huoc">Hài hước</option>
                <option value="kinh-di">Kinh dị</option>
                <option value="tam-ly">Tâm lý</option>
                <option value="co-trang">Cổ trang</option>
              </select>
              <select value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }} className={`bg-white/85 border border-pink-200 text-rose-950 px-3 py-1.5 rounded-lg text-sm font-semibold outline-none focus:border-rose-400 cursor-pointer shadow-inner ${compact ? "flex-1 min-w-[130px]" : ""}`}>
                <option value="">Mọi quốc gia</option>
                <option value="han-quoc">Hàn Quốc</option>
                <option value="trung-quoc">Trung Quốc</option>
                <option value="nhat-ban">Nhật Bản</option>
                <option value="au-my">Âu Mỹ</option>
                <option value="thai-lan">Thái Lan</option>
              </select>
              <select value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }} className={`bg-white/85 border border-pink-200 text-rose-950 px-3 py-1.5 rounded-lg text-sm font-semibold outline-none focus:border-rose-400 cursor-pointer shadow-inner ${compact ? "flex-1 min-w-[130px]" : ""}`}>
                <option value="">Mọi năm</option>
                {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Movie grid — responsive for PC */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-6 md:px-8 pt-1 no-scrollbar custom-scrollbar">
          <div className="w-full max-w-[1400px] mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-rose-500" />
            </div>
          ) : movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-rose-400/70">
              <Film size={36} className="mb-2 opacity-40" />
              <p className="text-sm">Không tìm thấy phim nào</p>
            </div>
          ) : (
            <div className={compact ? "grid grid-cols-2 gap-2 pb-8" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 pb-8"}>
              {movies.map((movie) => (
                <motion.div
                  key={movie._id}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { playSwoosh(compact && !autoPlay); onSelectMovie(movie); }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[2/3] bg-white/5 shadow-xl shadow-rose-900/10 border border-white/40 ring-1 ring-inset ring-white/20"
                >
                  <img
                    src={movie.thumb_url}
                    alt={movie.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient always visible — title readable at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  {/* Title — z-10 so it's ABOVE hover overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 
                      className="text-white font-bold text-[13px] sm:text-[15px] line-clamp-2 leading-tight mb-1"
                      style={{ color: "white", textShadow: "0px 2px 4px rgba(0,0,0,0.8), 0px 0px 10px rgba(0,0,0,0.5)" }}
                    >
                      {movie.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                      <Star size={10} fill="currentColor" />
                      <span>{movie.year}</span>
                    </div>
                  </div>

                  {/* Hover: semi-transparent overlay + play button (z-5, below title) */}
                  <div className="absolute inset-0 bg-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity z-[5] flex items-center justify-center pb-12">
                    <div className="bg-gradient-to-tr from-rose-600 to-pink-500 p-3 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.6)] scale-50 group-hover:scale-100 transition-transform duration-300 ease-out">
                      <Play fill="currentColor" size={20} className="text-white ml-0.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-4">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 disabled:opacity-30 hover:border-rose-400 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {visiblePages().map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                    p === page
                      ? "bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                      : "bg-slate-800 border border-slate-600 text-slate-300 hover:border-rose-400"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 disabled:opacity-30 hover:border-rose-400 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Cinema Curtains Intro */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-red-700 z-50 border-r-8 border-red-900 shadow-[20px_0_50px_rgba(0,0,0,0.8)] flex items-center justify-end overflow-hidden origin-left"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-multiply" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute inset-y-0 w-1/5 bg-gradient-to-r from-transparent via-black/30 to-transparent" style={{ left: `${i * 20}%` }} />
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-red-700 z-50 border-l-8 border-red-900 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex items-center justify-start overflow-hidden origin-right"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-multiply" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute inset-y-0 w-1/5 bg-gradient-to-r from-transparent via-black/30 to-transparent" style={{ left: `${i * 20}%` }} />
        ))}
      </motion.div>
    </>
  );
}
