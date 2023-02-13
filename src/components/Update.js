import React from "react";
import { db } from "../Firebase/Firebase";
import { ref, onValue, remove, update } from "firebase/database";
import { useState, useEffect } from "react";
import "../components/styles.css";

const Update = () => {
  const [todo, setTodo] = useState(""); // USETATE Write
  const [todos, setTodos] = useState([]); // UseEffect Read

  const [readItems, setReadItems] = useState([]);
  const [updateValue, setUpdateValue] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateID, setUpdateID] = useState("");

  // ADDON INPUTS FOR DB

  const handleInput = (e1) => {
    setUpdateValue(e1.target.value);
  };
  const handleInputPrice = (e1) => {
    setUpdatePrice(e1.target.value);
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

  const updateCard = (item) => {
    setUpdateValue(item.item);
    setUpdatePrice(item.price);
    setUpdateID(item.id);
  };

  const saveUpdate = () => {
    // alert()
    const reference = ref(
      db,
      localStorage.getItem("BusinessNameDB") +
        "/Buttons/" +
        todo +
        "/ButtonInfo/" +
        updateID
    );
    update(reference, {
      item: updateValue,
      price: updatePrice,
    });
  };

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
      <div className="grid-container4">
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
        ))}
      </div>

      <div className="display-card3">
        <div className="container3">
          <br></br>
          <input
            style={{
              width: "48%",
              height: "30px",
              position: "fixed",
              marginLeft: "-25%",
              marginTop: "-15px",
            }}
            type="text"
            placeholder="Select item to edit"
            value={updateValue}
            onChange={handleInput}
          />
          <br></br> <br></br>
          <input
            style={{
              width: "50%",
              height: "35px",
              position: "fixed",
              marginLeft: "-25%",
              marginTop: "8px",
            }}
            type="number"
            placeholder="Price"
            value={updatePrice}
            onChange={handleInputPrice}
          />
          <br></br>
          <br></br>
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
                ></div>
                <ul style={{ width: "100%" }}>
                  <span className="article-content"> {item.item}</span>€
                  {item.price}
                  <p></p>
                  <div
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#ccc",
                      border: "none",
                      color: "black",
                    }}
                    onClick={() => updateCard(item)}
                  >
                    Select
                  </div>
                  <p></p>
                  <div
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#ccc",
                      border: "none",
                      color: "black",
                    }}
                    onClick={saveUpdate}
                  >
                    Save
                  </div>
                </ul>
              </div>
            ))}
        </div>
        <p></p>
      </div>
    </div>
  );
};

export default Update;
