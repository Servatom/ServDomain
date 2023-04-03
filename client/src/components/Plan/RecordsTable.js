const RecordsTable = ({ records, allowActions = false }) => {
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
            <th className="text-left pb-2">Type</th>
            <th className="text-left pb-2">Name</th>
            <th className="text-left pb-2">Content</th>
            <th className="text-left w-32 pb-2">Expiry</th>
            {allowActions && (
              <>
                <th className="text-left pb-2"></th>
                <th className="text-left pb-2"></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => {
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
              <tr key={index} className="text-sm font-medium text-gray-300">
                <td className="py-2">{record.type}</td>
                <td className="py-2">{record.name}</td>
                <td className="py-2">{record.content}</td>
                <td className={`py-2 ${dateColour}`}>{record.expiry}</td>
                {allowActions && (
                  <>
                    {diff > 0 ? (
                      <td className="py-2 text-right">
                        <button className="p-2 bg-red-400 bg-opacity-80 font-semibold text-gray-900">
                          Cancel
                        </button>
                      </td>
                    ) : (
                      <td className="py-2 text-right">
                        <button className="p-2 bg-yellow-400 bg-opacity-80 font-semibold text-gray-900">
                          Renew
                        </button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;
