import { Trophy, Users } from "lucide-react";
import Room from "./Room";
import connectSocketClient from "../Utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import PlayersInfo from "./PlayersInfo";
import { addGameInfo } from "../Redux/gameSlice";

const StartGame = ({ startGame = () => {} }) => {
  const [roomId, setRoomId] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [players, setPlayers] = useState([]);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleCreateRoom = () => {
    document.getElementById("create_room").showModal();
    const socket = connectSocketClient();
    socket.emit("createRoom", user, ({ roomCode }) => {
      console.log("Room created:", roomCode);
      setRoomId(roomCode);
      setPlayers([user]);
      setWaiting(true);
    });

    socket.on("playerJoined", (player) => {
      setPlayers((prevPlayers) =>
        prevPlayers.some((p) => p._id === player._id)
          ? prevPlayers
          : [...prevPlayers, player]
      );
      setWaiting(false);
    });

    socket.on("startGame", (players, { roomCode }) => {
      // Logic to open game board for both host and guest
      dispatch(
        addGameInfo({ players: players, isOnline: true, roomId: roomCode })
      );
      startGame();
      console.log("Game starting...");
    });
  };

  const handleStartGame = () => {
    connectSocketClient().emit("hostStartGame", roomId);
  };

  return (
    <>
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Ready to Play?</h2>
          <p className="text-gray-600">
            Players take turns placing X's and O's. Get three in a row to win!
          </p>
        </div>
        <button
          onClick={() => document.getElementById("offline_play").showModal()}
          className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          <Users className="w-5 h-5 mr-2 mt-0.5" />
          Start Game
        </button>
        <PlayersInfo roomName={"offline_play"} startGame={startGame} />
        <div className="flex justify-between">
          <div>
            <button
              className="btn btn-neutral btn-outline"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
            <Room
              roomName={"create_room"}
              roomId={roomId}
              waiting={waiting}
              players={players}
              setPlayers={setPlayers}
              setWaiting={setWaiting}
              handleStartGame={handleStartGame}
            />
          </div>
          <div>
            <button
              className="btn btn-neutral btn-dash"
              onClick={() => document.getElementById("join_room").showModal()}
            >
              Join Room
            </button>
            <Room
              roomName={"join_room"}
              roomId={roomId}
              waiting={waiting}
              players={players}
              setPlayers={(value) => setPlayers(value)}
              setWaiting={(value) => setWaiting(value)}
              startGame={startGame}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StartGame;
