import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile, Audio } from "remotion";

const Fonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap');
      .font-playfair { font-family: 'Playfair Display', serif; }
      .font-cormorant { font-family: 'Cormorant Garamond', serif; }
      .font-vibes { font-family: 'Great Vibes', cursive; }
      .font-montserrat { font-family: 'Montserrat', sans-serif; }
    `}
  </style>
);

const ElegantImage = ({ src, delay = 0, style, zoomDirection = "in" }: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 1, stiffness: 40 },
  });

  const innerScale = interpolate(
    frame, 
    [0, 300], 
    zoomDirection === "in" ? [1, 1.05] : [1.05, 1], 
    { extrapolateRight: "clamp" }
  );

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  
  return (
    <div style={{
      ...style,
      opacity,
      overflow: "hidden",
      position: "absolute",
    }}>
      <Img 
        src={src?.startsWith("/") ? staticFile(src) : src} 
        style={{ objectPosition: "center center", 
          width: "100%", 
          height: "100%", 
          objectFit: "cover",
          transform: `scale(${innerScale})`,
          transformOrigin: "center center"
        }} 
      />
    </div>
  );
};

const AnimatedText = ({ text, delay = 0, className, style }: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 24, stiffness: 40 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [15, 0]);

  return (
    <div style={{
      ...style,
      opacity,
      transform: `translateY(${translateY}px)`
    }} className={className}>
      {text}
    </div>
  );
};

// Slide 1: Save Our Date (Text Only)
const Slide1 = ({ text4, text5, text6, date }: any) => {
  const frame = useCurrentFrame();
  const opacityOut = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: opacityOut, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
      <div style={{ position: "relative", textAlign: "center" }}>
        <AnimatedText delay={10} className="font-montserrat" text={text4} style={{ fontSize: "140px", color: "#E8D9C8", letterSpacing: "0.1em", fontWeight: 300, lineHeight: 1 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "-30px" }}>
          <AnimatedText delay={30} className="font-montserrat" text={text5} style={{ fontSize: "60px", color: "#E8D9C8", letterSpacing: "0.1em", fontWeight: 300, marginRight: "40px" }} />
          <AnimatedText delay={50} className="font-montserrat" text={text6} style={{ fontSize: "140px", color: "#E8D9C8", letterSpacing: "0.1em", fontWeight: 300, lineHeight: 1 }} />
        </div>
        <AnimatedText delay={70} className="font-montserrat" text={date} style={{ fontSize: "50px", color: "#D4AF37", letterSpacing: "0.2em", fontWeight: 400, marginTop: "20px" }} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 2: 3 Vertical Photos Left, Text Right
const Slide2 = ({ image1, image2, image3, text1, text2, text7 }: any) => {
  const frame = useCurrentFrame();
  const opacityOut = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: opacityOut }}>
       <ElegantImage src={image1} delay={10} style={{ left: "4%", top: "15%", width: "18%", height: "70%" }} />
       <ElegantImage src={image2} delay={20} style={{ left: "23%", top: "15%", width: "18%", height: "70%" }} zoomDirection="out" />
       <ElegantImage src={image3} delay={30} style={{ left: "42%", top: "15%", width: "18%", height: "70%" }} />
       
       <div style={{ position: "absolute", right: "6%", top: "15%" }}>
         <AnimatedText delay={40} className="font-vibes" text={text1} style={{ fontSize: "110px", color: "#F4EFEA", fontWeight: 400 }} />
       </div>
       <div style={{ position: "absolute", right: "6%", bottom: "15%", textAlign: "right" }}>
         <AnimatedText delay={60} className="font-montserrat" text={text7} style={{ fontSize: "36px", color: "#D4AF37", letterSpacing: "0.3em", fontWeight: 500 }} />
         <AnimatedText delay={70} className="font-montserrat" text={text2} style={{ fontSize: "32px", color: "#E8D9C8", letterSpacing: "0.2em", fontWeight: 300, marginTop: "10px" }} />
       </div>
    </AbsoluteFill>
  );
};

// Slide 3: Text Only
const Slide3 = ({ text1, text2, text3 }: any) => {
  const frame = useCurrentFrame();
  const opacityOut = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: opacityOut, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
      <div style={{ textAlign: "center", width: "80%" }}>
        <AnimatedText delay={10} className="font-vibes" text={text1} style={{ fontSize: "100px", color: "#D4AF37", marginBottom: "40px" }} />
        <AnimatedText delay={30} className="font-cormorant" text={text2} style={{ fontSize: "48px", color: "#F4EFEA", lineHeight: "1.6", fontWeight: 400 }} />
        <AnimatedText delay={50} className="font-cormorant" text={text3} style={{ fontSize: "48px", color: "#F4EFEA", lineHeight: "1.6", fontWeight: 400, marginTop: "20px" }} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 4: Triptych with Vertical Line
const Slide4 = ({ image1, image2, text1, text2 }: any) => {
  const frame = useCurrentFrame();
  const opacityOut = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: "clamp" });
  
  const lineProgress = spring({
    frame: frame - 20,
    fps: 30,
    config: { damping: 20 },
  });
  
  const lineHeight = interpolate(lineProgress, [0, 1], [0, 35]); // 35% height

  return (
    <AbsoluteFill style={{ opacity: opacityOut }}>
       <ElegantImage src={image1} delay={10} style={{ left: 0, top: 0, width: "30%", height: "100%" }} />
       <ElegantImage src={image2} delay={20} style={{ right: 0, top: 0, width: "30%", height: "100%" }} zoomDirection="out" />
       
       {/* Center Content */}
       <div style={{ position: "absolute", left: "30%", right: "30%", top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          {/* Top Line */}
          <div style={{ position: "absolute", top: 0, width: "2px", height: `${lineHeight}%`, backgroundColor: "#D4AF37", opacity: lineProgress }} />
          
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <AnimatedText delay={40} className="font-montserrat" text={text1} style={{ fontSize: "40px", color: "#E8D9C8", letterSpacing: "0.4em", fontWeight: 300 }} />
            <AnimatedText delay={50} className="font-vibes" text={text2} style={{ fontSize: "110px", color: "#D4AF37", marginTop: "-20px" }} />
          </div>

          {/* Bottom Line */}
          <div style={{ position: "absolute", bottom: 0, width: "2px", height: `${lineHeight}%`, backgroundColor: "#D4AF37", opacity: lineProgress }} />
       </div>
    </AbsoluteFill>
  );
};

// Slide 5: Complex Grid
const Slide5 = ({ image1, image2, image3, text1, text2 }: any) => {
  const frame = useCurrentFrame();
  const opacityOut = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: opacityOut }}>
       {/* Left Column */}
       <ElegantImage src={image1} delay={10} style={{ left: "5%", top: "8%", width: "25%", height: "55%" }} />
       <div style={{ position: "absolute", left: "5%", bottom: "8%", width: "25%" }}>
         <AnimatedText delay={40} className="font-cormorant" text={text1} style={{ fontSize: "20px", color: "#E8D9C8", letterSpacing: "0.1em", lineHeight: "1.8", textTransform: "uppercase" }} />
       </div>

       {/* Middle Column */}
       <div style={{ position: "absolute", left: "32%", top: "25%", width: "25%" }}>
         <AnimatedText delay={50} className="font-cormorant" text={text2} style={{ fontSize: "22px", color: "#E8D9C8", letterSpacing: "0.1em", lineHeight: "1.8" }} />
       </div>
       <ElegantImage src={image2} delay={20} style={{ left: "32%", bottom: "8%", width: "25%", height: "45%" }} zoomDirection="out" />

       {/* Right Column */}
       <ElegantImage src={image3} delay={30} style={{ right: "5%", top: "8%", width: "35%", height: "84%" }} />
    </AbsoluteFill>
  );
};

export const VideoWeddingOneComposition = ({ customData }: any) => {
  const { photos } = customData;
  const getPhoto = (idx: number) => {
    let src = photos?.[idx] || photos?.[0] || `/assets/videowedding-1/anhchung${(idx % 8) + 1}.jpg`;
    if (src?.startsWith("/") && customData?.serverUrl) {
      src = customData.serverUrl + src;
    }
    return src;
  };
  
  const getAudioUrl = (url: string) => {
    if (url?.startsWith("/") && customData?.serverUrl) {
      return customData.serverUrl + url;
    }
    return url;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('T')) return dateStr;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day} - ${month} - ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const getBgVideoUrl = () => {
    if (customData?.serverUrl) return customData.serverUrl + "/assets/videowedding-1/bg_h264.mp4";
    return staticFile("/assets/videowedding-1/bg_h264.mp4");
  };

  const audioStartFrame = customData?.audioStartTime ? Number(customData.audioStartTime) * 30 : 0;
  const audioEndFrame = customData?.audioEndTime ? Number(customData.audioEndTime) * 30 : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: "#11070A" }}>
      {(customData?.musicUrl && !customData?.generalAudioUrl) && <Audio src={getAudioUrl(customData.musicUrl)} startFrom={audioStartFrame} endAt={audioEndFrame} />}
      <Fonts />
      
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
        {(customData?.generalAudioUrl) && <Audio src={getAudioUrl(customData.generalAudioUrl)} volume={0.6} startFrom={audioStartFrame} endAt={audioEndFrame} />}
        {/* @ts-ignore */}
        <OffthreadVideo 
          src={getBgVideoUrl()} 
          // @ts-ignore
          loop
          muted={true}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.1)", pointerEvents: "none" }} />
      
      <Sequence from={0} durationInFrames={300}>
        <Slide1 
          text4={customData?.text4 || "SAVE OUR"}
          text5={customData?.text5 || "DATE"}
          text6={customData?.text6 || "DATE"}
          date={formatDate(customData?.date || "04 - 06 - 2026")}
        />
      </Sequence>

      <Sequence from={270} durationInFrames={300}>
        <Slide2 
          image1={getPhoto(0)} 
          image2={getPhoto(3)} 
          image3={getPhoto(2)} 
          text1={customData?.text3 || "Lễ Thành Hôn"} 
          text2={formatDate(customData?.date || "04 - 06 - 2026")} 
          text7={customData?.text7 || "WEDDING DAY"}
        />
      </Sequence>

      <Sequence from={540} durationInFrames={300}>
        <Slide3 
          text1={customData?.text1 || "Thanh Tú & Mai Duyên"} 
          text2={customData?.text2 || "Chúng con rất hân hạnh được chào đón sự góp mặt đông đủ của quý vị khách quý."} 
          text3="Sự hiện diện của tất cả mọi người là lời chúc tốt đẹp nhất dành cho chúng con." 
        />
      </Sequence>

      <Sequence from={810} durationInFrames={300}>
         <Slide4 
          image1={customData?.image1 || "/assets/videowedding-1/chure.jpg"} 
          image2={customData?.image2 || "/assets/videowedding-1/codau.jpg"} 
          text1={customData?.text8 || "THE"}
          text2={customData?.text9 || "Beginning"}
        />
      </Sequence>

      <Sequence from={1080} durationInFrames={300}>
         <Slide5 
          image1={getPhoto(1)} 
          image2={getPhoto(4)} 
          image3={getPhoto(7)} 
          text1={customData?.text10 || '"GUARDING YOU IN THIS ENDLESS TIME, PUT A SMILE BACK ON YOUR FACE TO KEEP YOU IN MIND"'}
          text2={customData?.text11 || "i saw that you were perfect and so i loved you. then i saw that you were not perfect and i loved you even more."}
        />
      </Sequence>

      {/* Loop for the rest of the 2 minutes using mixed styles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const startFrame = 1350 + i * 270;
        const styleType = i % 4; // 0, 1, 2, 3
        
        return (
          <Sequence key={i} from={startFrame} durationInFrames={300}>
            {styleType === 0 && <Slide2 image1={getPhoto(i + 5)} image2={getPhoto(i + 8)} image3={getPhoto(i + 11)} text1="Forever Love" text2="Tình yêu bất diệt" text7={customData?.text7 || "WEDDING DAY"} />}
            {styleType === 1 && <Slide4 image1={getPhoto(i + 2)} image2={getPhoto(i + 7)} text1="OUR" text2="Journey" />}
            {styleType === 2 && <Slide5 image1={getPhoto(i + 3)} image2={getPhoto(i + 6)} image3={getPhoto(i + 9)} text1="HẠNH PHÚC LÀ KHI ĐƯỢC CÙNG NHAU GIÀ ĐI" text2="Cảm ơn vì đã đến và thanh xuân này chúng ta có nhau." />}
            {styleType === 3 && <Slide3 text1="Thank You" text2="Cảm ơn sự hiện diện của bạn" text3="Đó là món quà tuyệt vời nhất" />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
