import { Composition } from "remotion";
import { AcupunctureVideo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AcupunctureGuide"
        component={AcupunctureVideo}
        durationInFrames={1876}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
