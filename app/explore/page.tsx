// "use client"
import React from "react";
import { Navigation } from "../components/nav";
import { MainPage } from "./main";

export default async function ExplorePage() {
  return (
    <div>
      <Navigation />
      <MainPage/>
    </div>
  );
};