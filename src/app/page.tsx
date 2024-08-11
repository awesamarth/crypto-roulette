import { Game } from "@/components/Game";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const NUM_PLAYERS = 3;
  const NUM_DETONATORS = Math.floor(NUM_PLAYERS / 2);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-4xl">Standard Mode</div>
      <div className="text-2xl">Rules </div>
      <div className="text-xl">
        <span>
          There are {NUM_PLAYERS} players in each game and each is provided with
          a detonator
        </span>
          {" "}
          Out of these, {NUM_DETONATORS}{" "}
          {NUM_DETONATORS > 1
            ? `random players have special detonators which detonate everyone except themselves`
            : "random player has a special detonator which detonates everyone except themself "}
          {" "}
          The other players have detonators that detonate only themselves. No one knows which type of detonator they have 
        <span> You have two choices: detonate or skip</span>
          {" "}
          If no one detonates their button, a random number of players are
          eliminated.{" "}
          The ones remaining at the end of each game distribute the wealth.{" "}
        <span>Do you have what it takes to survive?</span>
      </div>
      
      <Link href="play"><button className="bg-blue-500 px-3 py-2 rounded-md">Start</button></Link>
    </main>
  );
}
