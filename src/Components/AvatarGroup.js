const AvatarGroup = ({ players = [] }) => {
  return (
    <div className="avatar-group -space-x-6 flex justify-center my-4">
      {players.map((each, index) => {
        if (!each) return null;
        return each.profilePicture ? (
          <div className="avatar" key={index}>
            <div className="w-12">
              <img src={each.profilePicture} alt="profile" />
            </div>
          </div>
        ) : (
          <div className="avatar avatar-placeholder" key={index}>
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span>{each.firstName?.[0] || "?"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AvatarGroup;
