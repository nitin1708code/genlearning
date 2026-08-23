import React from "react";

import Hero from "../sections/Hero";
import Stats from "../sections/Stats";
import WhatWeOffer from "../sections/whatWeOffer";
import WhyChooseUs from "../sections/WhyChooseUs";
import CTA from "../sections/CTA";

const Home = () => {
  return (
    <>
      <Hero />
      <Stats />
      <WhatWeOffer />
      <WhyChooseUs />
      <CTA />
    </>
  );
};

export default Home;