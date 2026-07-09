import { Valentine2WatchParty } from "./Valentine2WatchParty";
import type { TemplatePreviewProps } from "../previews/types";

export function Valentine2Preview({
  visualLabel,
  compact = false,
  isBuilderPreview = false,
  hideNavigation = false,
  roomId,
  ...props
}: TemplatePreviewProps & { customData?: any; roomId?: string }) {
  return (
    <Valentine2WatchParty 
      compact={compact} 
      fullScreen={!compact && !isBuilderPreview} 
      hideNavigation={hideNavigation}
      isBuilderPreview={isBuilderPreview}
      data={props.customData || (props as any)}
      roomId={roomId}
      isHost={props.isHost}
      initialStep={props.initialStep}
      hostDisplayName={props.hostDisplayName}
      guestDisplayName={props.guestDisplayName}
      autoPlay={props.autoPlay}
      onResponse={props.onResponse}
    />
  );
}
