  "use client";

  import { Sky } from "@react-three/drei";
  import { Canvas } from "@react-three/fiber";
  import { Physics } from "@react-three/cannon";
  import { Ground } from "@/components/Ground";
  import { Player } from "@/components/Player";
  import { useEffect, useState } from "react";
  import { socket } from "@/socket";
  import { Text } from "@react-three/drei";
  import { NUM_PLAYERS } from "@/constants";
  import { Table } from "@/components/Table";

  export default function Home() {
    const PLAYER_COUNT = 8;
    const TABLE_RADIUS = 8;
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [roomConnected, setRoomConnected] = useState(false);
    const [userId, setUserId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [messages, setMessages] = useState([] as any);
    const [gameStarted, setGameStarted] = useState(false);
    const [roomData, setRoomData] = useState({} as any);
    const [winners, setWinners] = useState([] as any);
    const [isActive, setIsActive] = useState(true);
    const [numPlayersToEliminate, setNumPlayersToEliminate] = useState();

    useEffect(() => {
      if (socket.connected) {
        onConnect();
      }

      function onConnect() {
        console.log("on connect ran");
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
        console.log(data);
        setGameStarted(true);
        setRoomData(data);
      };

      const turnProcessed = (data: any) => {
        console.log(data);
        setRoomData(data);
      };

      const numDecided = (data: any) => {
        console.log(data);
        setNumPlayersToEliminate(data);
      };

      const playerJoined = (data: any) => {
        console.log(data);
        setRoomData(data);
      };

      socket.on("start_game", startGame);
      socket.on("turn_processed", turnProcessed);
      socket.on("num_decided", numDecided);
      socket.on("player_joined", playerJoined);

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

    console.log("here is room data ", roomData);
    console.log("my index is", roomData.playersArray?.indexOf(userId));

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
              <div className="absolute left-4 top-2">
                waiting for {NUM_PLAYERS - roomData.playersArray.length} more
                player{NUM_PLAYERS - roomData.playersArray.length < 2 ? "" : "s"}{" "}
                to join
              </div>
            )}

            <Canvas className="border-2">
              <ambientLight intensity={1} />
              <Physics>
                {playerPositions.map((position, index) => (
                  <Player
                    key={roomData.playersArray[index]}
                    userId={roomData.playersArray[index]} // Use player ID as key instead of index
                    position={position}
                    whoseTurn={roomData.whoseTurn}
                    isMe={userId === roomData.playersArray[index]}
                  />
                ))} 
                <Ground />
                <Table radius={TABLE_RADIUS-1 } />

              </Physics>
            </Canvas>
            <div className="flex items-center justify-center absolute top-[46%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              <span>.</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="h-screen justify-center flex flex-col gap-2 text-white">
              <p>Status: {isConnected ? "connected" : "disconnected"}</p>
              <p>Transport: {transport}</p>
              <input
                type="text"
                className="text-black"
                value={userId}
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
                  if (userId && roomId) {
                    setRoomConnected(true);
                    console.log("yep");
                    socket.emit("join_room", { userId, roomId });
                  }
                }}
              >
                Join
              </button>
            </div>
          </div>
        )}
        {roomData.gameStatus==="started"?roomData!.whoseTurn !== userId ? 
        (<div className="absolute right-5  top-3">{roomData.whoseTurn} is choosing</div>)
        :"":""} 
        {roomData!.whoseTurn === userId && (
              <div className="flex flex-col gap-4">
                <button
                  className="px-3 py-2 bg-red-500"
                  onClick={detonateClicked}
                >
                  Detonate
                </button>
                <button className="px-3 py-2 bg-blue-500" onClick={passClicked}>
                  Pass
                </button>
              </div>
            )}
      </main>
    );
  }
