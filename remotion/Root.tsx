import React, { useEffect, useState } from "react";
import "../app/globals.css";
import { Composition, delayRender, continueRender } from "remotion";
import { VideoWeddingTwoComposition } from "../components/templates/videowedding-2/Composition";
import { VideoWeddingOneComposition } from "../components/templates/videowedding-1/Composition";

export const RemotionRoot: React.FC = () => {
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    document.fonts.ready.then(() => {
      continueRender(handle);
    });
  }, [handle]);

  return (
    <>
      <Composition
        id="videowedding-1"
        component={VideoWeddingOneComposition as any}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          customData: {},
        }}
      />
      <Composition
        id="videowedding-2"
        component={VideoWeddingTwoComposition as any}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          customData: {},
        }}
      />
    </>
  );
};

import { registerRoot } from "remotion";
registerRoot(RemotionRoot);
