import { useContext, useState } from "react";
import { auth } from "../firebase.config";
import { Redirect, useHistory } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import RecordsTable from "../components/Plan/RecordsTable";
import { records as dummyData } from "../constants/records";
import AuthContext from "../store/auth-context";

const Profile = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [records, setRecords] = useState(dummyData);

  if (!authCtx.isLoggedIn) return <Redirect to="/login" />;

  return (
    <div className="flex flex-col items-center p-4 text-gray-300 pt-32">
      <div className="flex flex-col items-center gap-8">
        <FaUserCircle size={100} />
        <div className="flex flex-row items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">{authCtx.user.phoneNumber}</h1>
          <span>|</span>
          <span
            className="cursor-pointer hover:underline underline-offset-4"
            onClick={() => {
              history.push("/logout");
            }}
          >
            Log Out
          </span>
        </div>
      </div>
      <div className="mt-20 w-full">
        <h1 className="text-xl font-medium text-center">Your Records</h1>
        <RecordsTable records={records} allowActions={true} />
      </div>
    </div>
  );
};

export default Profile;
