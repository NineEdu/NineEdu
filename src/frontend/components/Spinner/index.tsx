import "./Spinner.css";

const Spinner1 = ({ size = "50px" }) => {
  const spinnerStyle = {
    width: size,
    height: size,
  };

  return (
    <div className="spinner-container" style={spinnerStyle}>
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner1;
