import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import axios from "../../axios";
import RecordRow from "./RecordRow";
import { records as DUMMY_RECORDS } from "../../constants/records";

const RecordsTable = ({ allowActions = false }) => {
  const authCtx = useContext(AuthContext);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!authCtx.isLoggedIn) return;

    axios
      .get("/subdomain", {
        headers: {
          Authorization: `Bearer ${authCtx.user.token}`,
        },
      })
      .then((res) => {
        setRecords(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [authCtx.user.token]);

  if (records.length === 0)
    return (
      <div className="w-full mt-8 text-center">
        <span className="text-sm font-medium text-gray-400">
          Buy your first servatom subdomain today!
        </span>
      </div>
    );
  return (
    <div className="w-[90%] mt-8 mx-auto">
      <table className="w-full">
        <thead className="">
          <tr className="text-md font-medium text-gray-400 border-b border-gray-300">
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Content</th>
            <th className="text-left p-2">Plan</th>
            <th className="text-left w-fit p-2">Expiry</th>
            {allowActions && <th className="text-center p-2 w-20"></th>}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <RecordRow
              record={record}
              allowActions={allowActions}
              key={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;
