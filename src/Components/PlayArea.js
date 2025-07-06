import React from "react";
import { useSelector } from "react-redux";

const PlayArea = ({ board, onCellClick, winner, isDraw, currentPlayer }) => {
  const game = useSelector((store) => store.game);
  const user = useSelector((store) => store.user);
  const baseClasses =
    "aspect-square bg-white rounded-lg shadow-md border-2 border-transparent flex items-center justify-center text-4xl font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:border-blue-300 disabled:cursor-not-allowed";
  const hoverClasses = (cell) => {
    return !cell && !winner && !isDraw ? "hover:bg-blue-50" : "";
  };
  const valueClasses = (cell) => {
    return cell === "X" ? "text-blue-600" : cell === "O" ? "text-red-500" : "";
  };

  const isPlayerTurn = () => {
    if (!game.isOnline) return true; // Local mode: always allow
    if (currentPlayer === "X" && game.players[0]?._id === user._id) return true;
    if (currentPlayer === "O" && game.players[1]?._id === user._id) return true;
    return false;
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 rounded-xl">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={!!cell || !!winner || isDraw || !isPlayerTurn()}
          className={`${baseClasses} ${hoverClasses(cell)} ${valueClasses(
            cell
          )} cursor-pointer`}
        >
          {cell && (
            <span className="animate-in zoom-in-50 duration-200">{cell}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default PlayArea;
