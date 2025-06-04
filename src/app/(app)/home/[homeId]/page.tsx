"use client";

import { useHome } from "@/contexts/home.context";

export default function HomePage() {
  const { homeData } = useHome();

  return <div></div>;
}
