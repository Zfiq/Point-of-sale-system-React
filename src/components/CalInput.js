const Input = ({ text, result, dueOrChange }) => {
  return (
    <div className="wrapper">
      <span className="item"> {dueOrChange}</span>
      <span className="item"> €{result}</span>

      <span className="item">€{text}</span>
    </div>
  );
};

export default Input;
