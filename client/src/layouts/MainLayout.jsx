import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dock from "../components/Dock";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>
       <Dock />
      <Footer />
    </>
  );
};

export default MainLayout;