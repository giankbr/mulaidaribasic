import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont as loadPlusJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { BrandBackground } from "./components/BrandBackground";
import { TextScene } from "./components/TextScene";
import {
  REEL_SCENE_SHELL,
  ReelTopTagline,
} from "./components/reel-ui";
import { ReelCtaCard } from "./components/ReelSceneDecoration";
import { SCENES, type ReelProps } from "./lib/constants";

const { fontFamily: headingFont } = loadPlusJakarta("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: bodyFont } = loadPlusJakarta("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

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

      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration}>
        <TextScene
          eyebrow="Web Basic"
          headline={hook}
          body={hookSubtitle}
          imageSrc={visualAssets?.hook}
        />
      </Sequence>

      <Sequence from={SCENES.p1.from} durationInFrames={SCENES.p1.duration}>
        <TextScene
          step="01"
          headline={points[0].title}
          body={points[0].body}
          imageSrc={visualAssets?.p1}
        />
      </Sequence>

      <Sequence from={SCENES.p2.from} durationInFrames={SCENES.p2.duration}>
        <TextScene
          step="02"
          headline={points[1].title}
          body={points[1].body}
          imageSrc={visualAssets?.p2}
        />
      </Sequence>

      <Sequence from={SCENES.p3.from} durationInFrames={SCENES.p3.duration}>
        <TextScene
          step="03"
          headline={points[2].title}
          body={points[2].body}
          imageSrc={visualAssets?.p3}
        />
      </Sequence>

      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <AbsoluteFill>
          <ReelTopTagline />
          <AbsoluteFill
            style={{
              justifyContent: "center",
              padding: `${REEL_SCENE_SHELL.padTop + 24}px ${REEL_SCENE_SHELL.padX}px ${REEL_SCENE_SHELL.padBottom}px`,
            }}
          >
            <ReelCtaCard cta={cta} />
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>
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
