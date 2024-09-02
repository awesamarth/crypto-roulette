import dotenv from "dotenv";
dotenv.config();
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import {
  NUM_PLAYERS,
  NUM_DETONATE_ALLERS,
  ENTRY_FEE,
  ENTRY_FEE_WITH_ZEROS,
} from "./src/constants/index.js";
import {
  Account,
  AccountAddress,
  Aptos,
  APTOS_COIN,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  NetworkToNetworkName,
  StructTag,
  TypeTagSigner,
  TypeTagStruct,
} from "@aptos-labs/ts-sdk";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY);

const account = Account.fromPrivateKey({ privateKey });

const config = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: "https://aptos.testnet.suzuka.movementlabs.xyz/v1",
  faucet: "https://faucet.testnet.suzuka.movementlabs.xyz",
  indexer: "https://indexer.testnet.suzuka.movementlabs.xyz/v1/graphql",
});

const aptos = new Aptos(config);

const TOTAL_POOL = BigInt((95/100)*NUM_PLAYERS * ENTRY_FEE_WITH_ZEROS);

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  const roomData = new Object();

  io.on("connection", (socket) => {
    console.log("a new person joined");

    function randomElementsGetter(array) {
      let randomElements = [];
      let tempArray = [...array];
      for (let i = 0; i < NUM_DETONATE_ALLERS; i++) {
        let randomIndex = Math.floor(Math.random() * tempArray.length);
        randomElements.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
      }

      return randomElements;
    }

    async function tokenDistributor(winnersArray) {
      const recipients = winnersArray;
      const transactions = [];
      const tokensToEach = TOTAL_POOL / BigInt(recipients.length);

      console.log("tokens to each are:");

      console.log("tokens should be given to: ");
      console.log(recipients);

      for (let i = 0; i < recipients.length; i += 1) {
        const transaction = {
          function: "0x1::aptos_account::transfer",
          functionArguments: [recipients[i], tokensToEach],
        };
        transactions.push(transaction);
      }

      console.log("transactions array: ");
      console.log(transactions);

      const result = await aptos.transaction.batch.forSingleAccount({
        sender: account,
        data: transactions,
      });
      console.log(result);
    }

    function isDetonateAller(player, roomId) {
      return roomData[roomId].detonateAllerArray.includes(player);
    }

    //when all players pass and so x/n players get randoomly detonated.
    function detonateRandomPlayers(roomId) {
      //choose a random number between 0 and NUM_PLAYERS

      const numPlayersToEliminate = Math.floor(Math.random() * NUM_PLAYERS) + 1;
      console.log(numPlayersToEliminate, " will be eliminated");

      setTimeout(() => {
        io.in(roomId).emit("num_decided", numPlayersToEliminate);
      }, 2000);
      const tempActivePlayersArray = [...roomData[roomId].activePlayersArray];
      for (let i = 0; i < numPlayersToEliminate; i++) {
        let randomIndex = Math.floor(
          Math.random() * tempActivePlayersArray.length
        );

        tempActivePlayersArray.splice(randomIndex, 1);
      }
      roomData[roomId].activePlayersArray = tempActivePlayersArray;

      setTimeout(() => {
        roomData[roomId].gameStatus = "ended";
        roomData[roomId].whoseTurn = "";
        tokenDistributor(roomData[roomId].activePlayersArray);
        io.in(roomId).emit("turn_processed", roomData[roomId]);
      }, 5500);
    }

    socket.on("join_room", ({ userId, roomId }) => {
      console.log(userId, " joined");
      let clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size || 0;
      if (clientsInRoom === NUM_PLAYERS) {
        return;
      }

      socket.join(roomId);
      socket.roomId = roomId;
      let roomDetails = roomData[roomId];
      if (!roomDetails) {
        roomDetails = {
          gameStatus: "waiting",
          playersArray: [],
          detonateAllerArray: [],
          activePlayersArray: [],
          winnersArray: [],
        };
      }

      roomDetails.playersArray.push(userId);

      roomData[roomId] = roomDetails;
      // console.log(roomData);
      io.in(roomId).emit("player_joined", roomData[roomId]);

      clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size || 0;
      if (clientsInRoom == NUM_PLAYERS) {
        roomData[roomId].detonateAllerArray = randomElementsGetter(
          roomData[roomId].playersArray
        );
        roomData[roomId].activePlayersArray = roomDetails.playersArray;
        roomData[roomId].whoseTurn = roomData[roomId].activePlayersArray[0];
        roomData[roomId].gameStatus = "started";

        io.in(roomId).emit("start_game", roomData[roomId]);
      }
    });

    socket.on("turn_played", ({ choice, userId, roomId }) => {
      if (choice === "detonate") {
        io.in(roomId).emit("turn_init", {
          prevPlayer: roomData[roomId].whoseTurn,
          decision: "detonate",
        });

        if (isDetonateAller(userId, roomId)) {
          console.log("detonate all others");
          setTimeout(() => {
            io.in(roomId).emit("turn_consequence", {
              prevPlayer: roomData[roomId].whoseTurn,
              consequence: "everyone else",
            });
            roomData[roomId].activePlayersArray = [userId];
            roomData[roomId].gameStatus = "ended";
            tokenDistributor([userId]);
            roomData[roomId].whoseTurn = "";
          }, 2000);

          setTimeout(() => {
            io.in(roomId).emit("turn_processed", roomData[roomId]);
          }, 5000);
        } else {
          console.log("self detonate pushed");

          setTimeout(() => {
            io.in(roomId).emit("turn_consequence", {
              prevPlayer: roomData[roomId].whoseTurn,
              consequence: "themself",
            });
            roomData[roomId].activePlayersArray = roomData[
              roomId
            ].activePlayersArray.filter((player) => player != userId);
            tokenDistributor(roomData[roomId].activePlayersArray);
            roomData[roomId].gameStatus = "ended";
            roomData[roomId].whoseTurn = "";
          }, 2000);

          //ending the game at this point.
          //could add a voting mechanism for continuing till the end of the array of active players
          setTimeout(() => {
            io.in(roomId).emit("turn_processed", roomData[roomId]);
          }, 5000);
        }
      } else {
        console.log("pass button pressed");
        io.in(roomId).emit("turn_init", {
          prevPlayer: roomData[roomId].whoseTurn,
          decision: "pass",
        });
        let userIndex = roomData[roomId].activePlayersArray.indexOf(userId);
        if (userIndex >= roomData[roomId].activePlayersArray.length - 1) {
          setTimeout(() => {
            roomData[roomId].gameStatus = "randomly_detonating";

            io.in(roomId).emit("turn_processed", roomData[roomId]);
            io.in(roomId).emit(
              "randomly_detonating_broadcast",
              roomData[roomId]
            );

            detonateRandomPlayers(roomId);
          }, 3000);
        } else {
          roomData[roomId].whoseTurn =
            roomData[roomId].activePlayersArray[userIndex + 1];
          setTimeout(() => {
            io.in(roomId).emit("turn_processed", roomData[roomId]);
          }, 3000);
        }
      }
    });

    socket.on("send_message", (data) => {
      socket.to(data.roomId).emit("receive_message", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("someone disconnected");
      const clientsInRoom =
        io.sockets.adapter.rooms.get(socket.roomId)?.size || 0;
      if (clientsInRoom === 0) {
        console.log("all players have left the room");
        delete roomData[socket.roomId];
      }
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
