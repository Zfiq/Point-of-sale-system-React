/* To calculate the result we will be using call math.evaluate where we can pass in a string to get a result 
install npm install mathjs 
*/
import * as math from "mathjs"; // Import math hook
import Button from "./CalButton";
import Input from "./CalInput";
import { useState } from "react";
import React from "react";
import "../App.css";

function CalculatorApp(total) {
  // Total value with subtraction operation by default
  const [text, setText] = useState(`${total.total}-`); // Total props value passed from FirebaseDB and show total by default
  const [result, setResult] = useState("0");
  //const [calStatus, setCalStatus] = useState(false);

  // Show amount charge status Text. when cash or card button is clicked.
  let dueOrChange = "";
  const addToText = (val) => {
    setText((text) => [...text, val]);
  };

  //Cash function.
  const calculateResult = () => {
    const input = text.join(""); // Remove commas
    setResult(math.evaluate(input));
    localStorage.setItem("paidByCash", "Cash");
  };
  // If External card is selected for payments.
  const calculateResultCard = () => {
    if (window.confirm("Please Confirm once payment is made !")) {
      const input = text.join(""); // Remove commas
      setResult(math.evaluate(input));
      localStorage.setItem("paidByCard", "Card");
    }
  };

  const resetInput = () => {
    setText("");
    setResult("0");
  };

  // If the result is less than 0 show Change else if greater than 0 show due.
  if (result < 0) {
    dueOrChange = "Change";
  } else if (result > 0) {
    dueOrChange = "Due";
  }

  // Save into database onClick and close calculator after.
  // If half payment in cash half payment is by External card. display up to 3 lines.

  const save = () => {
    if (window.confirm("Would you like to confirm this order?")) {
      var num = text.join("");
      var array = num.split("-"),
        totalValue = array[0],
        afterCalculation1 = array[1],
        afterCalculation2 = array[2],
        afterCalculation3 = array[3];

      // Clear If any values are undefined
      if (afterCalculation1 === undefined) {
        afterCalculation1 = "";
      }
      if (afterCalculation2 === undefined) {
        afterCalculation2 = "";
      }
      if (afterCalculation3 === undefined) {
        afterCalculation3 = "";
      }

      // Display all values in parant
      localStorage.setItem("total", totalValue);
      localStorage.setItem("payment1", afterCalculation1);
      localStorage.setItem("payment2", afterCalculation2);
      localStorage.setItem("payment3", afterCalculation3);
      localStorage.setItem("change", result);

      alert("Order Confirmed ");
      window.location.href = "takeorder";
    }
  };

  // CE button delete one number onClick
  let backSpace = 0;
  const ce = (e) => {
    if (text.length > 0) {
      backSpace += 1;
      setText(text.slice(0, -backSpace)); // Remove number one number on cilck using slice
    }
  };

  const buttonColor = "#f2a33c";

  return (
    <div>
      <div className="calc-wrapper">
        <h1
          style={{
            color: "black",
            paddingTop: "1%",
          }}
        >
          {/* {dueOrChange} */}
          <Input
            dueOrChange={dueOrChange}
            text={text}
            result={parseFloat(result).toFixed(2)}
          />
        </h1>

        <div className="row">
          <button className="button-wrapper" value={text} onClick={ce}>
            <i className="material-icons"> keyboard_backspace</i>
          </button>

          <Button symbol="7" handleClick={addToText} />
          <Button symbol="8" handleClick={addToText} />
          <Button symbol="9" handleClick={addToText} />
          {/* <Button symbol="/" color={buttonColor} handleClick={addToText} /> */}
        </div>
        <div className="row">
          <Button symbol="4" handleClick={addToText} />
          <Button symbol="5" handleClick={addToText} />
          <Button symbol="6" handleClick={addToText} />
          {/* <Button symbol="*" color={buttonColor} handleClick={addToText} /> */}
        </div>
        <div className="row">
          <Button symbol="7" handleClick={addToText} />
          <Button symbol="1" handleClick={addToText} />
          <Button symbol="2" handleClick={addToText} />
          <Button symbol="3" handleClick={addToText} />
        </div>
        <div className="row">
          <Button symbol="10" color="blue" handleClick={addToText} />
          <Button symbol="20" color="blue" handleClick={addToText} />
          <Button symbol="30" color="blue" handleClick={addToText} />
          <Button symbol="40" color="blue" handleClick={addToText} />
          <Button symbol="50" color="blue" handleClick={addToText} />
        </div>
        <div className="row">
          <Button symbol="0" handleClick={addToText} />
          <Button symbol="." handleClick={addToText} />
          {/* <Button symbol="=" handleClick={calculateResult} /> */}
          <Button symbol="-" color={buttonColor} handleClick={addToText} />
          <Button symbol="+" color={buttonColor} handleClick={addToText} />
          <button className="cal-Btn" onClick={calculateResult}>
            Cash
          </button>
          <button className="cal-Btn" onClick={calculateResultCard}>
            External Card
          </button>
          <button className="cal-Btn" onClick={save}>
            Confirm Order
          </button>
        </div>
        <Button
          symbol="Clear"
          color="red"
          width="100px"
          handleClick={resetInput}
        />
      </div>
    </div>
  );
}

export default CalculatorApp;
//
