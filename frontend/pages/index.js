import Image from "next/image";
import { Inter } from "next/font/google";
import PostFiles from "./postFiles";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <PostFiles />
    </>
  );
}
