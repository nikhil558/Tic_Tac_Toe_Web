import { useState } from "react";
import UserProfile from "./UserProfile";
import axios from "axios";
import { BACKEND_URL } from "../Utils/Constants";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/userSlice";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();

  const handleUpdate = async () => {
    setError("");
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("profilePicture", profileFile); // image file
      console.log(formData);

      const res = await axios.put(`${BACKEND_URL}/profile/update`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(addUser(res.data.response));

      setToast("success");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Profile update failed.");
      setToast("fail");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileFile(file);
    setProfilePreviewUrl(URL.createObjectURL(file)); // For showing preview
  };

  return (
    <>
      <div className="flex justify-center my-5">
        <div className="card card-dash bg-base-300 w-96 mx-2">
          <div className="card-body">
            <h2 className="card-title">Profile</h2>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  className="input"
                  value={firstName}
                  placeholder="Type here"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="input"
                  value={lastName}
                  placeholder="Type here"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Photo URL:</legend>
                <input
                  type="file"
                  className="file-input file-input-xs"
                  onChange={handleFileChange}
                />
              </fieldset>
            </div>
            <p className="text-red-500">{error}</p>
            <div className="card-actions justify-center">
              <button className="btn btn-primary" onClick={handleUpdate}>
                Save Update
              </button>
            </div>
          </div>
        </div>
        <UserProfile
          firstName={firstName}
          lastName={lastName}
          profileUrl={profilePreviewUrl}
        />
      </div>
      {toast && (
        <div className="toast toast-top toast-center">
          {toast === "fail" ? (
            <div className="alert alert-error">
              <span>Profile Update Failed</span>
            </div>
          ) : (
            <div className="alert alert-success">
              <span>Profile Updated Successfully.</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default Profile;
