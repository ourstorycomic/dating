import { AbsoluteFill, Img as RemotionImg, Sequence, Series, Audio, Video, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import React from "react";
import { VIDEOWEDDING_2_DATA } from "./config";

const SLIDE_DURATION = 240; // 8 seconds per slide
const TOTAL_SLIDES = 15;

const CompactContext = React.createContext(false);

const Img = (props: any) => {
  const isCompact = React.useContext(CompactContext);
  const [err, setErr] = React.useState(false);
  if (err) return <div className={props.className} style={{...props.style, backgroundColor: '#2a1a20'}} />;
  
  if (isCompact) {
    return <img {...props} src={typeof props.src === 'string' && props.src.startsWith("/") ? staticFile(props.src) : props.src} onError={() => setErr(true)} />;
  }
  
  return <RemotionImg {...props} onError={() => setErr(true)} />;
};

export const VideoWeddingTwoComposition = ({ customData = VIDEOWEDDING_2_DATA }: { customData?: any }) => {
  const { photos, groomName, brideName, date, text1, text2, text3, text4, text5, text6, text7, voiceUrl, generalAudioUrl, backgroundVideo, isCompact } = { ...VIDEOWEDDING_2_DATA, ...customData };
  const getPhoto = (idx: number) => {
    let src = photos[idx] || photos[0];
    if (src?.startsWith("/") && customData?.serverUrl) {
      src = customData.serverUrl + src;
    }
    return src;
  };
  const frame = useCurrentFrame();

  const getAudioSrc = (src: string) => {
    if (src?.startsWith("/") && customData?.serverUrl) {
      return customData.serverUrl + src;
    }
    return src?.startsWith("/") ? staticFile(src) : src;
  };
  
  const getBgVideoUrl = () => {
    if (backgroundVideo?.startsWith("/") && customData?.serverUrl) return customData.serverUrl + backgroundVideo;
    if (customData?.serverUrl) return customData.serverUrl + "/assets/videowedding-2/bg_short.mp4";
    return staticFile(backgroundVideo || "/assets/videowedding-2/bg_short.mp4");
  };
  const bgVolume = voiceUrl 
    ? interpolate(frame, [300, 450], [0.02, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0.4;

  return (
    <CompactContext.Provider value={isCompact}>
      <AbsoluteFill className="bg-[#0f0407]">
        {(!isCompact && voiceUrl) && <Audio src={getAudioSrc(voiceUrl)} volume={1} />}
        {(!isCompact && generalAudioUrl) && <Audio src={getAudioSrc(generalAudioUrl)} volume={bgVolume} />}
      <OffthreadVideo 
        src={getBgVideoUrl()} 
        muted={isCompact}
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} 
      />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(circle, transparent 30%, rgba(15,4,7,0.95) 130%)" }} />
      <Series>
        {/* Slide 1 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide1 groomName={groomName} brideName={brideName} date={date} text1={text1} />
        </Series.Sequence>
        
        {/* Slide 2 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide2 img1={getPhoto(0)} img2={getPhoto(1)} img3={getPhoto(2)} date={date} groomName={groomName} brideName={brideName} text3={text3} />
        </Series.Sequence>

        {/* Slide 3 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide3 img={getPhoto(3)} text={text2} />
        </Series.Sequence>

        {/* Slide 4: Chú Rể */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide4 img={getPhoto(4)} name={groomName} title="Chú Rể" />
        </Series.Sequence>

        {/* Slide 5: Cô Dâu */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide5 img={getPhoto(5)} name={brideName} title="Cô Dâu" />
        </Series.Sequence>

        {/* Slide 6 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide6 img1={getPhoto(6)} img2={getPhoto(7)} />
        </Series.Sequence>

        {/* Slide 7 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide7 img={getPhoto(8)} />
        </Series.Sequence>

        {/* Slide 8 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide8 img1={getPhoto(9)} img2={getPhoto(10)} img3={getPhoto(11)} />
        </Series.Sequence>

        {/* Slide 9 (New Magazine Layout) */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide9 img1={getPhoto(12)} img2={getPhoto(13)} img3={getPhoto(14)} text={text5} />
        </Series.Sequence>

        {/* Slide 10 (New Magazine Layout) */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide10 img1={getPhoto(0)} img2={getPhoto(2)} img3={getPhoto(3)} text={text6} />
        </Series.Sequence>

        {/* Slide 11 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide4 img={getPhoto(0)} name="HẠNH PHÚC" title={text6 || "Cùng Nhau"} />
        </Series.Sequence>

        {/* Slide 12 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide7 img={getPhoto(1)} text3={text3} />
        </Series.Sequence>

        {/* Slide 13 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide8 img1={getPhoto(2)} img2={getPhoto(3)} img3={getPhoto(4)} />
        </Series.Sequence>

        {/* Slide 14 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide3 img={getPhoto(5)} text={text7 || "From this day forward"} />
        </Series.Sequence>

        {/* Slide 15 */}
        <Series.Sequence durationInFrames={SLIDE_DURATION}>
          <Slide15 img={getPhoto(6)} text={text4} />
        </Series.Sequence>
      </Series>
      </AbsoluteFill>
    </CompactContext.Provider>
  );
};

// --- Slide Components ---

// Slide 1: Save the date
const Slide1 = ({ groomName, brideName, date, text1 }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [1, 1, 1, 0]);
  const scale = interpolate(frame, [0, SLIDE_DURATION], [0.95, 1.05]);

  return (
    <AbsoluteFill className="justify-center items-center flex-col" style={{ opacity, transform: `scale(${scale})` }}>
      <h2 className="text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] text-4xl font-sans tracking-widest font-bold mb-10 uppercase">{text1}</h2>
      <h1 className="text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] text-9xl font-serif-elegant font-bold mb-10 drop-shadow-2xl text-center leading-tight">
        {groomName} & {brideName}
      </h1>
      <p className="text-[#C69C6D] text-3xl font-sans tracking-[0.3em] font-semibold uppercase">{date}</p>
      
      {/* DEBUG COUNTER */}

    </AbsoluteFill>
  );
};

// Slide 2: 3 Vertical Images
const Slide2 = ({ img1, img2, img3, date, groomName, brideName, text3 }: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);

  const img1Spring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const img2Spring = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const img3Spring = spring({ frame: frame - 40, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill className="flex-col" style={{ opacity }}>
      <div className="flex justify-center items-center gap-12 mt-20 h-[65%]">
        <Img src={img1} className="h-full w-[20%] object-cover rounded-xl shadow-2xl" style={{ objectPosition: "center 25%", transform: `scale(${img1Spring})`, opacity: img1Spring }} />
        <Img src={img2} className="h-full w-[20%] object-cover rounded-xl shadow-2xl" style={{ objectPosition: "center 25%", transform: `scale(${img2Spring})`, opacity: img2Spring }} />
        <Img src={img3} className="h-full w-[20%] object-cover rounded-xl shadow-2xl" style={{ objectPosition: "center 25%", transform: `scale(${img3Spring})`, opacity: img3Spring }} />
      </div>
      <div className="flex-1 relative w-full px-32 flex justify-between items-end pb-20">
        <div className="text-8xl font-great-vibes text-[#E5B869] drop-shadow-xl" style={{ opacity: spring({ frame: frame - 60, fps }) }}>Hành trình</div>
        <div className="flex flex-col items-end border-b border-[#C69C6D] pb-4" style={{ opacity: spring({ frame: frame - 80, fps }) }}>
          <h2 className="text-7xl text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] font-serif tracking-[0.2em]">{text3 || "TÌNH YÊU"}</h2>
          <p className="text-3xl text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] tracking-[0.3em] mt-4">{date}</p>
          <p className="text-2xl text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] tracking-[0.1em] mt-2 uppercase">{groomName} & {brideName}</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Slide 3: 1 Full Image + Text
const Slide3 = ({ img, text }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);
  const scale = interpolate(frame, [0, SLIDE_DURATION], [1.1, 1]);

  return (
    <AbsoluteFill className="justify-center items-center" style={{ opacity }}>
      <h2 className="absolute top-16 text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] text-4xl tracking-[0.4em] font-serif uppercase z-10">{text}</h2>
      <div className="w-[85%] h-[75%] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[3px] border-[#C69C6D]/30 mt-10">
        <Img src={img} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${scale})` }} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 4: Groom
const Slide4 = ({ img, name, title }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);

  return (
    <AbsoluteFill className="flex-row items-center justify-between px-40" style={{ opacity }}>
      <div className="flex flex-col z-10" style={{ transform: `translateY(${interpolate(frame, [0, 60], [50, 0], { extrapolateRight: "clamp" })}px)` }}>
        <h3 className="text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] text-6xl font-serif italic mb-4">{title}</h3>
        <h2 className="text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] text-9xl font-sans font-bold tracking-widest uppercase">{name}</h2>
      </div>
      <div className="w-[45%] h-[80%] rounded-3xl overflow-hidden shadow-2xl relative border border-2 border-[#C69C6D]/40">
        <Img src={img} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1.1, 1])})` }} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 5: Bride
const Slide5 = ({ img, name, title }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);

  return (
    <AbsoluteFill className="flex-row-reverse items-center justify-between px-40" style={{ opacity }}>
      <div className="flex flex-col items-end z-10" style={{ transform: `translateY(${interpolate(frame, [0, 60], [50, 0], { extrapolateRight: "clamp" })}px)` }}>
        <h3 className="text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] text-6xl font-serif italic mb-4">{title}</h3>
        <h2 className="text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] text-9xl font-sans font-bold tracking-widest uppercase">{name}</h2>
      </div>
      <div className="w-[45%] h-[80%] rounded-3xl overflow-hidden shadow-2xl relative border border-2 border-[#C69C6D]/40">
        <Img src={img} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1.1, 1])})` }} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 6: 2 Large Images Side-by-Side
const Slide6 = ({ img1, img2 }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);
  
  return (
    <AbsoluteFill className="flex-row items-center justify-center gap-10 px-20" style={{ opacity }}>
      <div className="w-[45%] h-[85%] rounded-2xl overflow-hidden shadow-2xl">
        <Img src={img1} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1.1, 1])})` }} />
      </div>
      <div className="w-[45%] h-[85%] rounded-2xl overflow-hidden shadow-2xl">
        <Img src={img2} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1, 1.1])})` }} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 7: 1 Full Background Image + Text Overlay
const Slide7 = ({ img, text3 }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img src={img} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1.05, 1])})` }} />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute bottom-20 left-20">
        <h2 className="text-8xl text-[#C69C6D] font-great-vibes drop-shadow-2xl">{text3 || "TÌNH YÊU ĐÍCH THỰC"}</h2>
        <p className="text-3xl text-[#C69C6D]/80 font-sans tracking-widest mt-4 uppercase">Bên nhau trọn đời</p>
      </div>
    </AbsoluteFill>
  );
};

