// Helper to ensure absolute URL for images
const getAbsoluteUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
  }
  return url;
};

export async function exportVideoWedding1ToPPTX(customData: any) {
  const pptxgen = (await import("pptxgenjs")).default;
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.title = "Story of Us - Wedding Presentation";

  // Common text styles
  const textProps = {
    color: "E8D9C8",
    fontFace: "Playfair Display",
    align: "center" as const,
  };

  // Get data or defaults
  const text1 = customData?.text1 || "SAVE THE DATE";
  const text2 = customData?.text2 || "04 - 06 - 2026";
  const date = customData?.date || "04.06.2026";
  const groomName = customData?.groomName || "Minh Khang";
  const brideName = customData?.brideName || "Thu Hương";

  const photos = customData?.photos || [];
  const getPhoto = (index: number, fallback: string) => {
    return getAbsoluteUrl(photos[index] || fallback);
  };

  // SLIDE 1: Save Our Date
  const slide1 = pptx.addSlide();
  slide1.background = { color: "11070A" };
  slide1.addText("SAVE", { ...textProps, y: "30%", w: "100%", fontSize: 96, bold: true });
  slide1.addText("OUR", { ...textProps, y: "45%", w: "100%", fontSize: 48 });
  slide1.addText("DATE", { ...textProps, y: "55%", w: "100%", fontSize: 96, bold: true });
  slide1.addText(date, { ...textProps, y: "75%", w: "100%", fontSize: 36, color: "D4AF37", bold: true });

  // SLIDE 2: 3 Photos + Text
  const slide2 = pptx.addSlide();
  slide2.background = { color: "11070A" };
  const img1 = getPhoto(0, "/assets/videowedding-1/anhchung1.jpg");
  const img2 = getPhoto(3, "/assets/videowedding-1/anhchung4.jpg");
  const img3 = getPhoto(1, "/assets/videowedding-1/anhchung2.jpg");
  
  // Add images to slide 2
  try {
    slide2.addImage({ path: img1, x: "5%", y: "15%", w: "18%", h: "70%", sizing: { type: "crop" } });
    slide2.addImage({ path: img2, x: "25%", y: "15%", w: "18%", h: "70%", sizing: { type: "crop" } });
    slide2.addImage({ path: img3, x: "45%", y: "15%", w: "18%", h: "70%", sizing: { type: "crop" } });
  } catch(e) { console.error(e); }

  slide2.addText(text1, { ...textProps, x: "65%", y: "40%", w: "30%", fontSize: 60, fontFace: "Great Vibes" });
  slide2.addText("WEDDING DAY", { ...textProps, color: "D4AF37", x: "65%", y: "60%", w: "30%", fontSize: 24, bold: true });
  slide2.addText(text2, { ...textProps, x: "65%", y: "70%", w: "30%", fontSize: 20 });

  // SLIDE 3: Full Photo + Groom & Bride
  const slide3 = pptx.addSlide();
  slide3.background = { color: "11070A" };
  const img4 = getPhoto(4, "/assets/videowedding-1/anhchung5.jpg");
  try {
    slide3.addImage({ path: img4, x: "0%", y: "0%", w: "100%", h: "100%", sizing: { type: "crop" } });
  } catch(e) { console.error(e); }
  
  // Add semi-transparent overlay
  slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "000000", transparency: 50 } });
  slide3.addText(`${groomName}\n&\n${brideName}`, { ...textProps, x: "0%", y: "40%", w: "100%", fontSize: 72, fontFace: "Great Vibes", bold: true });

  // SLIDE 4: 4 Photos Grid
  const slide4 = pptx.addSlide();
  slide4.background = { color: "11070A" };
  const img5 = getPhoto(5, "/assets/videowedding-1/anhchung6.jpg");
  const img6 = getPhoto(2, "/assets/videowedding-1/anhchung3.jpg");
  const img7 = getPhoto(6, "/assets/videowedding-1/anhchung7.jpg");
  const img8 = getPhoto(7, "/assets/videowedding-1/anhchung8.jpg");
  
  try {
    slide4.addImage({ path: img5, x: "5%", y: "20%", w: "20%", h: "60%", sizing: { type: "crop" } });
    slide4.addImage({ path: img6, x: "27%", y: "20%", w: "20%", h: "60%", sizing: { type: "crop" } });
    slide4.addImage({ path: img7, x: "49%", y: "20%", w: "20%", h: "60%", sizing: { type: "crop" } });
    slide4.addImage({ path: img8, x: "71%", y: "20%", w: "20%", h: "60%", sizing: { type: "crop" } });
  } catch(e) { console.error(e); }

  slide4.addText("OUR JOURNEY", { ...textProps, x: "0%", y: "5%", w: "100%", fontSize: 36, color: "D4AF37", bold: true, letterSpacing: 5 });

  // SLIDE 5: Thank You
  const slide5 = pptx.addSlide();
  slide5.background = { color: "11070A" };
  const img9 = getPhoto(8, "/assets/videowedding-1/anhchung9.jpg");
  try {
    slide5.addImage({ path: img9, x: "0%", y: "0%", w: "100%", h: "100%", sizing: { type: "crop" } });
  } catch(e) { console.error(e); }
  
  slide5.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "000000", transparency: 50 } });
  slide5.addText("Thank You", { ...textProps, x: "0%", y: "45%", w: "100%", fontSize: 80, fontFace: "Great Vibes" });

  // Save the presentation
  await pptx.writeFile({ fileName: `StoryOfUs_${groomName}_${brideName}.pptx` });
}

