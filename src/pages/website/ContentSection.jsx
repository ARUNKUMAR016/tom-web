// src/pages/ContentSection.jsx
import React from "react";

export default function ContentSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#CDBF9C]/30 via-white to-[#CDBF9C]/20">
      {/* Top accent line */}
      {/* <div className="h-1 w-full bg-gradient-to-r from-[#253428] via-[#728175] to-[#253428]" /> */}

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        {/* Title row */}
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="cutive-font text-3xl md:text-4xl font-bold tracking-tight text-[#253428]">
              Rooted in Culture, Served with Love
            </h2>
            <p className="cutive-font mt-2 text-sm md:text-base text-[#728175] max-w-2xl">
              Inspired by Madurai’s timeless temples, our kitchen celebrates
              heritage through authentic flavors and a modern dining experience.
            </p>
          </div>

          {/* Tiny badge */}
          <div className="cutive-font inline-flex items-center gap-2 rounded-full border border-[#728175]/40 bg-white px-4 py-2 text-xs font-medium text-[#253428] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#728175]" />
            Madurai • Est. 2025
          </div>
        </div>

        {/* Image + story grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr,1fr] md:items-center">
          {/* Image collage */}
          <div className="relative">
            {/* Back glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-[#728175]/20 via-transparent to-[#253428]/10 blur-2xl" />

            <div className="grid grid-cols-2 gap-4">
              {/* Left (big) image */}
              <figure className="col-span-2 overflow-hidden rounded-3xl border border-[#253428]/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <img
                  src="/temple_1.jpg"
                  alt="Madurai temple gopuram"
                  className="h-64 w-full object-cover md:h-80 transition-transform duration-500 ease-out hover:scale-[1.02]"
                  loading="lazy"
                />
              </figure>

              {/* Right stack */}
              <figure className="overflow-hidden rounded-3xl border border-[#253428]/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <img
                  src="/temple_2.jpg"
                  alt="Temple architecture details"
                  className="h-44 w-full object-cover md:h-56 transition-transform duration-500 ease-out hover:scale-[1.03]"
                  loading="lazy"
                />
              </figure>

              {/* Cultural card */}
              <div className="rounded-3xl border border-[#728175]/30 bg-[#CDBF9C]/20 p-5 shadow-sm">
                <h3 className="cutive-font text-lg font-semibold text-[#253428]">
                  Temple City Essence
                </h3>
                <p className="cutive-font mt-2 text-sm text-[#728175]">
                  From sacred prasad flavors to homestyle spice blends, every
                  plate honors tradition—crafted fresh, plated modern.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs">
                  <span className="cutive-font rounded-full bg-white px-3 py-1 text-[#253428] border border-[#253428]/20">
                    Authentic
                  </span>
                  <span className="cutive-font rounded-full bg-white px-3 py-1 text-[#253428] border border-[#253428]/20">
                    Vegetarian Friendly
                  </span>
                  <span className="cutive-font rounded-full bg-white px-3 py-1 text-[#253428] border border-[#253428]/20">
                    Spice Level Options
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Story / CTA */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-[#253428]/10 bg-white p-6 shadow-sm">
              <h3 className="cutive-font text-xl font-semibold text-[#253428]">
                The Taste of Madurai Promise
              </h3>
              <p className="cutive-font mt-2 text-[#728175] text-sm leading-relaxed">
                We bring the warmth of Tamil hospitality to your table. Our
                chefs use traditional recipes, stone-ground masalas, and
                seasonal ingredients—presented with a clean, modern touch.
              </p>
              <ul className="mt-4 grid gap-3 text-sm text-[#728175]">
                <li className="cutive-font flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#728175]" />
                  Classic dishes like Masala Dosa, Medhu Vada &amp; Rose Milk
                </li>
                <li className="cutive-font flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#728175]" />
                  Vegan / Vegetarian / Gluten-free friendly options
                </li>
                <li className="cutive-font flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#728175]" />
                  Spice levels tailored to your taste
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#menu"
                  className="cutive-font rounded-full bg-[#253428] px-5 py-2.5 text-sm font-medium text-[#CDBF9C] shadow hover:bg-[#728175] hover:text-white transition"
                >
                  Explore Menu
                </a>
                <a
                  href="#contact"
                  className="cutive-font rounded-full border border-[#253428]/30 bg-white px-5 py-2.5 text-sm font-medium text-[#253428] hover:border-[#728175] hover:text-[#728175] transition"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Subtle note */}
            <div className="cutive-font text-xs text-[#728175]">
              *Images showcase the cultural heritage that inspires our cuisine.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#253428] via-[#728175] to-[#253428]" />
    </section>
  );
}
