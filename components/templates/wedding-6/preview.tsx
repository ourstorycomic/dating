import { WeddingSixExperience } from './Experience';
import { config } from './config';
import type { TemplatePreviewProps } from "../previews/types";

export function WeddingSixPreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;
  
  return (
    <WeddingSixExperience 
      {...config.defaultData} 
      {...parsedConfig}
      gallery={
        [
          parsedConfig.gallery1,
          parsedConfig.gallery2,
          parsedConfig.gallery3,
          parsedConfig.gallery4,
          parsedConfig.gallery5,
          parsedConfig.gallery6,
          parsedConfig.gallery7,
          parsedConfig.gallery8,
        ].filter(Boolean).length > 0
          ? [
              parsedConfig.gallery1,
              parsedConfig.gallery2,
              parsedConfig.gallery3,
              parsedConfig.gallery4,
              parsedConfig.gallery5,
              parsedConfig.gallery6,
              parsedConfig.gallery7,
              parsedConfig.gallery8,
            ].filter(Boolean)
          : parsedConfig.gallery || config.defaultData.gallery
      }
      compact={props.compact} 
      autoPlay={props.autoPlay}
      fullScreen={props.fullScreen}
      customData={parsedConfig}
    />
  );
}
