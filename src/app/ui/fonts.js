import {
  Montserrat,
  Jost,
  Questrial,
  Merriweather,
  Merriweather_Sans,
  Pinyon_Script,
Lora,
  Kaushan_Script,
  Libre_Barcode_39_Text
  
} from "next/font/google";

export const montserrat = Montserrat({ subsets: ["latin"] });

export const jost = Jost({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const questrial = Questrial({
  weight: ["400"],
  subsets: ["latin"],
});

export const merriweather = Merriweather({
  weight: ["400", "300", "700", "900"],
  subsets: ["latin"],
});

export const merriweatherSans = Merriweather_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

export const pinyonScript = Pinyon_Script({
  weight: ["400"],
  subsets: ["latin"],
});

export const Lora400 = Lora({
  weight: ["400"],
  subsets: ["latin"],
});
export const Kaushan400 = Kaushan_Script({
  weight: ["400"],
  subsets: ["latin"],
});
export const LibreBarcode = Libre_Barcode_39_Text({
  weight: ["400"],
  subsets: ["latin"],
});