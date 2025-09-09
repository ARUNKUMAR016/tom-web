import React from "react";
import OpenStatus from "./OpenStatus";
import { Link } from "react-router-dom";

export default function MobileHoursBar() {
  return (
    <div className="fixed bottom-3 inset-x-3 z-[60] md:hidden">
      <div className="rounded-full bg-[#253428] text-[#CDBF9C] shadow-lg px-4 py-2 flex items-center justify-between gap-3">
        <OpenStatus className="bg-transparent text-[#CDBF9C]" />
        <Link
          to="/contact"
          className="cutive-font rounded-full bg-[#CDBF9C] text-[#253428] px-4 py-1.5 text-sm font-medium"
        >
          Call / Directions
        </Link>
      </div>
    </div>
  );
}
