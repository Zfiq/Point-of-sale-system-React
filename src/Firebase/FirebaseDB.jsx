import React from "react";
import { db } from "./Firebase";
import { uid } from "uid";
import { set, ref, onValue, remove } from "firebase/database";
import { useState, useEffect } from "react";
import "../components/styles.css";
import CalculatorApp from "../components/CalculatorApp";

const Firebase = () => {
  const [todo, setTodo] = useState(""); // USETATE Write
  const [todos, setTodos] = useState([]); // UseEffect Read
  const [catInput, setCatInput] = useState([{ catName: "", catPrice: "" }]); // Category input value
  const [readItems, setReadItems] = useState([]);
  const [disable, setDisable] = useState(true); // Button Disable Enable
  const [selection, setSelection] = useState([]); // All Item Selections With Total
  const [showCal, setshowCal] = useState(false); // Hide and show when cash button is clicked

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
  };

  // Create Item func if input field is not null enable other fields
  const handleTodoChange = (e) => {
    setTodo(e.target.value);

    // Button Disable Enable
    setTodo(e.target.value);
    if (e.target.value.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  // INPUT FOR CATEGORY
  const handleinputchange = (e, index) => {
    const { name, value } = e.target;
    const list = [...catInput];
    list[index][name] = value;
    setCatInput(list);
    // console.log(value);
  };

  //WRITE The main BUTTON name only
  const writeToDatabase = () => {
    const uuid = uid();
    const reference = ref(
      db,
      localStorage.getItem("BusinessNameDB") + "/Buttons/" + todo
    );
    set(reference, {
      todo: todo,
      uuid: uuid,
    });
  };

  // ADD inside the main button

  const addToBuuton = () => {
    catInput.forEach((x) => {
      const uuid = uid();
      const reference = ref(
        db,
        localStorage.getItem("BusinessNameDB") +
          "/Buttons/" +
          todo +
          "/ButtonInfo/" +
          uuid
      ); // Name of the button and INFO

      set(reference, {
        id: uuid,
        item: x.catName,
        price: x.catPrice,
      });
    });
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
    setDisable(false);

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

  // Delete the category button on click also remove ADDONS from database
  const del = (item) => {
    remove(
      ref(
        db,
        localStorage.getItem("BusinessNameDB") +
          "/Buttons/" +
          todo +
          "/ButtonInfo/" +
          item.id
      )
    );
    remove(
      ref(
        db,
        localStorage.getItem("BusinessNameDB") + "/Buttons/" + todo + "/Addons"
      )
    );
  };

  // Selected items and total to save in database
  let total = 0;
  selection.reduce(
    (sum, { Price, Quantity }) => (total = sum + parseFloat(Price) * Quantity),
    0
  );

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

  //DELETE

  const handleDelete = (todo) => {
    if (
      window.confirm("Are you sure you wish to delete this item ? " + todo.todo)
    ) {
      remove(
        ref(
          db,
          localStorage.getItem("BusinessNameDB") + `/Buttons/` + todo.todo
        )
      );
    }
  };

  return (
    <div>
      {/* CREATE COMPONENT TO SHOW DATA */}
      <div className="grid-container">
        {todos.map((todo) => (
          <div key={Math.random()}>
            <div className="center">
              <h2>
                {todo.todo}

                <div className="flex-parent jc-center">
                  <button
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => handleUpdate(todo)}
                  >
                    🖊
                  </button>
                  <button
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => handleDelete(todo)}
                  >
                    ❌
                  </button>
                </div>
              </h2>
            </div>
          </div>
        ))}{" "}
      </div>

      {/* CREATE INPUT FOR NEW BUTTON */}

      <div className="display-card2">
        <div className="container2">
          <button
            style={{
              width: "250px",
              height: "30px",
              backgroundColor: "orange",
            }}
            onClick={() => {
              if (
                window.confirm(
                  "This action will erase all the main categories \nWould you like to proceed ? "
                )
              ) {
                remove(
                  ref(db, localStorage.getItem("BusinessNameDB") + "/Buttons/")
                );
              }
            }}
          >
            Delete all categories
          </button>
          <div>
            <hr style={{ width: "50%" }}></hr>
            <input
              type="text"
              value={todo}
              onChange={handleTodoChange}
              placeholder="Enter Category Name"
            />
          </div>

          <button disabled={disable} onClick={writeToDatabase} className="btn2">
            Create
          </button>
          <hr style={{ width: "50%" }}></hr>

          <div>
            {/* ADD NEW ITEM */}

            <div>
              {catInput.map((x, i) => {
                return (
                  <div key={i}>
                    <div>
                      <input
                        disabled={disable}
                        type="text"
                        name="catName"
                        value={x.catName}
                        placeholder="Item Name"
                        onChange={(e) => handleinputchange(e, i)}
                      />
                    </div>
                    <div>
                      <input
                        disabled={disable}
                        type="text"
                        name="catPrice"
                        value={x.catPrice}
                        placeholder="Price"
                        onChange={(e) => handleinputchange(e, i)}
                      />
                    </div>
                    <div>
                      {catInput.length - 1 === i && (
                        <button disabled={disable} onClick={addToBuuton}>
                          Create Item
                        </button>
                      )}
                      <hr style={{ width: "50%" }}></hr>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <br />
          {/* ADD NEW ITEM IN CARD */}
          {readItems
            .sort((a, b) => (a.item > b.item ? 1 : -1))
            .map((item) => (
              <div className="block" key={Math.random()}>
                <div
                  style={{
                    marginLeft: "-50px",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => clickItem(item)}
                ></div>
                <ul style={{ width: "100%" }}>
                  <span className="article-content"> {item.item}</span>€
                  {item.price}
                  <div
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#ccc",
                      border: "none",
                    }}
                    onClick={() => del(item)}
                  >
                    ❌
                  </div>
                </ul>{" "}
              </div>
            ))}

          <p>
            <br></br>
          </p>
        </div>
        {/* {CALCULATOR} */}

        {showCal && (
          <div
            style={{
              color: "white",
              width: "100%",
              height: "380px",
              marginLeft: "0",
              marginTop: "-380px",
              fontSize: ".75em",
              backgroundColor: "",
              marginBottom: "20%",
            }}
          >
            <button className="btn3" onClick={() => setshowCal(!showCal)}>
              {showCal ? "Close Calculator" : "Cash"}{" "}
            </button>
            <br />
            {/* Passing the total as props value to CalculatorApp  */}
            <CalculatorApp total={total} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Firebase;
