import Birthday2Diary from "./index";

import { TemplatePreviewProps } from "../previews/types";

export default function Birthday2Preview(props: TemplatePreviewProps) {
  return <Birthday2Diary autoPlay={props.autoPlay} compact={props.compact} isBuilderPreview={props.isBuilderPreview} generalAudioUrl={props.generalAudioUrl} />;
}
