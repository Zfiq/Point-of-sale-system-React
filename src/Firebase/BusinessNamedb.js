import { db } from "../Firebase/Firebase";

import { set, ref, onValue } from "firebase/database";

// Run function to create bussiness name as main database name

export function mainDBName() {
  let email = localStorage.getItem("userEmail");
  let businessName = localStorage.getItem("BusinessName");
  const reference = ref(db, businessName);
  set(reference, {
    Email: email,
    BusinessName: businessName,
  });
}

// Main db name saved after sign up. Check if a specific user exists
export function checkUser() {
  onValue(ref(db), (snaphot) => {
    const data = snaphot.val();

    if (data !== null) {
      Object.values(data).forEach((todo) => {
        if (localStorage.getItem("userEmail") === todo.Email) {
          localStorage.setItem("BusinessNameDB", todo.BusinessName); //Name wiil remain after clearing catch data from database.
        }
      });
    }
  });
}
