const PaymentFilter = ({ selected, onChange }) => {
  const methods = ["Cash", "Credit Card", "Bank Transfer", "LC", "PayPal"];

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <span className="text-sm font-medium text-gray-800">{method}</span>
          <input
            type="checkbox"
            checked={selected.includes(method)}
            onChange={() => {
              if (selected.includes(method)) {
                onChange(selected.filter((m) => m !== method));
              } else {
                onChange([...selected, method]);
              }
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default PaymentFilter;
