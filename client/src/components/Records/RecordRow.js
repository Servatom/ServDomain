const { useState } = require("react");

const RecordRow = ({ record, allowActions, key }) => {
  const [edit, setEdit] = useState(false);

  const recordActions = () => {
    return (
      <td className="w-max">
        {
          // check if expiry date is in the past
          new Date(record.expiry) < new Date() ? (
            <button
              className={
                "p-2 bg-yellow-400 bg-opacity-80 font-semibold text-gray-900 rounded-sm my-2 w-full"
              }
            >
              <span className="text-base">Renew</span>
            </button>
          ) : edit ? (
            <button
              className={
                "p-2 bg-indigo-600 hover:bg-indigo-500 bg-opacity-80 font-semibold text-gray-900 rounded-sm my-2"
              }
            >
              <span className="text-base">Save</span>
            </button>
          ) : (
            <button
              className={
                "p-2 bg-indigo-600 hover:bg-indigo-500 bg-opacity-80 font-semibold text-gray-900 rounded-sm my-2"
              }
            >
              <span className="text-base">Edit</span>
            </button>
          )
        }
      </td>
    );
  };

  let expiry = new Date(record.expiry).getTime();
  let today = new Date().getTime();
  let diff = expiry - today;
  let dateColour =
    diff > 0
      ? diff > 5 * 24 * 60 * 60 * 1000
        ? "text-green-300"
        : "text-yellow-200"
      : "text-red-300";

  return (
    <tr key={key} className="text-sm font-medium text-gray-300 my-4">
      <td className="p-2">{record.type}</td>
      <td className="p-2">{record.name}</td>
      <td className="p-2">{record.content}</td>
      <td className="p-2">{record.plan}</td>
      <td className={`p-2 ${dateColour}`}>{record.expiry}</td>
      {allowActions && recordActions()}
    </tr>
  );
};

export default RecordRow;
