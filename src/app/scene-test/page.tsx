"use client";

import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Environment } from "@/components/Environment";
import { Player } from "@/components/Player";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/socket";
import { Text } from "@react-three/drei";
import { NUM_PLAYERS } from "@/constants";
import { Table } from "@/components/Table";
import { useAptosWallet } from "@razorlabs/wallet-kit";
import { abbreviateAddress } from "@/utils";

export default function Home() {
  const PLAYER_COUNT = 8;
  const TABLE_RADIUS = 8;
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [roomConnected, setRoomConnected] = useState(false);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [roomData, setRoomData] = useState({} as any);
  const [winners, setWinners] = useState([] as any);
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState<string | null>();
  const [numPlayersToEliminate, setNumPlayersToEliminate] = useState();

  const remoteRefs = useRef([]); // Reference for the remote
  const wallet = useAptosWallet()

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      // console.log("on connect ran");
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const startGame = (data: any) => {
      console.log("time to start the game");
      // console.log(data);
      setGameStarted(true);
      setRoomData(data);
    };

    const turnProcessed = (data: any) => {
      // console.log(data);
      setMessage(null);
      setRoomData(data);
    };

    const numDecided = (data: any) => {
      setMessage(null);
      setNumPlayersToEliminate(data);
    };

    const playerJoined = (data: any) => {
      // console.log(data);
      setRoomData(data);
    };

    const turnInit = (data: any) => {
      console.log("turn init data ", data);
      setMessage(data);
    };

    socket.on("start_game", startGame);
    socket.on("turn_processed", turnProcessed);
    socket.on("num_decided", numDecided);
    socket.on("player_joined", playerJoined);
    socket.on("turn_init", turnInit);

    return () => {
      socket.off("start_game", startGame);
      socket.off("turn_processed", turnProcessed);
    };
  }, []);

  const detonateClicked = async () => {
    console.log("detonate button pushed");
    socket.emit("turn_played", { choice: "detonate", userId, roomId });
  };

  const passClicked = async () => {
    console.log("pass button pushed");
    socket.emit("turn_played", { choice: "pass", userId, roomId });
  };


  const playerPositions = Array.from(
    { length: roomData.playersArray?.length },
    (_, i) => {
      const angle = (i / roomData.playersArray?.length) * Math.PI * 2;
      return [
        TABLE_RADIUS * Math.cos(angle),
        1,
        TABLE_RADIUS * Math.sin(angle),
      ];
    }
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {roomConnected ? (
        <div className="h-screen w-full">
          {roomData.gameStatus === "waiting" && (
            <div className="absolute z-20 left-4 top-2">
              waiting for {NUM_PLAYERS - roomData.playersArray.length} more
              player{NUM_PLAYERS - roomData.playersArray.length < 2 ? "" : "s"}{" "}
              to join
            </div>
          )}

          <Canvas className="border-2">
            <ambientLight intensity={2} />
            <Physics>
              {playerPositions.map((position, index) => {
                const playerId = roomData.playersArray[index];
                console.log("ye dekh, ", index, position)
                return (
                  <Player
                  key={playerId}
                  userId={playerId}
                  position={playerPositions[index]}
                  whoseTurn={roomData.whoseTurn}
                  isMe={userId === playerId}
                  remoteRef={remoteRefs.current[playerId]}
                  playerCount={roomData.playersArray.length}
                  playerIndex={index}
                />
                );
              })}
              <Environment />
              <Table
                radius={TABLE_RADIUS - 1}
                playerCount={roomData.playersArray?.length || 0}
                onDetonate={detonateClicked}
                onPass={passClicked}
                whoseTurn={roomData.whoseTurn}
                playersArray={roomData.playersArray || []}
              />
            </Physics>
          </Canvas>
          {numPlayersToEliminate&&roomData.gameStatus !== "ended" ? (
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex border-2 justify-center items-center ">
              <div className="flex text-center">Since none of you are brave enough to detonate, I will do it for
              some of you. {numPlayersToEliminate &&`${numPlayersToEliminate} player${numPlayersToEliminate>1?"s":""} will be randomly detonated. Start praying.`}</div>
            </div>
          ) : message ? (
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex border-2 justify-center items-center ">
              <div>{`${roomData.whoseTurn} has chosen to ${message}!`}</div>
            </div>
          ) : (
            roomData.gameStatus !== "ended" && (
              <div className="flex items-center justify-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <span>.</span>
              </div>
            )
          )}
        </div>
      ) : (
        <div>
          <div className="h-screen justify-center flex flex-col gap-2 text-white">
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
            <input
              type="text"
              className="text-gray-300"
              value={abbreviateAddress(wallet?.address?wallet.address:"")}
              disabled
              onChange={(e) => setUserId(e.target.value)}
              placeholder="user id"
            />
            <input
              type="text"
              className="text-black"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="room id"
            />
            <button
              className="px-3 py-2 bg-blue-500"
              onClick={() => {
                if (wallet.address && roomId) {
                  setRoomConnected(true);
                  // console.log("yep");
                  socket.emit("join_room", { userId, roomId });
                }
              }}
            >
              Join
            </button>
          </div>
        </div>
      )}
      {roomData.gameStatus === "started" ? (
        roomData!.whoseTurn !== userId ? (
          <div className="absolute right-5  top-3">
            {roomData.whoseTurn} is choosing
          </div>
        ) : (
          ""
        )
      ) : (
        ""
      )}

      {roomData.gameStatus === "ended" ? (
        <div className="absolute bg-teal-800 px-10 py-3 rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center">
          <h1 className="text-4xl">Game Ended</h1>
          {roomData.activePlayersArray.length > 0 ? (
            <div className="flex flex-col justify-center  items-center">
              <h2 className="text-3xl mt-4 mb-3">Winners</h2>
              <div className="flex justify-center items-center flex-col gap-1">
              {roomData.activePlayersArray.map((winner: any) => (
                <div key={winner}>{winner}</div>
              ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              Everyone was detonated. Should have been more brave.
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </main>
  );
}
