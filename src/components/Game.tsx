"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";

export const Game = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [roomConnected, setRoomConnected] = useState(false);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([] as any);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomData, setRoomData] = useState({} as any);
  const [winners, setWinners] = useState([] as any);
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

    socket.on("start_game", startGame);
    socket.on("turn_processed", turnProcessed);
    socket.on("num_decided", numDecided);

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

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>

      {roomConnected ? (
        roomData.gameStatus == "started" ? (
          roomData!.whoseTurn === userId ? (
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
          ) : (
            <div>{roomData.whoseTurn} is choosing</div>
          )
        ) : roomData.gameStatus == "randomly_detonating" ? (
          <div>
            Since none of you are brave enough to detonate, I will do it for
            some of you. {numPlayersToEliminate &&`${numPlayersToEliminate} player${numPlayersToEliminate>1?"s":""} will be randomly detonated. Start praying.`}
          </div>
        ) : roomData.gameStatus=="ended"? (
          <div>
            <h1>Game Ended</h1>
            {roomData.activePlayersArray.length>0?
            <div>
              <h2>Winners</h2>
            {roomData.activePlayersArray.map((winner: any) => (
              <div key={winner}>{winner}</div>
            ))}
            </div>:"Everyone was detonated. Should have been more brave."}
            
          </div>
        ):"waiting for players to join"
      ) : (
        <div className="flex flex-col gap-2 text-black">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="user id"
          />
          <input
            type="text"
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
      )}
    </div>
  );
};
