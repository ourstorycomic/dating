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
    <div className="w-full h-full flex items-center justify-center bg-gray-50/50">
      <Valentine2WatchParty 
        compact={compact} 
        fullScreen={!compact && !isBuilderPreview} 
        hideNavigation={compact || hideNavigation}
        data={props.customData || (props as any)}
        roomId={roomId}
        onResponse={props.onResponse}
      />
    </div>
  );
}
