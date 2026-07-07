import React from "react";
import { Composition } from "remotion";
import { BasicReel, defaultReelProps } from "./BasicReel";
import { MicroblogSlide, defaultMicroblogSlideProps } from "./components/MicroblogSlide";
import { FEED_HEIGHT, FEED_WIDTH, REEL_DURATION_FRAMES, REEL_FPS } from "./lib/constants";
import { MICROBLOG_HEIGHT, MICROBLOG_WIDTH } from "./lib/microblog";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BasicReel"
        component={BasicReel}
        durationInFrames={REEL_DURATION_FRAMES}
        fps={REEL_FPS}
        width={FEED_WIDTH}
        height={FEED_HEIGHT}
        defaultProps={defaultReelProps}
      />
      <Composition
        id="MicroblogSlide"
        component={MicroblogSlide}
        durationInFrames={60}
        fps={30}
        width={MICROBLOG_WIDTH}
        height={MICROBLOG_HEIGHT}
        defaultProps={defaultMicroblogSlideProps}
      />
    </>
  );
};
