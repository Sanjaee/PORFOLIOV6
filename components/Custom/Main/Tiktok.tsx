"use client";

import React, { useEffect } from "react";

export default function Embed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <blockquote
      data-testid="tiktok-embed"
      className="tiktok-embed"
      cite="https://www.tiktok.com/@ahmadafriza25"
      data-unique-id="ahmadafriza25"
      data-embed-type="creator"
      style={{ maxWidth: "780px", minWidth: "288px" }}
    >
      <section>
        <a
          target="_blank"
          href="https://www.tiktok.com/@ahmadafriza25"
        >
          @ahmadafriza25.com
        </a>
      </section>
    </blockquote>
  );
}
