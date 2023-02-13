import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import { set, ref, onValue, remove } from "firebase/database";
import LoadingOverlay from "react-loading-overlay-ts";
import Table from "react-bootstrap/Table";

const OrdersRecord = () => {
  const [selection, setSelection] = useState([]); // All Item Selections With Total
  const [isActive, setActive] = useState(false); // Loading false by default.
  const [search, setSearch] = useState("");

  let paidBy = ""; // If paid by cash or card update the value
  useEffect(() => {
    onValue(
      ref(db, localStorage.getItem("BusinessNameDB") + "/SavedOrders"),
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

  // Remove specific Order from record
  const removeOrder = (e) => {
    const value = e.target.value;

    if (
      window.confirm(
        "Are you sure you want to delete this order permanently?\nDate " + value
      )
    ) {
      remove(
        ref(
          db,
          localStorage.getItem("BusinessNameDB") + "/SavedOrders/" + value
        )
      );
    }
  };

  return (
    <div>
      <Link style={{ color: "green", textDecoration: "none" }} to="/">
        <button className="back-top-left">Back</button>
        <p></p>
      </Link>
      <span style={{ color: "white" }}>Order History</span>
      <Table className="spacing-table" style={{ fontSize: ".7em" }}>
        <tbody>
          <tr style={{ color: "white" }}>
            <th>
              <Link style={{ textDecoration: "none" }} to="/allcharts">
                {" "}
                <button style={{ color: "white", width: "70%" }}>
                  <i className="material-icons">query_stats</i>
                </button>{" "}
              </Link>
            </th>
            <th></th>
            <th>
              <input
                type={"text"}
                style={{
                  width: "120%",
                  height: "35px",
                  marginLeft: "-35%",
                }}
                placeholder="Order Number"
                onChange={(event) => setSearch(event.target.value)}
              />
            </th>
            <th>
              <button
                style={{
                  width: "100%",
                  height: "35px",
                  backgroundColor: "orange",
                  marginLeft: "37%",
                  color: "white",
                }}
                onClick={() => {
                  if (
                    window.confirm(
                      "This action will erase all the order history \nWould you like to proceed ? "
                    )
                  ) {
                    remove(
                      ref(
                        db,
                        localStorage.getItem("BusinessNameDB") + "/SavedOrders/"
                      )
                    );
                  }
                }}
              >
                Clear all record
              </button>
            </th>

            <th></th>
          </tr>
        </tbody>
      </Table>

      <LoadingOverlay
        active={isActive}
        spinner
        text=<p
          style={{
            color: "white",
            backgroundColor: "black",
            width: "400px",
            height: "120px",
            marginTop: "-100px",
          }}
        >
          Printing in process...
        </p>
      />
      {/* eslint-disable-next-line array-callback-return */}
      {selection.reverse().map((item) => {
        if (item.OrderNumber.includes(search.toLocaleLowerCase())) {
          return (
            <Table className="spacing-table" key={Math.random()}>
              <thead></thead>
              <tbody style={{ backgroundColor: "#d2ebfa" }}>
                <tr>
                  <td>{item.OrderNumber}</td>
                  <td>{item.DateTime}</td>
                  {/* <td>{item.Items}</td> */}

                  <td>
                    <button
                      className="material-icons"
                      style={{ color: "white", backgroundColor: "transparent" }}
                      value={item.DateTime}
                      onClick={() => {
                        if (item.Cash === "Cash") {
                          paidBy = "Cash";
                        } else {
                          paidBy = "Card";
                        }

                        alert(
                          item.Items.join("\n") +
                            "\nSubTotal " +
                            item.Total +
                            "\nTotal " +
                            item.PlusVat +
                            "\nPaid by " +
                            paidBy +
                            " " +
                            item.Payment1
                        );
                      }}
                    >
                      <i className="material-icons" style={{ width: "80px" }}>
                        information
                      </i>
                    </button>
                  </td>
                  <td>
                    <button
                      className="material-icons"
                      style={{ color: "blue", backgroundColor: "transparent" }}
                      value={item.DateTime}
                      onClick={() => {
                        const reference2 = ref(
                          db,
                          localStorage.getItem("BusinessNameDB") + "/Print"
                        );
                        setActive(true); // Loading... active
                        set(reference2, {
                          OrderNumber: item.OrderNumber,
                          DateTime: item.DateTime,
                          Items: item.Items,
                          Total: item.Total,
                          PlusVat: item.PlusVat,
                          Payment1: item.Payment1,
                          Payment2: item.Payment2,
                          Payment3: item.Payment3,
                          Cash: paidBy,
                          Change: item.Change,
                        });

                        setTimeout(removeDatabase, 5000); // Call back function remove db

                        function removeDatabase() {
                          remove(
                            ref(
                              db,
                              localStorage.getItem("BusinessNameDB") + "/Print"
                            )
                          );
                          setActive(false); // Loading... stops
                        }
                      }}
                    >
                      {" "}
                      <i className="material-icons">print</i>
                    </button>
                  </td>
                  <td>
                    <button
                      className="material-icons"
                      style={{ color: "red", backgroundColor: "transparent" }}
                      value={item.DateTime}
                      onClick={removeOrder}
                    >
                      &#xE872;
                    </button>
                  </td>
                </tr>
              </tbody>
            </Table>
          );
        }
      })}
    </div>
  );
};

export default OrdersRecord;
