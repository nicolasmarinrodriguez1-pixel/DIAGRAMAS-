import { Audio } from "@remotion/media";
import {
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const durationInFrames = 1876;

const colors = {
  blue: "#005b96",
  navy: "#09243a",
  gold: "#f2c14e",
  red: "#d90429",
  ivory: "#fff4d6",
  ink: "#161616",
  skin: "#d9e8ef",
};

type Point = {
  readonly code: string;
  readonly name: string;
  readonly region: string;
  readonly description: string;
  readonly x: number;
  readonly y: number;
};

const points: Point[] = [
  {
    code: "LI4",
    name: "Hegu",
    region: "MANO",
    description: "Entre el pulgar y el índice",
    x: 230,
    y: 700,
  },
  {
    code: "PC6",
    name: "Neiguan",
    region: "ANTEBRAZO",
    description: "Cara interna, cerca de la muñeca",
    x: 540,
    y: 520,
  },
  {
    code: "CV17",
    name: "Shanzhong",
    region: "TÓRAX",
    description: "Centro del tórax",
    x: 400,
    y: 340,
  },
  {
    code: "ST36",
    name: "Zusanli",
    region: "PIERNA",
    description: "Parte frontal, debajo de la rodilla",
    x: 445,
    y: 740,
  },
];

const captions = [
  "¿Has oído hablar de los puntos de acupuntura?",
  "En la tradición de la acupuntura, son referencias descritas en distintas zonas del cuerpo.",
  "Hoy conoceremos cuatro, solo como orientación visual.",
  "LI4 se ubica en la mano, entre el pulgar y el índice.",
  "PC6 se describe en la cara interna del antebrazo, cerca de la muñeca.",
  "CV17 se sitúa en el centro del tórax.",
  "Y ST36 se encuentra en la parte frontal de la pierna, debajo de la rodilla.",
  "Estas descripciones son generales: la ubicación exacta requiere formación profesional.",
  "Este video es informativo; no enseña a tratar, presionar ni aplicar agujas.",
  "La acupuntura no sustituye una evaluación ni la atención sanitaria.",
  "Si tienes dudas sobre tu salud, consulta a personal sanitario cualificado.",
  "Guarda este video y compártelo para seguir aprendiendo.",
];

const countWords = (text: string) => text.trim().split(/\s+/).length;
const totalWords = captions.reduce((total, caption) => total + countWords(caption), 0);

const getCaptionAtFrame = (frame: number) => {
  let precedingWords = 0;

  for (const caption of captions) {
    const start = Math.round((precedingWords / totalWords) * durationInFrames);
    precedingWords += countWords(caption);
    const end = Math.round((precedingWords / totalWords) * durationInFrames);

    if (frame >= start && frame < end) {
      return { text: caption, start, end };
    }
  }

  return {
    text: captions[captions.length - 1],
    start: durationInFrames - 1,
    end: durationInFrames,
  };
};

const frameStyle = {
  position: "absolute" as const,
  inset: 0,
  overflow: "hidden" as const,
  backgroundColor: colors.navy,
  color: colors.ivory,
  fontFamily: "Arial, Helvetica, sans-serif",
};

const BodyDiagram: React.FC<{ point?: Point }> = ({ point }) => {
  const frame = useCurrentFrame();

  return (
    <svg
      viewBox="0 0 800 1000"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      role="img"
      aria-label={
        point
          ? `Esquema corporal con referencia visual de ${point.code}`
          : "Esquema corporal con cuatro referencias visuales"
      }
    >
      <g fill={colors.skin} stroke={colors.ink} strokeWidth="10">
        <circle cx="400" cy="160" r="64" />
        <path d="M365 222 L365 254 L435 254 L435 222" />
        <path d="M340 252 C305 264 275 293 265 344 L250 482 C247 506 262 520 280 520 C297 520 304 507 308 486 L333 365 L340 555 L330 814 L300 936 L362 944 L400 830 L438 944 L500 936 L470 814 L460 555 L467 365 L492 486 C496 507 503 520 520 520 C538 520 553 506 550 482 L535 344 C525 293 495 264 460 252 Z" />
        <path d="M267 340 C245 365 230 397 226 438 L213 664 C212 688 221 700 237 700 C252 700 261 689 263 668 L283 470 Z" />
        <path d="M533 340 C555 365 570 397 574 438 L587 664 C588 688 579 700 563 700 C548 700 539 689 537 668 L517 470 Z" />
        <path d="M300 936 L295 960 L371 960 L362 944 M500 936 L505 960 L429 960 L438 944" />
      </g>
      <g fill="none" stroke={colors.blue} strokeWidth="5" opacity="0.8">
        <path d="M341 286 C374 310 426 310 459 286" />
        <path d="M347 430 C379 448 421 448 453 430" />
        <path d="M365 575 C385 587 415 587 435 575" />
      </g>
      {points.map((item) => (
        <circle
          key={item.code}
          cx={item.x}
          cy={item.y}
          r={point?.code === item.code ? 11 : 7}
          fill={point?.code === item.code ? colors.gold : colors.red}
          opacity={point && point.code !== item.code ? 0.65 : 1}
        />
      ))}
      {point ? (
        <g
          transform={`translate(${point.x} ${point.y})`}
          style={{
            scale: interpolate(frame % 48, [0, 24, 48], [0.86, 1.32, 0.86], {
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.ease),
            }),
          }}
        >
          <circle r="28" fill="none" stroke={colors.gold} strokeWidth="5" />
          <circle r="9" fill={colors.red} stroke={colors.ivory} strokeWidth="3" />
        </g>
      ) : null}
    </svg>
  );
};

