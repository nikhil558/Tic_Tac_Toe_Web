import { Users } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addGameInfo } from "../Redux/gameSlice";

const PlayersInfo = ({ roomName, startGame }) => {
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const dispatch = useDispatch();

  const handleStartGame = () => {
    startGame();
    dispatch(addGameInfo({ players: [player1, player2], isOnline: false }));
  };

  return (
    <dialog id={roomName} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-start">Player 1</legend>
          <input
            type="text"
            className="input"
            placeholder="Player name"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-start">Player 2</legend>
          <input
            type="text"
            className="input"
            placeholder="Player Name"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
        </fieldset>
        <button
          onClick={handleStartGame}
          className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 mt-2 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          <Users className="w-5 h-5 mr-2 mt-0.5" />
          Play
        </button>
        <div className="flex justify-between"></div>
      </div>
    </dialog>
  );
};

export default PlayersInfo;
