import Birthday2Diary from "./index";

export default function Birthday2Preview({ autoPlay = false, compact = false }: { autoPlay?: boolean; compact?: boolean }) {
  return <Birthday2Diary autoPlay={autoPlay} compact={compact} />;
}
