import React from "react";
import { db } from "../Firebase/Firebase";
import { uid } from "uid";
import { set, ref, onValue, remove } from "firebase/database";
import { useState, useEffect } from "react";
import "../components/styles.css";
import CalculatorApp from "../components/CalculatorApp";
import LoadingOverlay from "react-loading-overlay-ts";
import Table from "react-bootstrap/Table";
const ClientTakeOrder = () => {
  const [todo, setTodo] = useState(""); // USETATE Write
  const [todos, setTodos] = useState([]); // UseEffect Read
  const [readItems, setReadItems] = useState([]);

  const [selection, setSelection] = useState([]); // All Item Selections With Total
  const [showCal, setshowCal] = useState(false); // Hide and show when cash button is clicked
  const [show, setShow] = useState(false); // When category button is clicked
  const [isActive, setActive] = useState(false); // Loading false by default.

  // Current Date and time
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  let gettotal = localStorage.getItem("total");
  let payment1 = localStorage.getItem("payment1");
  let payment2 = localStorage.getItem("payment2");
  let payment3 = localStorage.getItem("payment3");
  let getchange = localStorage.getItem("change");
  // let plusVat = localStorage.getItem("VAT");
  let cash = localStorage.getItem("paidByCash");
  let card = localStorage.getItem("paidByCard");
  // Set change to zero by default to avoid NAN in display value.
  if (getchange == null) {
    getchange = 0;
  } else {
    localStorage.getItem("change");
  }

  let quantity = 1; // By default quantity 1. if less or equals to 0 stop at 1.
  const QTY = (e) => {
    if (e.target.value <= 0) {
      e.target.value = 1;
    } else {
      quantity = e.target.value;
    }
  };

  //READ using UseEffect snapshot

  useEffect(() => {
    onValue(
      ref(db, localStorage.getItem("BusinessNameDB") + "/Buttons/"),
      (snaphot) => {
        setTodos([]); // Reset Array
        const data = snaphot.val();
        if (data !== null) {
          Object.values(data).forEach((todo) => {
            setTodos((oldArray) => [...oldArray, todo]);
          });
        }
      }
    );
  }, []);

  // Main button Selection and store in array

  const handleUpdate = (todo) => {
    setTodo(todo.todo);

    onValue(
      ref(
        db,
        localStorage.getItem("BusinessNameDB") +
          "/Buttons/" +
          todo.todo +
          "/ButtonInfo/"
      ),
      (snaphot) => {
        setReadItems([]); // Reset Array
        const data = snaphot.val();

        if (data !== null) {
          Object.values(data).forEach((todo) => {
            setReadItems((oldArray) => [...oldArray, todo]);
          });
        }
      }
    );
  };

  // Selected items and total to save in database
  let total = 0;
  selection.reduce(
    (sum, { Price, Quantity }) => (total = sum + parseFloat(Price) * Quantity),
    0
  );

  // SELECT ITEM REMOVE ITEM When ITEMS ARE SHOWING ONLY
  const clickItem = (item) => {
    ref(
      db,
      localStorage.getItem("BusinessNameDB") +
        "/Buttons/" +
        todo +
        "/ButtonInfo/" +
        item.id
    );

    var totalPrice = 0;
    totalPrice = item.price * quantity;

    const uuid = uid();
    const reference = ref(
      db,
      localStorage.getItem("BusinessNameDB") + "/Orders/" + dateTime
    );
    set(reference, {
      selectedItem: item.item,
      Price: item.price,
      Quantity: quantity,
      TotalPrice: totalPrice,
      uuid: uuid,
      DateTime: dateTime,
    });
  };

  // Retrieve Selection to display in UI
  useEffect(() => {
    onValue(
      ref(db, localStorage.getItem("BusinessNameDB") + "/Orders/"),
      (snaphot) => {
        setSelection([]); // Reset Array
        const data = snaphot.val();
        if (data !== null) {
          Object.values(data).forEach((clickSelected) => {
            setSelection((oldArray) => [...oldArray, clickSelected]);
          });
        }
      }
    );
  }, []);

  // Remove specific selected item from main cart
  const removeSelection = (e) => {
    const value = e.target.value;

    remove(
      ref(db, localStorage.getItem("BusinessNameDB") + "/Orders/" + value)
    );
  };
  // Delete all selected orders from the cart at once.
  const voidAll = () => {
    if (total > 0) {
      if (
        window.confirm(
          "This action will clear all items from the cart\nWould you like to proceed? "
        )
      ) {
        remove(ref(db, localStorage.getItem("BusinessNameDB") + "/Orders"));
        localStorage.removeItem("total");
        localStorage.removeItem("payment1");
        localStorage.removeItem("payment2");
        localStorage.removeItem("payment3");
        localStorage.removeItem("change");
        localStorage.removeItem("paidByCash");
        localStorage.removeItem("paidByCard");
      }
    } else {
      alert("No items found");
    }
  };

  // Any Item is selected by User store in array then save in to database
  let itemList = [];
  onValue(
    ref(db, localStorage.getItem("BusinessNameDB") + "/Orders/"),
    (snaphot) => {
      const data = snaphot.val();
      if (data !== null) {
        Object.values(data).forEach((clickSelected) => {
          itemList.push(
            clickSelected.selectedItem,
            clickSelected.Quantity,
            clickSelected.TotalPrice
          );
        });
      }
    }
  );

  // Quick save order without printing

  const addOrder = () => {
    const uuid = uid();
    if (
      window.confirm("Save order without receipt\nwould you like to proceed? ")
    ) {
      if (payment1 > 0 && total > 0) {
        alert("Order saved");
        const reference = ref(
          db,
          localStorage.getItem("BusinessNameDB") + "/SavedOrders/" + dateTime
        );
        set(reference, {
          OrderNumber: uuid,
          DateTime: dateTime,
          Items: itemList,
          Total: parseFloat(total).toFixed(2),
          PlusVat: gettotal,
          Payment1: payment1,
          Payment2: payment2,
          Payment3: payment3,
          Cash: cash,
          Card: card,
          Change: parseFloat(getchange).toFixed(2),
        });
        remove(ref(db, localStorage.getItem("BusinessNameDB") + "/Orders"));
        remove(ref(db, localStorage.getItem("BusinessNameDB") + "/Print"));
        localStorage.removeItem("total");
        localStorage.removeItem("payment1");
        localStorage.removeItem("payment2");
        localStorage.removeItem("payment3");
        localStorage.removeItem("change");
        localStorage.removeItem("paidByCash");
        localStorage.removeItem("paidByCard");
        setActive(false);
      } else {
        alert(" Order cannot be saved no transaction is done!");
      }
    }
  };

  // Save order and also print
  const sendTpPrinter = () => {
    if (payment1 > 0 && total > 0) {
      setActive(true); // Loading... active
      const uuid = uid();
      const reference = ref(
        db,
        localStorage.getItem("BusinessNameDB") + "/SavedOrders/" + dateTime
      );
      set(reference, {
        OrderNumber: uuid,
        DateTime: dateTime,
        Items: itemList,
        Total: parseFloat(total).toFixed(2),
        PlusVat: gettotal,
        Payment1: payment1,
        Payment2: payment2,
        Payment3: payment3,
        Cash: cash,
        Card: card,
        Change: parseFloat(getchange).toFixed(2),
      });

      const reference2 = ref(
        db,
        localStorage.getItem("BusinessNameDB") + "/Print/"
      );
      set(reference2, {
        OrderNumber: uuid,
        DateTime: dateTime,
        Items: itemList,
        Total: parseFloat(total).toFixed(2),
        PlusVat: gettotal,
        Payment1: payment1,
        Payment2: payment2,
        Payment3: payment3,
        Cash: cash,
        Card: card,
        Change: parseFloat(getchange).toFixed(2),
      });

      delay();
    } else {
      alert("Transaction is not done!");
    }

    function delay() {
      setTimeout(removeDatabase, 5000);
    }

    function removeDatabase() {
      remove(ref(db, localStorage.getItem("BusinessNameDB") + "/Orders"));
      remove(ref(db, localStorage.getItem("BusinessNameDB") + "/Print"));
      localStorage.removeItem("total");
      localStorage.removeItem("payment1");
      localStorage.removeItem("payment2");
      localStorage.removeItem("payment3");
      localStorage.removeItem("change");
      localStorage.removeItem("paidByCash");
      localStorage.removeItem("paidByCard");
      setActive(false);
    }
  };

  return (
    <div>
      <LoadingOverlay
        active={isActive}
        spinner
        text=<p
          style={{
            color: "white",
            backgroundColor: "black",
            width: "400px",
            height: "120px",
            marginTop: "-80px",
          }}
        >
          Printing in process...
        </p>
      />

      <div className="container">
        <div className="cards3">
          {todos.map((todo) => (
            <div key={Math.random()}>
              <button
                className="main-btn"
                onClick={() => handleUpdate(todo) + setShow(!show)}
              >
                {show ? "" : ""}
                {todo.todo}
              </button>
            </div>
          ))}
        </div>

        {/* CREATE INPUT FOR NEW BUTTON */}

        <div className="display-card4">
          {/* TOTAL COST VALUES OF ITEMS IN CART*/}
          <div className="container4">
            <button className="cal-Btn" onClick={addOrder}>
              Save Order
            </button>
            <button className="cal-Btn" onClick={voidAll}>
              Void All
            </button>
            <button className="cal-Btn" onClick={() => setshowCal(!showCal)}>
              Charge
            </button>

            <button className="cal-Btn" onClick={sendTpPrinter}>
              Print
            </button>
          </div>
          <div className="cart">
            {selection.map((item) => (
              <div key={Math.random()}>
                <ul>
                  <span className="cart-box">
                    x{item.Quantity} -- {item.selectedItem} -- €
                    {item.TotalPrice}
                  </span>
                  <button
                    className="deleteButton"
                    value={item.DateTime}
                    onClick={removeSelection}
                  >
                    X
                  </button>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {show && (
          <div className="grid-container3">
            <button className="box-back-btn" onClick={() => setShow(!show)}>
              {show ? "Back" : "Back"}{" "}
            </button>
            {readItems
              .sort((a, b) => (a.item > b.item ? 1 : -1))
              .map((item) => (
                <div className="block" key={Math.random()}>
                  <ul
                    style={{
                      width: "100%",
                      marginLeft: "-50px",
                      marginTop: "3px",
                    }}
                  >
                    <span className="article-content"> {item.item}</span>{" "}
                    <span style={{ fontWeight: "bold" }}>€{item.price}</span>
                    {/* <p></p> */}
                    <input
                      className="box-input-button"
                      type="number"
                      inputMode="none"
                      min={1}
                      onChange={QTY}
                    />
                    <p></p>
                    <div
                      className="box-add-button"
                      onClick={() => clickItem(item)}
                    >
                      Add
                    </div>
                  </ul>
                </div>
              ))}

            <p>
              <br></br>
            </p>
          </div>
        )}
        {/* {CALCULATOR} */}

        {showCal && (
          <div style={{ width: "100%", zIndex: 1 }}>
            {showCal && (
              <div className="cal-frame">
                <button className="btn3" onClick={() => setshowCal(!showCal)}>
                  {showCal ? "❌" : "Cash"}{" "}
                </button>
                {/* Passing the total as props value to CalculatorApp  */}{" "}
                <CalculatorApp total={total} />{" "}
              </div>
            )}
          </div>
        )}

        <div className="navbar">
          <Table className="spacing-table" style={{ fontSize: ".9em" }}>
            <thead>
              <tr>
                <th style={{ color: "white" }}> Sub Total {total}</th>
                <th style={{ color: "white" }}> Total {gettotal}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ color: "white" }}>
                  {cash} {card} {payment1}
                </th>
                <th style={{ color: "white" }}>
                  {" "}
                  Change {parseFloat(getchange)}
                </th>
              </tr>
              <tr>
                <td>{payment2}</td>
                <td>{payment3}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ClientTakeOrder;