export async function exportVideoWedding2ToPPTX(customData: any) {
  const pptxgen = (await import("pptxgenjs")).default;
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.title = "Vu Tru Trai Tim - Wedding Presentation";

  const textProps = { color: "C69C6D", fontFace: "Playfair Display", align: "center" as const };
  const text1 = customData?.text1 || "LỄ THÀNH HÔN";
  const text2 = customData?.text2 || "CHÚNG TÔI SẮP KẾT HÔN!";
  const text3 = customData?.text3 || "TÌNH YÊU ĐÍCH THỰC";
  const date = customData?.date || "25.07.2026";
  const groomName = customData?.groomName || "Huy Bình";
  const brideName = customData?.brideName || "Anh Thư";

  const photos = customData?.photos || [];
  const getPhoto = (index: number, fallback: string) => {
    return getAbsoluteUrl(photos[index] || fallback);
  };

  // SLIDE 1
  const slide1 = pptx.addSlide();
  slide1.background = { color: "0F0407" };
  slide1.addText(text1, { ...textProps, y: "30%", w: "100%", fontSize: 40 });
  slide1.addText(`${groomName} & ${brideName}`, { ...textProps, y: "45%", w: "100%", fontSize: 72, bold: true });
  slide1.addText(date, { ...textProps, y: "70%", w: "100%", fontSize: 36 });

  // SLIDE 2: 3 Photos
  const slide2 = pptx.addSlide();
  slide2.background = { color: "0F0407" };
  try {
    slide2.addImage({ path: getPhoto(0, "/assets/videowedding-2/anhchung.jpg"), x: "5%", y: "15%", w: "20%", h: "70%", sizing: { type: "crop" } });
    slide2.addImage({ path: getPhoto(1, "/assets/videowedding-2/anhchung2.jpg"), x: "30%", y: "15%", w: "20%", h: "70%", sizing: { type: "crop" } });
    slide2.addImage({ path: getPhoto(2, "/assets/videowedding-2/anhchung3.jpg"), x: "55%", y: "15%", w: "20%", h: "70%", sizing: { type: "crop" } });
  } catch(e) {}
  slide2.addText("Hành Trình\nTình Yêu", { ...textProps, x: "78%", y: "40%", w: "20%", fontSize: 40 });

  // SLIDE 3: Groom & Bride
  const slide3 = pptx.addSlide();
  slide3.background = { color: "0F0407" };
  try {
    slide3.addImage({ path: getPhoto(4, "/assets/videowedding-2/chure.jpg"), x: "5%", y: "20%", w: "40%", h: "60%", sizing: { type: "crop" } });
    slide3.addImage({ path: getPhoto(5, "/assets/videowedding-2/codau.jpg"), x: "55%", y: "20%", w: "40%", h: "60%", sizing: { type: "crop" } });
  } catch(e) {}
  slide3.addText(groomName, { ...textProps, x: "5%", y: "85%", w: "40%", fontSize: 32 });
  slide3.addText(brideName, { ...textProps, x: "55%", y: "85%", w: "40%", fontSize: 32 });

  // SLIDE 4: Journey
  const slide4 = pptx.addSlide();
  slide4.background = { color: "0F0407" };
  try {
    slide4.addImage({ path: getPhoto(6, "/assets/videowedding-2/anhchung7.jpg"), x: "10%", y: "10%", w: "80%", h: "80%", sizing: { type: "crop" } });
  } catch(e) {}
  slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "000000", transparency: 60 } });
  slide4.addText(text2, { ...textProps, y: "40%", w: "100%", fontSize: 48, bold: true });
  slide4.addText(text3, { ...textProps, y: "55%", w: "100%", fontSize: 32 });

  // Save the presentation
  await pptx.writeFile({ fileName: `Wedding2_${groomName}_${brideName}.pptx` });
}
