import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont as loadPlusJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { BrandBackground } from "./components/BrandBackground";
import { TextScene } from "./components/TextScene";
import {
  REEL_SCENE_SHELL,
  ReelProgress,
  ReelTopTagline,
} from "./components/reel-ui";
import { ReelCtaCard } from "./components/ReelSceneDecoration";
import { SCENES, type ReelProps } from "./lib/constants";
import { SCENE_TRANSITION_FRAMES } from "./lib/reel-motion";

const { fontFamily: headingFont } = loadPlusJakarta("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: bodyFont } = loadPlusJakarta("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

const X = SCENE_TRANSITION_FRAMES;

function sceneDuration(base: number, isFirst = false) {
  return isFirst ? base : base + X;
}

function sceneFrom(base: number, isFirst = false) {
  return isFirst ? base : base - X;
}

export const BasicReel: React.FC<ReelProps> = ({
  hook,
  hookSubtitle,
  points,
  cta,
  visualAssets,
}) => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-heading": headingFont,
          "--font-body": bodyFont,
        } as React.CSSProperties
      }
    >
      <BrandBackground />

      <Sequence from={sceneFrom(SCENES.hook.from, true)} durationInFrames={sceneDuration(SCENES.hook.duration, true)}>
        <TextScene
          eyebrow="Web Basic"
          headline={hook}
          body={hookSubtitle}
          imageSrc={visualAssets?.hook}
          durationInFrames={SCENES.hook.duration}
        />
      </Sequence>

      <Sequence from={sceneFrom(SCENES.p1.from)} durationInFrames={sceneDuration(SCENES.p1.duration)}>
        <TextScene
          step="01"
          headline={points[0].title}
          body={points[0].body}
          imageSrc={visualAssets?.p1}
          durationInFrames={sceneDuration(SCENES.p1.duration)}
        />
      </Sequence>

      <Sequence from={sceneFrom(SCENES.p2.from)} durationInFrames={sceneDuration(SCENES.p2.duration)}>
        <TextScene
          step="02"
          headline={points[1].title}
          body={points[1].body}
          imageSrc={visualAssets?.p2}
          durationInFrames={sceneDuration(SCENES.p2.duration)}
        />
      </Sequence>

      <Sequence from={sceneFrom(SCENES.p3.from)} durationInFrames={sceneDuration(SCENES.p3.duration)}>
        <TextScene
          step="03"
          headline={points[2].title}
          body={points[2].body}
          imageSrc={visualAssets?.p3}
          durationInFrames={sceneDuration(SCENES.p3.duration)}
        />
      </Sequence>

      <Sequence from={sceneFrom(SCENES.cta.from)} durationInFrames={sceneDuration(SCENES.cta.duration)}>
        <AbsoluteFill>
          <ReelTopTagline />
          <AbsoluteFill
            style={{
              justifyContent: "center",
              padding: `${REEL_SCENE_SHELL.padTop + 24}px ${REEL_SCENE_SHELL.padX}px ${REEL_SCENE_SHELL.padBottom}px`,
            }}
          >
            <ReelCtaCard cta={cta} durationInFrames={sceneDuration(SCENES.cta.duration)} />
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill style={{ zIndex: 4, pointerEvents: "none" }}>
        <ReelProgress />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const defaultReelProps: ReelProps = {
  title: "Apa itu HTTP Request",
  hook: "HTTP itu apa sih sebenarnya?",
  hookSubtitle:
    "Sebelum ngulik framework, pahami dulu cara browser dan server saling kirim data lewat HTTP.",
  points: [
    { title: "Request = permintaan dari client", body: "Browser atau app kirim request ke server. Isinya method, URL, dan header." },
    { title: "Response = jawaban dari server", body: "Server balas dengan status code, header, dan body. Contoh 200 OK atau 404 Not Found." },
    { title: "Method umum: GET dan POST", body: "GET buat ambil data. POST buat kirim data baru. Dua ini paling sering kamu pakai." },
  ],
  cta: "Save buat belajar nanti. Follow @mulaidaribasic",
  thumbnailText: "HTTP BASIC",
};
