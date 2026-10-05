import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n";

/**
 * The card every share and rich search result shows. Drawn rather than stored,
 * so it carries the live tagline in the reader's language and never drifts out
 * of sync with a checked-in PNG.
 */
export const alt = "GLARA — Floating vanity systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const rtl = locale === "ar";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 184,
            letterSpacing: rtl ? 0 : 18,
            color: "#1a1a1a",
            lineHeight: 1,
            display: "flex",
          }}
        >
          GLARA
        </div>

        <div
          style={{
            marginTop: 40,
            width: 220,
            height: 2,
            background: "#c6a87a",
            display: "flex",
          }}
        />

        <div
          style={{
            marginTop: 40,
            fontSize: 34,
            letterSpacing: rtl ? 0 : 6,
            color: "#c6a87a",
            textTransform: rtl ? "none" : "uppercase",
            display: "flex",
            textAlign: "center",
          }}
        >
          {t.meta.tagline}
        </div>

        <div
          style={{
            marginTop: 26,
            fontSize: 26,
            color: "rgba(26,26,26,0.55)",
            display: "flex",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {t.footer.madeIn}
        </div>
      </div>
    ),
    size,
  );
}
