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
        >
          {name}
        </div>
      </div>
    )
  );
}

// todo
