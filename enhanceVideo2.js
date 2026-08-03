const fs = require('fs');
const file = 'd:/dating/components/templates/videowedding-2/Composition.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldDecl = 'const { photos, groomName, brideName, date, text1, text2, text3, text4, voiceUrl, generalAudioUrl } = { ...VIDEOWEDDING_2_DATA, ...customData };';
const newDecl = 'const { photos, groomName, brideName, date, text1, text2, text3, text4, text5, text6, text7, voiceUrl, generalAudioUrl } = { ...VIDEOWEDDING_2_DATA, ...customData };';
content = content.replace(oldDecl, newDecl);

const oldVideo = '<Video src={staticFile("/assets/videowedding-2/bg.mp4")} loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />';
const newVideo = `<Video src={staticFile("/assets/videowedding-2/bg.mp4")} loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(circle, transparent 30%, rgba(15,4,7,0.95) 130%)" }} />`;
content = content.replace(oldVideo, newVideo);

const oldSlide9 = '<Slide3 img={getPhoto(12)} text="LOVE IS IN THE AIR" />';
const newSlide9 = '<Slide3 img={getPhoto(12)} text={text5 || "Two souls, one heart."} />';
content = content.replace(oldSlide9, newSlide9);

const oldSlide11 = '<Slide4 img={getPhoto(0)} name="HẠNH PHÚC" title="Cùng Nhau" />';
const newSlide11 = '<Slide4 img={getPhoto(0)} name="HẠNH PHÚC" title={text6 || "Cùng Nhau"} />';
content = content.replace(oldSlide11, newSlide11);

const oldSlide14 = '<Slide3 img={getPhoto(5)} text={text3} />';
const newSlide14 = '<Slide3 img={getPhoto(5)} text={text7 || "From this day forward"} />';
content = content.replace(oldSlide14, newSlide14);

// Make the gold borders a bit thicker and classier
content = content.replace(/border-\[#C69C6D\]\/20/g, 'border-2 border-[#C69C6D]/40');
content = content.replace(/border-white\/10/g, 'border-[3px] border-[#C69C6D]/30');

// Make the text pop more with shadows
content = content.replace(/text-\[#C69C6D\]/g, 'text-[#C69C6D] drop-shadow-[0_0_15px_rgba(198,156,109,0.5)]');

fs.writeFileSync(file, content, 'utf8');
console.log("Enhanced videowedding-2!");
