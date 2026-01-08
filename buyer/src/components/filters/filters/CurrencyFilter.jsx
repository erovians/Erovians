const CurrencyFilter = ({ selected, onChange }) => {
  const currencies = ["USD", "EUR", "INR", "GBP", "CNY"];

  return (
    <div className="space-y-3">
      {currencies.map((currency) => (
        <label
          key={currency}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <span className="text-sm font-medium text-gray-800">{currency}</span>
          <input
            type="checkbox"
            checked={selected.includes(currency)}
            onChange={() => {
              if (selected.includes(currency)) {
                onChange(selected.filter((c) => c !== currency));
              } else {
                onChange([...selected, currency]);
              }
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default CurrencyFilter;
