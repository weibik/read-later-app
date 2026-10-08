type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function TextField({ id, label, value, onChange, type }: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 mb-1 block"
      >
        {label}
      </label>
      <input
        id={id}
        className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
      />
    </div>
  );
}

export default TextField;
