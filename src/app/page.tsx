"use client";

import Image from "next/image";
import Link from "next/link";
import { NUM_PLAYERS, NUM_DETONATE_ALLERS } from "@/constants";
import { Press_Start_2P, Orbitron } from "next/font/google";
import { useStore } from "@/hooks/useStore";
import {
  AptosConnectButton,
  AptosWalletProvider,
  useAptosWallet,
} from "@razorlabs/wallet-kit";

const bitFont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  display: "block",
});
const modernFont = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "block",
});

export default function Home() {
  const wallet = useAptosWallet();

  console.log(wallet.address);

  const setUsername = useStore((state) => state?.setUserName);
  if (wallet) {
    setUsername(wallet.address);
  }

  return (
    <div className={`${bitFont.className} text-white`}>
      <div className=" justify-end absolute top-0 h-14  z-20 w-full flex">
        <div
          className={`${bitFont.className}  flex-col items-center flex justify-center mr-4 mt-1`}
        >
          <div className=" bg-yellow-500  hover:bg-yellow-600    rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform  text-xl">
            <AptosConnectButton
              className={`   border-2 border-white  ${bitFont.className} `}
            >
              <span className=" text-black hover:text-white  transition-colors">
                Connect Wallet
              </span>
            </AptosConnectButton>
          </div>
        </div>
      </div>
      {/* Initial view */}
      <section className="h-screen flex flex-col items-center justify-center gap-4 relative">
        <Image
          src="/background.png"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
          className="contrast-150 brightness-50"
          alt="Crypto Roulette background"
        />
        <div className="z-10 text-center">
          <h1
            className={`${bitFont.className} text-5xl mb-7 text-yellow-400 animate-pulse`}
          >
            Crypto Roulette
          </h1>
          <p className="text-xl mb-10   text-red-500 font-bold tracking-wide">
            Push the detonate button...
            <span className="block mt-2 text-gray-400">if you dare</span>
          </p>
          <div></div>

          <div className={`${bitFont.className}  flex flex-col items-center gap-3 justify-center`}>
            <button
              disabled={!wallet.connected}
              onClick={()=>document.location.href=("/play")}
              title={!wallet.connected?"Please connect your Movement wallet":""}
              className={`hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-600  bg-red-700 px-20 py-5 hover:bg-red-600 text-white   rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 text-xl`}
            >
              Start
            </button>
            <div className={`${modernFont.className} tracking-wide`}>{!wallet.connected?"Please connect your Movement wallet":""} </div>
          </div>
        </div>
        <div className="absolute bottom-8 text-center w-full animate-bounce">
          <p className=" font-bold">Scroll for rules</p>
          <span className="text-3xl">↓</span>
        </div>
      </section>

      {/* Rules and additional information */}
      <section className="min-h-screen py-16 relative">
        <Image
          src="/backg2.png"
          layout="fill"
          objectFit="cover"
          quality={100}
          className=" bg-cover contrast-150 brightness-50"
          alt="Crypto Roulette rules background"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="md:flex md:items-start md:justify-between">
            <div className="md:w-1/2 pr-8">
              <h2
                className={`${bitFont.className} text-3xl mb-8 text-yellow-400`}
              >
                How to Play
              </h2>
              <div className="grid grid-cols-1 gap-8 mb-16">
                <div className="border border-yellow p-4 rounded-lg">
                  <h3
                    className={`${bitFont.className} text-xl mb-2 text-yellow-400`}
                  >
                    Join
                  </h3>
                  <p className="text-green-400">Pay the entry fee </p>
                </div>
                <div className="border border-yellow-500 p-4 rounded-lg">
                  <h3
                    className={`${bitFont.className} text-xl mb-2 text-yellow-400`}
                  >
                    Choose
                  </h3>
                  <p className="text-green-400">Either push detonate or pass</p>
                </div>
                <div className="border border-yellow-500 p-4 rounded-lg">
                  <h3
                    className={`${bitFont.className} text-xl mb-2 text-yellow-400`}
                  >
                    Win
                  </h3>
                  <p className="text-green-400">Or lose it all in an instant</p>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 pl-8">
              <h3
                className={`${bitFont.className} text-2xl mb-4 text-yellow-400`}
              >
                Rules
              </h3>
              <ul className="text-green-400 mb-8 space-y-4">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>
                    {NUM_PLAYERS} players, {NUM_PLAYERS} detonators.{" "}
                    {NUM_DETONATE_ALLERS} special.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Choose to detonate or skip each round.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>No detonation? Random eliminations occur.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Last players standing split the pot.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className={`${bitFont.className} text-2xl text-red-500 mb-8`}>
              Do you feel lucky?
            </p>
            <Link href="/play">
              <button
                className={`${bitFont.className} bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105`}
              >
                Start Game
              </button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-black py-4 text-center text-gray-400">
        <p>&copy; 2024 Crypto Roulette. All rights reserved.</p>
      </footer>
    </div>
  );
}