const CaptionPanel: React.FC<{ text: string; startFrame: number }> = ({
  text,
  startFrame,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: 1432,
        minHeight: 290,
        boxSizing: "border-box",
        padding: "38px 46px",
        display: "flex",
        alignItems: "center",
        backgroundColor: colors.ivory,
        borderLeft: `12px solid ${colors.red}`,
        color: colors.ink,
        fontSize: 43,
        fontWeight: 600,
        lineHeight: 1.32,
        opacity: interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
          extrapolateRight: "clamp",
        }),
      }}
    >
      {text}
    </div>
  );
};

export const AcupunctureVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const caption = getCaptionAtFrame(frame);
  const captionIndex = captions.indexOf(caption.text);
  const activePoint = points[captionIndex - 3];
  const isSafetySection = captionIndex >= 7 && captionIndex <= 10;
  const isCallToAction = captionIndex === 11;

  return (
    <div style={frameStyle}>
      <Audio
        src={staticFile("narracion-acupuntura.m4a")}
        durationInFrames={durationInFrames}
        premountFor={fps}
      />
      <div
        style={{
          position: "absolute",
          inset: 30,
          border: `2px solid ${colors.gold}`,
          opacity: 0.72,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 76,
          color: colors.gold,
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: 6,
        }}
      >
        GUÍA VISUAL · INFORMACIÓN GENERAL
      </div>
      <div
        style={{
          position: "absolute",
          left: 82,
          top: 123,
          right: 82,
          fontSize: 43,
          fontWeight: 900,
          letterSpacing: 1,
        }}
      >
        PUNTOS DE ACUPUNTURA
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 206,
          width: 940,
          height: 875,
          opacity: isSafetySection ? 0.42 : 1,
        }}
      >
        <BodyDiagram point={activePoint} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1100,
          minHeight: 260,
          boxSizing: "border-box",
          padding: "27px 38px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#103650",
          borderTop: `5px solid ${colors.gold}`,
        }}
      >
        {activePoint ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 23,
                color: colors.gold,
              }}
            >
              <span style={{ fontSize: 74, fontWeight: 900 }}>
                {activePoint.code}
              </span>
              <span style={{ fontSize: 32, fontWeight: 700 }}>
                {activePoint.name}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: 4,
                }}
              >
                {activePoint.region}
              </span>
            </div>
            <div style={{ marginTop: 6, fontSize: 37, lineHeight: 1.2 }}>
              {activePoint.description}
            </div>
            <div
              style={{
                marginTop: 12,
                color: "#bdd1db",
                fontSize: 22,
                letterSpacing: 2,
              }}
            >
              ESQUEMA GENERAL · NO A ESCALA
            </div>
          </>
        ) : isSafetySection ? (
          <>
            <div
              style={{
                color: colors.gold,
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              IMPORTANTE
            </div>
            <div style={{ marginTop: 18, fontSize: 39, lineHeight: 1.2 }}>
              La ubicación exacta requiere formación profesional.
            </div>
          </>
        ) : isCallToAction ? (
          <>
            <div
              style={{
                color: colors.gold,
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              SIGUE APRENDIENDO
            </div>
            <div style={{ marginTop: 18, fontSize: 39, lineHeight: 1.2 }}>
              Guarda y comparte esta guía visual.
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                color: colors.gold,
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              CUATRO REFERENCIAS CORPORALES
            </div>
            <div style={{ marginTop: 18, fontSize: 39, lineHeight: 1.2 }}>
              LI4 · Mano &nbsp; PC6 · Antebrazo
              <br />
              CV17 · Tórax &nbsp; ST36 · Pierna
            </div>
          </>
        )}
      </div>
      <CaptionPanel text={caption.text} startFrame={caption.start} />
      <div
        style={{
          position: "absolute",
          left: 86,
          right: 86,
          bottom: 57,
          height: 7,
          backgroundColor: "#345469",
        }}
      >
        <div
          style={{
            width: `${interpolate(frame, [0, durationInFrames], [0, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}%`,
            height: "100%",
            backgroundColor: colors.red,
          }}
        />
      </div>
    </div>
  );
};
