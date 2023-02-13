import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { db } from "../Firebase/Firebase";
import { ref, onValue } from "firebase/database";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart() {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});
  const [dateInput1, setDateInput1] = useState("");
  const [dateInput2, setDateInput2] = useState("");
  let [max, setMax] = useState("");
  let [min, setMin] = useState("");
  let disable = false;
  let allDates = [];
  let dates = [];
  const total = [];
  const dates1 = [];
  let itemNames = [];

  let allSavedItems = [];
  const [displayTotal, setDisplayTotal] = useState(0);
  // on Submit load all available dates and store in two different arrays when the page loads.

  useEffect(() => {
    onValue(
      ref(db, localStorage.getItem("BusinessNameDB") + "/SavedOrders/"),
      (snaphot) => {
        const data = snaphot.val();
        if (data !== null) {
          Object.values(data).forEach((clickSelected) => {
            allDates.push(
              new Date(clickSelected.DateTime).toISOString().slice(0, 10)
            );

            setMax(min_date(allDates));
            setMin(max_date(allDates));

            itemNames.push(clickSelected.Items);

            const a = [];
            itemNames.forEach((itemNames) => {
              a.push({
                item_name: itemNames,
              });
              // Find only name in database array
              let holders = {};
              a.forEach(function (item) {
                if (item.item_name === undefined) {
                  item.item_name = "";
                }
                if (item.item_name === itemNames) {
                  //  console.log(" " + item.item_name);

                  if (holders.hasOwnProperty(item.item_name)) {
                    holders[item.item_name] =
                      holders[item.item_name] + parseFloat(item.total_value);

                    //console.log(" " + holders[item.item_name]);
                  } else {
                    holders[item.item_name] = parseFloat(item.total_value);
                  }
                  // ITEMS IN DIFFERENT ARRAY INDEXs if index is undefined clear index.

                  // eslint-disable-next-line no-self-compare
                  if (item.item_name === item.item_name) {
                    allSavedItems.push(item.item_name[0]);
                  }
                }
              });
            });
          });
        }
      }
    );
  });

  //function to get higher date from dates
  function max_date(all_dates) {
    var max_dt = all_dates[0],
      max_dtObj = new Date(all_dates[0]);
    all_dates.forEach(function (dt, index) {
      if (new Date(dt) < max_dtObj) {
        max_dt = dt;
        max_dtObj = new Date(dt);
      }
    });
    return max_dt;
  }
  //function to get lowest date from dates
  function min_date(all_dates) {
    var max_dt = all_dates[0],
      max_dtObj = new Date(all_dates[0]);
    all_dates.forEach(function (dt, index) {
      if (new Date(dt) > max_dtObj) {
        max_dt = dt;
        max_dtObj = new Date(dt);
      }
    });
    return max_dt;
  }

  const handleChange = (event) => {
    setDateInput1(event.target.value);
  };
  const handleChange2 = (event) => {
    setDateInput2(event.target.value);
  };

  if (dateInput1 === dateInput2) {
    //   Disable button if equals
    disable = true;
  } else {
    disable = false;
  }
  if (dateInput1 > dateInput2) {
    //   Disable button if equals
    disable = true;
  }

  const handleClick = () => {
    // "Dates" stores input field value

    let today = new Date(dateInput1); // get the date
    let day = ("0" + today.getDate()).slice(-2); //get day with slice to have double digit day
    let month = ("0" + (today.getMonth() + 1)).slice(-2); //get your zero in front of single month digits so you have 2 digit months
    let date1 = today.getFullYear() + "-" + month + "-" + day;
    // Date input for second datepicker
    let today2 = new Date(dateInput2);
    let day2 = ("0" + today2.getDate()).slice(-2);
    let month2 = ("0" + (today2.getMonth() + 1)).slice(-2);
    let date2 = today2.getFullYear() + "-" + month2 + "-" + day2;

    setTimeout(showChart, 1000);

    function showChart() {
      onValue(
        ref(db, localStorage.getItem("BusinessNameDB") + "/SavedOrders/"),
        (snaphot) => {
          let data = snaphot.val();

          if (data !== null) {
            Object.values(data).forEach((clickSelected) => {
              if (
                new Date(clickSelected.DateTime) >= new Date(date1) &&
                new Date(clickSelected.DateTime) <= new Date(date2)
              ) {
                dates.push(
                  new Date(clickSelected.DateTime).toISOString().slice(0, 10)
                );

                let it = [];
                it.push(clickSelected.Total);
                var sum = it.reduce((a, b) => {
                  return a + b;
                });

                dates1.push(dates);
                total.push(sum);

                let sum2 = 0;
                // Running the for loop to sum again to display the range totals
                for (let i = 0; i < total.length; i++) {
                  sum2 += parseFloat(total[i]);
                }

                setDisplayTotal(sum2);
              }

              setChartData({
                labels: allSavedItems,
                datasets: [
                  {
                    label: "Total Sales ",
                    data: total,
                    borderColor: "transparent",
                    backgroundColor: [
                      "#C3e6f5",
                      "#C4c3f5",
                      "#D5f5c3",
                      "#2596be",
                      "gray",
                      "#9e8aa8",
                      "#7f8e94",
                      "#446d7b",
                      "lightbule",
                      "lightgray",
                      "#8c7f94",
                      "#F5dac3",
                      "#F5c3c3",
                      "#1d204c",
                      "#4c371d",
                      "#C1f9da",
                      "#Dcf9c1",
                      "#E1ead7",
                    ],
                  },
                ],
              });

              setChartOptions({
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "",
                  },
                },
              });
            });
          }
        }
      );

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  };

  return (
    <div>
      <div
        style={{
          color: "black",
          marginLeft: "15%",
          marginTop: "60px",
        }}
      >
        <p style={{ marginLeft: "-15%" }}>
          {" "}
          Available From {min} to {max}
        </p>
        <h2 style={{ marginLeft: "-18%" }}>
          Total Sales {parseFloat(displayTotal)}
        </h2>

        <p style={{ marginLeft: "-15%" }}>
          <input
            type="date"
            onChange={handleChange}
            value={dateInput1}
            max={max}
            min={min}
            className="date-input1"
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="date"
            onChange={handleChange2}
            value={dateInput2}
            max={max}
            min={min}
            className="date-input1"
          />
          <br></br> <br></br>
          <button disabled={disable} onClick={handleClick}>
            Submit
          </button>
          <br></br>
        </p>
      </div>

      <div>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
