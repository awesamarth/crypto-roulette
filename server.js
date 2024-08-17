import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { NUM_PLAYERS, NUM_DETONATE_ALLERS } from "./src/constants/index.js"

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  const roomData = new Object();

  io.on("connection", (socket) => {
    console.log("a new person joined");

    console.log("Socket ID:", socket.id);

    function randomElementsGetter(array) {
      let randomElements = [];
      let tempArray = [...array];
      for (let i = 0; i < NUM_DETONATE_ALLERS; i++) {
        let randomIndex = Math.floor(Math.random() * tempArray.length);
        randomElements.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
      }

      console.log(randomElements);
      console.log("all elements at this point are:", array);
      return randomElements;
    }

    function isDetonateAller(player, roomId) {
      console.log(roomData[roomId].detonateAllerArray);
      return roomData[roomId].detonateAllerArray.includes(player);
    }

    //when all players pass and so x/n players get randoomly detonated.
    function detonateRandomPlayers(roomId) {
      //choose a random number between 0 and NUM_PLAYERS
      const numPlayersToEliminate = Math.floor(Math.random() * NUM_PLAYERS) + 1;
      console.log(numPlayersToEliminate, " will be eliminated");
      io.in(roomId).emit("num_decided", numPlayersToEliminate);
      for (let i = 0; i < numPlayersToEliminate; i++) {
        let randomIndex = Math.floor(
          Math.random() * roomData[roomId].activePlayersArray.length
        );
        roomData[roomId].activePlayersArray.splice(randomIndex, 1);
      }
      //add a 5 second timer here
      //set time out for 5 seconds
      setTimeout(() => {
        roomData[roomId].gameStatus = "ended";
        io.in(roomId).emit("turn_processed", roomData[roomId]);
      }, 3000);
    }

    socket.on("join_room", ({ userId, roomId }) => {
      socket.join(roomId);
      let roomDetails = roomData[roomId];
      if (!roomDetails) {
        roomDetails = {
          gameStatus: "started",
          playersArray: [],
          detonateAllerArray: [],
          activePlayersArray: [],
          winnersArray: [],
        };
      }

      roomDetails.playersArray.push(userId);


      roomData[roomId] = roomDetails;
      console.log(roomData);
      io.in(roomId).emit("player_joined", roomData[roomId]);


      const clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size || 0;
      console.log(`Number of clients in room ${roomId}: ${clientsInRoom}`);
      if (clientsInRoom == NUM_PLAYERS) {
        console.log("here's playersArray ", roomData[roomId].playersArray);
        roomData[roomId].detonateAllerArray = randomElementsGetter(
          roomData[roomId].playersArray
        );
        roomData[roomId].activePlayersArray = roomDetails.playersArray;
        roomData[roomId].whoseTurn = roomData[roomId].activePlayersArray[0];

        console.log("people joined");
        console.log(roomData[roomId]);
        io.in(roomId).emit("start_game", roomData[roomId]);
      }
    });

    socket.on("turn_played", ({ choice, userId, roomId }) => {
      if (choice === "detonate") {
        if (isDetonateAller(userId, roomId)) {
          console.log("detonate all others");
          roomData[roomId].activePlayersArray = [userId];
          roomData[roomId].gameStatus = "ended";

          io.in(roomId).emit("turn_processed", roomData[roomId]);
        } else {
          console.log("self detonate pushed");
          //last player in the array
          roomData[roomId].activePlayersArray = roomData[
            roomId
          ].activePlayersArray.filter((player) => player != userId);
          roomData[roomId].gameStatus = "ended";

          //ending the game at this point.
          //could add a voting mechanism for continuing till the end of the array of active players

          io.in(roomId).emit("turn_processed", roomData[roomId]);
        }
      } else {
        console.log("pass button pressed");
        let userIndex = roomData[roomId].activePlayersArray.indexOf(userId);
        if (userIndex >= roomData[roomId].activePlayersArray.length - 1) {
          console.log(roomData[roomId].activePlayersArray);
          console.log(userIndex);
          console.log("chuda");
          roomData[roomId].gameStatus = "randomly_detonating";
          io.in(roomId).emit("turn_processed", roomData[roomId]);
          detonateRandomPlayers(roomId);
        } else {
          console.log("going here");
          console.log(userIndex);
          console.log(roomData[roomId].activePlayersArray);
          roomData[roomId].whoseTurn =
            roomData[roomId].activePlayersArray[userIndex + 1];
          io.in(roomId).emit("turn_processed", roomData[roomId]);
        }
      }
    });

    socket.on("send_message", (data) => {
      console.log(data);
      socket.to(data.roomId).emit("receive_message", data);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
