export const Input = ({ value, onChange, disabled = false, placeholder }: InputProps) => {
  return <input className="w-full border p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder={placeholder} />;
};
