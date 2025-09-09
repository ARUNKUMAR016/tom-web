// src/pages/Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import FeedbackPopup from "./Feedback";

export default function Home() {
  const [lang, setLang] = useState("en");
  // const t = useMemo(() => T[lang], [lang]);

  return (
    <>
      <HeroSection />
      <ContentSection />
      <FeedbackPopup />
    </>
  );
}
