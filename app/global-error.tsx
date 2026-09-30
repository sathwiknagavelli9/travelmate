"use client";
import Link from "next/link";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          padding: 40,
          color: "#205440",
          background: "#f7f8f3",
        }}
      >
        <h1>TravelMate</h1>
        <h2>A small detour.</h2>
        <p>We couldn’t connect right now. Please try again in a moment.</p>
        <button onClick={reset}>Try again</button>
        <p>
          <Link href="/">Return home</Link>
        </p>
      </body>
    </html>
  );
}
