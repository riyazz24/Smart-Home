function InputField({ label, type = "text", placeholder, ...rest }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={type} placeholder={placeholder} {...rest} />
    </div>
  );
}

export default InputField;
