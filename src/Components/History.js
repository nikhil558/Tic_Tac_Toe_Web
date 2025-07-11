import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../Utils/Constants";
import { useSelector } from "react-redux";
import GameHistory from "./GameHistory";

export default function History() {
  const [history, setHistory] = useState(null);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/history/view`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setHistory(response.data.response);
      } else {
        console.error("Failed to fetch game history");
      }
    } catch (error) {
      console.error("Error fetching game history:", error);
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-4">Game History</h1>

      {(!history || history.length === 0) && (
        <div className="flex justify-center items-center h-64 text-gray-500">
          {!history ? (
            <span className="loading loading-dots loading-xl"></span>
          ) : (
            "Your game history will appear here."
          )}
        </div>
      )}

      {history && history.length !== 0 && (
        <div className="h-80 overflow-y-auto no-scrollbar space-y-4">
          {history.map((game, idx) => {
            const youWin = !game.isDraw && game.result._id === user._id;
            // const youLose = !game.isDraw && game.result._id !== user._id;

            /* choose top or bottom tooltip: first 2 rows → bottom, others → top */
            const tooltipPos = idx < 2 ? "dropdown-bottom" : "dropdown-top";

            /* row colour classes */
            const rowColor = game.isDraw
              ? "justify-center bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-300"
              : youWin
              ? "justify-start bg-gradient-to-r from-success to-green-300 hover:from-green-600 hover:to-green-400"
              : "justify-end bg-gradient-to-l from-error to-red-300 hover:from-red-600 hover:to-red-400";

            return (
              <div
                key={game._id}
                className={`dropdown dropdown-hover w-full ${tooltipPos}`}
              >
                {/* trigger / card */}
                <div
                  tabIndex={0}
                  className={`relative flex ${rowColor}
                    text-white font-semibold shadow-md rounded-lg
                    p-4 transform transition duration-200
                    scale-95 hover:scale-100 cursor-pointer`}
                >
                  {game.isDraw ? "Draw" : youWin ? "You Win" : "You Lose"}
                </div>

                {/* tooltip content */}
                <div
                  tabIndex={0}
                  className="dropdown-content bg-base-100 text-black border border-gray-300 rounded-lg shadow-lg p-4 w-full my-2"
                >
                  <GameHistory game={game} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Refresh History
        </button>
      </div>
    </div>
  );
}
