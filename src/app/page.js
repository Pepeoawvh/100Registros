'use client';

import { LibreBarcode } from "./ui/fonts";
import Inicio from "./components/Inicio";

export default function Home() {
  return (
    <fragment className='grid auto-rows-min justify-center w-full h-screen bg-[#111917] md:m-8 m-2 rounded-xl'>
      <Inicio />
    </fragment>
  );
}