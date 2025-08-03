// Formulario.jsx
const Form = ({ title, fields, buttonText, onSubmit, footerContent, backgroundColor }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    onSubmit(data);
  };

  return (
    <form className="form" style={{ backgroundColor }} onSubmit={handleSubmit}>
      <div className="form-title">{title}</div> {/* CAMBIADO */}
      {fields.map((field, index) => (
        <div className="container_inputs" key={index}>
          {field.label && <label htmlFor={field.name}>{field.label}</label>}
          <input
            name={field.name}
            placeholder={field.placeholder}
            type={field.type || "text"}
            value={field.value}
            required={field.required}
            disabled={field.disabled}
          />
        </div>
      ))}
      {buttonText && <button type="submit">{buttonText}</button>}
      {footerContent && <div>{footerContent}</div>}
    </form>
  );
};

export default Form;
