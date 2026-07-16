import { WeddingSixExperience } from './Experience';
import { config } from './config';
import type { TemplatePreviewProps } from "../previews/types";

export function WeddingSixPreview(props: TemplatePreviewProps) {
  const parsedConfig = (props.customData || {}) as Record<string, any>;
  
  return (
    <WeddingSixExperience 
      {...config.defaultData} 
      {...parsedConfig}
      compact={props.compact} 
      autoPlay={props.autoPlay} 
    />
  );
}
