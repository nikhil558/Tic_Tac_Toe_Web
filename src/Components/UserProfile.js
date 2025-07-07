import { useSelector } from "react-redux";

const UserProfile = ({ firstName, lastName, profileUrl }) => {
  const user = useSelector((store) => store.user);
  return (
    <div className="card bg-base-300 w-full md:w-96 shadow-sm">
      {!profileUrl ? (
        <div className="skeleton w-full h-32 flex justify-center items-center ">
          <h1 className="font-bold text-9xl ">{firstName[0]}</h1>
        </div>
      ) : (
        <figure>
          <img
            src={profileUrl}
            className="h-72 object-cover w-full"
            alt="Profile pic"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title"> {firstName + " " + lastName}</h2>
        <p>{user?.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
