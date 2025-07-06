import connectSocketClient from "../Utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AvatarGroup from "./AvatarGroup";
import GradientButton from "./GradientButton";
import { addGameInfo } from "../Redux/gameSlice";

const Room = ({
  roomName = "",
  roomId = "",
  waiting = false,
  players = [],
  setPlayers = () => {},
  setWaiting = () => {},
  handleStartGame = () => {},
  startGame = () => {},
}) => {
  const [userRoomId, setUserRoomId] = useState("");
  const [join, setJoin] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = connectSocketClient();

    socket.on("playerJoined", () => {
      setWaiting(false);
      setError("");
    });

    socket.on("playerLeft", (leftUser) => {
      setWaiting(false);
      setPlayers((prev) =>
        prev.filter((player) => player._id !== leftUser._id)
      );
      setJoin(false);
      setUserRoomId("");
      setError("Your opponent has left the game.");
      console.log("Opponent has left the game.");
    });
  }, []);

  const handleJoinRoom = () => {
    const socket = connectSocketClient();
    socket.emit("joinRoom", userRoomId, user, (res) => {
      if (res.success) {
        setPlayers(res.players);
        setJoin(true);
        setWaiting(true);
        setError("");
      } else {
        setError(res.error);
      }
    });

    connectSocketClient().on("startGame", (players, { roomCode }) => {
      dispatch(
        addGameInfo({ players: players, isOnline: true, roomId: roomCode })
      );
      startGame();
      console.log("Game starting...");
    });
  };

  return (
    <dialog id={roomName} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setWaiting(false);
              setPlayers([]);
              setJoin(false);
              setUserRoomId("");
              setError("");
              connectSocketClient().emit("leaveRoom");
            }}
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg my-4">
          {roomName === "create_room" ? `Room Id: ${roomId}` : "Join Room"}
        </h3>

        <AvatarGroup players={players} />

        {roomName === "join_room" && !join && (
          <input
            type="text"
            placeholder="Enter Code"
            onChange={(e) => setUserRoomId(e.target.value)}
            className="input input-neutral"
          />
        )}

        {roomName === "create_room" && waiting && (
          <p>Waiting for opponent...</p>
        )}
        {roomName === "join_room" && join && (
          <p>Waiting for host to start...</p>
        )}

        {roomName === "create_room" && players?.length === 2 && (
          <GradientButton label="Start Game" onClick={handleStartGame} />
        )}

        {roomName === "join_room" && !join && (
          <GradientButton label="Join" onClick={handleJoinRoom} />
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </dialog>
  );
};

export default Room;
