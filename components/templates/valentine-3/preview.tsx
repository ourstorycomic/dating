import { Valentine3Diary } from "./Valentine3Diary";
import type { TemplatePreviewProps } from "../previews/types";

export function Valentine3Preview({
  compact = false,
  isBuilderPreview = false,
  hideNavigation = false,
  roomId,
  ...props
}: TemplatePreviewProps & { customData?: any; roomId?: string }) {
  return (
    <Valentine3Diary 
      compact={compact} 
      fullScreen={!compact && !isBuilderPreview} 
      hideNavigation={hideNavigation}
      isBuilderPreview={isBuilderPreview}
      data={props.customData || (props as any)}
      roomId={roomId}
      autoPlay={props.autoPlay}
      onResponse={props.onResponse}
    />
  );
}
