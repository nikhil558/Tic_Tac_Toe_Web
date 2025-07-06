const avatar = (player) => {
  return !player.profilePicture ? (
    <div className="avatar avatar-placeholder" tabIndex="0">
      <div className="bg-neutral text-neutral-content w-10 rounded-full">
        <span>{player.firstName[0]}</span>
      </div>
    </div>
  ) : (
    <div tabIndex="0" className="btn btn-ghost btn-circle avatar">
      <div className="rounded-full">
        <img alt="Profile Picture" src={player.profilePicture} />
      </div>
    </div>
  );
};

const GameHistory = ({ game }) => (
  <div className="">
    <h3 className="font-bold mb-2 text-center">Game Details</h3>
    <div className="flex justify-between items-center mb-2">
      <div className="flex  flex-col items-center justify-center mb-2">
        {avatar(game.userId)}
        <span className="font-semibold">{game.userId.firstName}</span>
      </div>
      <div className="flex flex-row justify-center items-center mb-2 mt-10">
        {game.isDraw ? (
          <div className="flex items-center">
            {avatar(game.userId)}
            {avatar(game.targetUserId)}
          </div>
        ) : (
          avatar(game.result)
        )}
        <span className="font-semibold ml-2 text-sm">
          {!game.isDraw && game.result.firstName}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center mb-2">
        {avatar(game.targetUserId)}
        <span className="font-semibold">{game.targetUserId.firstName}</span>
      </div>
    </div>
    <p className="text-xs text-gray-500">
      {new Date(game.timestamp).toLocaleString()}
    </p>
  </div>
);

export default GameHistory;
