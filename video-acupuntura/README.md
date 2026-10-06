# Guía visual de puntos de acupuntura

Video vertical 9:16 de aproximadamente 1 minuto sobre cuatro referencias
corporales: LI4 (mano), PC6 (antebrazo), CV17 (tórax) y ST36 (pierna). Incluye
subtítulos con el guion y la narración completa de `docs/PUNTOS DE ACUPUNTURA.m4a`.
La composición está construida en Remotion con formas vectoriales y tipografía;
no utiliza imágenes rasterizadas.

El contenido es informativo. Los esquemas son generales y no están a escala:
no determinan una localización clínica ni sustituyen el diagnóstico, tratamiento
o consejo de personal sanitario cualificado.

## Requisitos

- Node.js
- npm

## Vista previa

```console
npm install
npm run dev
```

En Remotion Studio, selecciona la composición `AcupunctureGuide`.

## Renderizar

```console
npx remotion render AcupunctureGuide out/acupuncture-guide.mp4
```

El audio original se incluye completo en `public/narracion-acupuntura.m4a`.
La duración de salida se ajusta a la pista (62,528 segundos).

## Comprobaciones

```console
npm run lint
npm run build
```
