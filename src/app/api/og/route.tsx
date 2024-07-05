/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("n");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to bottom, #dbf4ff, #fff1f1)",
          fontSize: 60,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))",
            backgroundClip: "text",
            color: "transparent",
          }}
        ></div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            backgroundClip: "text",
            color: "transparent",
          }}
        ></div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))",
            backgroundClip: "text",
            color: "transparent",
          }}
        ></div>
        <img
          width="256"
          height="256"
          alt=""
          src={"https://lnkit.vercel.app/favicon.webp"}
          style={{
            borderRadius: 128,
          }}
        />
        <p style={{ fontWeight: 500 }}>{name}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// todo
