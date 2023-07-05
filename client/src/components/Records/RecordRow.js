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
              className={"p-2 text-indigo-500 font-semibold rounded-sm my-2"}
            >
              <span className="text-base underline underline-offset-4">
                Edit
                <svg
                  className="text-indigo-500 inline-block ml-1 h-4 w-4 fill-current"
                  role="presentation"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M4.488 1.85l.854-.353 6.15 6.15v.707l-6.15 6.15-.854-.354V1.85z"></path>
                </svg>
              </span>
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
      <td className="p-2">
        <a
          target="_blank"
          href={"https://" + record.name + ".servatom.com"}
          rel="noreferrer"
        >
          {record.name}
        </a>
      </td>
      <td className="p-2">{record.content}</td>
      <td className="p-2">{record.plan}</td>
      <td className={`p-2 ${dateColour}`}>
        {new Date(record.expiry).toLocaleDateString()}
      </td>
      {allowActions && recordActions()}
    </tr>
  );
};

export default RecordRow;