// Slide 8: 3 Vertical Staggered Images
const Slide8 = ({ img1, img2, img3 }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);
  const y1 = interpolate(frame, [0, 60], [100, 0], { extrapolateRight: "clamp" });
  const y2 = interpolate(frame, [0, 80], [150, 0], { extrapolateRight: "clamp" });
  const y3 = interpolate(frame, [0, 100], [200, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="flex-row items-center justify-center gap-12" style={{ opacity }}>
      <div className="w-[22%] h-[60%] rounded-xl overflow-hidden shadow-xl" style={{ transform: `translateY(${y1}px)` }}>
        <Img src={img1} className="w-full h-full object-cover" style={{ objectPosition: "center 25%" }} />
      </div>
      <div className="w-[22%] h-[60%] rounded-xl overflow-hidden shadow-xl mt-40" style={{ transform: `translateY(${y2}px)` }}>
        <Img src={img2} className="w-full h-full object-cover" style={{ objectPosition: "center 25%" }} />
      </div>
      <div className="w-[22%] h-[60%] rounded-xl overflow-hidden shadow-xl mb-40" style={{ transform: `translateY(${y3}px)` }}>
        <Img src={img3} className="w-full h-full object-cover" style={{ objectPosition: "center 25%" }} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 9: Magazine Layout 1 (Left large, Right 2 small)
const Slide9 = ({ img1, img2, img3, text }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);
  
  return (
    <AbsoluteFill className="bg-[#0f0407]" style={{ opacity }}>
      {/* Left Large Photo */}
      <div className="absolute left-[5%] top-[5%] w-[43%] h-[90%] rounded-xl overflow-hidden shadow-2xl border border-white/10" style={{ transform: `translateY(${interpolate(frame, [0, 60], [50, 0], { extrapolateRight: "clamp" })}px)` }}>
        <Img src={img1} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1, 1.05])})` }} />
      </div>
      
      {/* Right Top Medium Photo */}
      <div className="absolute right-[5%] top-[5%] w-[20%] h-[43%] rounded-xl overflow-hidden shadow-2xl border border-white/10" style={{ transform: `translateY(${interpolate(frame, [0, 60], [-50, 0], { extrapolateRight: "clamp" })}px)` }}>
        <Img src={img2} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1, 1.05])})` }} />
      </div>

      {/* Bottom Center-Right Medium Photo */}
      <div className="absolute right-[5%] bottom-[5%] w-[43%] h-[43%] rounded-xl overflow-hidden shadow-2xl border border-white/10 z-10" style={{ transform: `translateY(${interpolate(frame, [0, 60], [100, 0], { extrapolateRight: "clamp" })}px)` }}>
        <Img src={img3} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1, 1.05])})` }} />
      </div>

      {/* Text Area */}
      <div className="absolute left-[52%] top-[15%] w-[20%]" style={{ opacity: spring({ frame: frame - 30, fps: 30 }) }}>
        <h2 className="text-[#C69C6D] font-serif text-5xl leading-tight uppercase drop-shadow-xl">{text || "LOVE FUELS my SOUL"}</h2>
      </div>
    </AbsoluteFill>
  );
};

// Slide 10: Magazine Layout 2 (3 asymmetrical photos)
const Slide10 = ({ img1, img2, img3, text }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);
  
  return (
    <AbsoluteFill className="bg-[#0f0407]" style={{ opacity }}>
      {/* Far Left Medium Photo */}
      <div className="absolute left-[5%] top-[5%] w-[24%] h-[55%] rounded-xl overflow-hidden shadow-2xl border border-white/10" style={{ transform: `translateY(${interpolate(frame, [0, 60], [-50, 0], { extrapolateRight: "clamp" })}px)` }}>
        <Img src={img1} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1, 1.05])})` }} />
      </div>

      {/* Center Bottom Medium Photo */}
      <div className="absolute left-[33%] bottom-[5%] w-[26%] h-[45%] rounded-xl overflow-hidden shadow-2xl border border-white/10" style={{ transform: `translateY(${interpolate(frame, [0, 60], [100, 0], { extrapolateRight: "clamp" })}px)` }}>
        <Img src={img2} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1, 1.05])})` }} />
      </div>

      {/* Far Right Large Photo */}
      <div className="absolute right-[5%] top-[10%] w-[32%] h-[80%] rounded-xl overflow-hidden shadow-2xl border border-white/10" style={{ transform: `translateY(${interpolate(frame, [0, 60], [50, 0], { extrapolateRight: "clamp" })}px)` }}>
        <Img src={img3} className="w-full h-full object-cover" style={{ objectPosition: "center 25%", transform: `scale(${interpolate(frame, [0, SLIDE_DURATION], [1, 1.05])})` }} />
      </div>

      {/* Text Area */}
      <div className="absolute left-[5%] bottom-[15%] w-[24%]" style={{ opacity: spring({ frame: frame - 30, fps: 30 }) }}>
        <p className="text-[#C69C6D]/80 font-serif italic text-xl leading-relaxed">"{text || "Love is a force more formidable than any other. It is invisible - it cannot be seen or measured, yet it is powerful enough to transform you."}"</p>
      </div>
    </AbsoluteFill>
  );
};

// Slide 15: Thank You (End)
const Slide15 = ({ img, text }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, SLIDE_DURATION - 30, SLIDE_DURATION], [0, 1, 1, 0]);
  const scale = interpolate(frame, [0, SLIDE_DURATION], [1, 1.1]);

  return (
    <AbsoluteFill className="justify-center items-center" style={{ opacity }}>
      <Img src={img} className="absolute inset-0 w-full h-full object-cover opacity-60" style={{ objectPosition: "center 25%", transform: `scale(${scale})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <h2 className="relative z-10 text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)] text-9xl font-great-vibes drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">{text}</h2>
      <p className="relative z-10 text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)]/80 text-3xl font-sans tracking-[0.5em] mt-8 uppercase">For celebrating with us</p>
    </AbsoluteFill>
  );
};
