import React from "react";
import { Home, GraduationCap, Code2, Briefcase, Handshake, MessageCircle, Mail, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Dock, DockItem } from "./motion-primitives/dock";

const GlobalDock = () => {
  return (
    <div className="hero-dock">
      <Dock>

        <DockItem title="Home" href="/">
          <Home size={21} strokeWidth={1.8} />
        </DockItem>

        <DockItem title="Courses" href="/courses">
          <GraduationCap size={21} strokeWidth={1.8} />
        </DockItem>

        <DockItem title="IT Services" href="/services">
          <Code2 size={21} strokeWidth={1.8} />
        </DockItem>

        <DockItem title="Projects" href="/projects">
          <Briefcase size={21} strokeWidth={1.8} />
        </DockItem>

        <DockItem title="Mentoring" href="/mentoring">
          <Handshake size={21} strokeWidth={1.8} />
        </DockItem>

        <DockItem title="Contact" href="/contact">
          <MessageCircle size={21} strokeWidth={1.8} />
        </DockItem>

        <DockItem title="Email Us" href="mailto:contact@genlearning.in">
          <Mail size={21} strokeWidth={1.8} />
        </DockItem>

        {/* <DockItem title="Theme" href="#">
          <Sun size={21} strokeWidth={1.8} />
        </DockItem> */}

      </Dock>
    </div>
  );
};

export default GlobalDock;