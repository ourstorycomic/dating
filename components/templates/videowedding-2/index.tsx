import { TemplateConfig } from "@/lib/types/template";
import { default as Preview } from "./preview";
import { VIDEOWEDDING_2_DATA } from "./config";

export const VideoWeddingTwoTemplateConfig: TemplateConfig = {
  id: "videowedding-2",
  name: "Cinema Luxury",
  description: "Video trình chiếu đám cưới phong cách điện ảnh, ánh đèn sân khấu sang trọng và lãng mạn.",
  category: "wedding",
  thumbnailUrl: "/assets/videowedding-2/slide-mau/1.png",
  preview: Preview,
  customData: VIDEOWEDDING_2_DATA,
  config: {
    photoCount: 15,
    textCount: 4,
    hasMusic: true,
    hasAnimation: true,
  }
};

export { Preview, VIDEOWEDDING_2_DATA };
