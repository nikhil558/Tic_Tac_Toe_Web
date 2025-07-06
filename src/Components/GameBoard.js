import { useState, useEffect } from "react";
import { LogOut, RotateCcw, Trophy, Users } from "lucide-react";
import StartGame from "./StartGame";
import PlayArea from "./PlayArea";
import { useOutletContext } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import connectSocketClient from "../Utils/socket";
import { resetGameInfo } from "../Redux/gameSlice";
import axios from "axios";
import { BACKEND_URL } from "../Utils/Constants";

const GameBoard = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { setToast } = useOutletContext();
  const game = useSelector((store) => store.game);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = connectSocketClient();
    const handleMove = ({ index, player }) => {
      setBoard((prevBoard) => {
        const updated = [...prevBoard];
        updated[index] = player;
        return updated;
      });
      setCurrentPlayer(player === "X" ? "O" : "X");
    };

    socket.on("moveMade", handleMove);

    socket.on("playerLeft", () => {
      // setTimeout(() => {
      //   window.alert(`${leftUser.firstName} has left the game.`);
      // }, 0);
      gameStarted && document.getElementById("user_left").showModal();
      addResultToHistory();
    });

    socket.on("playerReset", () => {
      // open the modal FOR THE OPPONENT only
      document.getElementById("reset_game").showModal();
    });

    socket.on("resetReject", () => {
      setToast({
        title: "Game Reset Rejected",
        description: "Your opponent rejected the reset request.",
        type: "error",
      });
      setTimeout(() => {
        setToast(null);
        resetGame();
        dispatch(resetGameInfo());
        setGameStarted(false);
      }, 2000);
    });

    socket.on("resetAccept", () => {
      resetGame();
    });

    return () => {
      socket.off("moveMade", handleMove);
      socket.off("playerLeft");
      socket.off("playerReset");
    };
  }, [dispatch, gameStarted, game.isOnline]);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  const checkWinner = (board) => {
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const checkDraw = (board) => {
    return board.every((cell) => cell !== null) && !checkWinner(board);
  };

  const toastMessage = (
    gameWinner,
    successMessage,
    failureMessage,
    offlineSuccessMessage = null,
    offlineFailureMessage = null
  ) => {
    return gameWinner === "X"
      ? game.isOnline
        ? game.players[0]._id === user._id
          ? successMessage
          : failureMessage
        : offlineSuccessMessage || successMessage
      : gameWinner === "O"
      ? game.isOnline
        ? game.players[1]._id === user._id
          ? successMessage
          : failureMessage
        : offlineFailureMessage || successMessage
      : "";
  };

  useEffect(() => {
    const gameWinner = checkWinner(board);
    const gameDraw = checkDraw(board);

    if (gameWinner) {
      setWinner(gameWinner);
      setToast({
        title: toastMessage(
          gameWinner,
          `${user.firstName}, You Won!`,
          "You Lost!",
          `${game.players[0]} Won!`,
          `${game.players[1]} Won!`
        ),
        description: toastMessage(
          gameWinner,
          "🎉 Congratulations on your victory!",
          "Better luck next time!"
        ),
        type: toastMessage(gameWinner, "success", "error"),
      });
      setTimeout(() => setToast(null), 3000);
      if (game.isOnline) {
        const winner =
          gameWinner === "X" ? game.players[0]._id : game.players[1]._id;
        if (user._id === winner) {
          addResultToHistory();
        }
      }
    } else if (gameDraw) {
      setIsDraw(true);
      setToast({
        title: "It's a Draw!",
        description: "Great game! Try again?",
        type: "warning",
      });
      setTimeout(() => setToast(null), 3000);
    }
  }, [board]);

  const handleCellClick = (index) => {
    if (board[index] || winner || isDraw || !gameStarted) return;
    if (game.isOnline) {
      // Emit the move to the server if online
      const socket = connectSocketClient();
      socket.emit("makeMove", game.roomId, { index, currentPlayer });
    } else {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const handleLeft = () => {
    if (game.isOnline) {
      const socket = connectSocketClient();
      socket.emit("leaveRoom");
    } // tell server first
    resetGame();
    dispatch(resetGameInfo());
    setGameStarted(false);
  };

  const resetGameClick = () => {
    if (game.isOnline) {
      // tell server first – opponent will get playerReset
      const sock = connectSocketClient();
      sock.emit("resetGame", game.roomId);
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
    setToast(null);
  };

  const startGame = () => {
    setGameStarted(true);
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
  };

  const addResultToHistory = async () => {
    try {
      const gameResult = {
        userId: game.players[0]._id,
        targetUserId: game.players[1]._id,
        result: user._id,
        isDraw: isDraw,
      };
      const addResult = await axios.post(
        BACKEND_URL + "/history/add",
        gameResult,
        {
          withCredentials: true,
        }
      );
      if (addResult.data.success) {
        console.log("Game result added to history successfully.");
      } else {
        console.error(
          "Failed to add game result to history:",
          addResult.data.message
        );
      }
    } catch (err) {
      console.error("Error adding game result to history:", err);
    }
  };

  return !gameStarted ? (
    <StartGame startGame={startGame} />
  ) : (
    <div className="space-y-6">
      <button
        onClick={handleLeft}
        className="group absolute inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 overflow-hidden text-xs sm:text-sm md:text-base font-medium text-red-600 border border-red-600 rounded-lg hover:text-white hover:bg-red-600 transition-all duration-300"
      >
        <span className="absolute left-0 w-0 h-full bg-red-600 transition-all duration-300 ease-out group-hover:w-full"></span>
        <span className="relative flex items-center space-x-1 sm:space-x-2">
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="hidden sm:inline">Left</span>
        </span>
      </button>
      <div className="text-center">
        {winner ? (
          <div className="space-y-2">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">
              Player {winner} Wins!
            </h2>
          </div>
        ) : isDraw ? (
          <h2 className="text-2xl font-bold text-gray-800">It's a Draw!</h2>
        ) : (
          <h2 className="text-xl font-semibold text-gray-700 text-end">
            Player{" "}
            <span className="text-2xl font-bold text-blue-600">
              {currentPlayer}
            </span>
            's Turn{" ( "}
            <span>
              {currentPlayer === "X"
                ? game.isOnline
                  ? game.players[0].firstName
                  : game.players[0]
                : game.isOnline
                ? game.players[1].firstName
                : game.players[1]}
            </span>
            {" )"}
          </h2>
        )}
      </div>
      <PlayArea
        board={board}
        onCellClick={handleCellClick}
        winner={winner}
        isDraw={isDraw}
        currentPlayer={currentPlayer}
      />
      <button
        onClick={resetGameClick}
        variant="outline"
        className="w-full flex justify-center font-semibold items-center border-2 py-2 rounded-lg border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
      >
        <RotateCcw className="w-4 h-4 mr-2 mt-0.5" />
        New Game
      </button>
      <dialog id="user_left" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                resetGame();
                dispatch(resetGameInfo());
                setGameStarted(false);
              }}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">You won!</h3>
          <p className="py-4">Opponent left the game</p>
        </div>
      </dialog>
      <dialog id="reset_game" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Game!</h3>
          <p className="py-4">Opponents wants to play new game</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-success"
                onClick={() => {
                  const socket = connectSocketClient();
                  socket.emit("acceptGame", game.roomId);

                  if (!winner) {
                    addResultToHistory();
                  }
                  resetGame();
                }}
              >
                Accept
              </button>
            </form>
            <form
              method="dialog"
              onClick={() => {
                const socket = connectSocketClient();
                socket.emit("rejectGame", game.roomId);
                if (!winner) {
                  addResultToHistory();
                }
                resetGame();
                dispatch(resetGameInfo());
                setGameStarted(false);
              }}
            >
              <button className="btn btn-error">Reject</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default GameBoard;
