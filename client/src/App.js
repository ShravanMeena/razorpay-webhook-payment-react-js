import React from "react";
import "./App.css";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const __DEV__ = document.domain === "localhost";

function App() {
  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch("http://localhost:1337/razorpay", {
      method: "POST",
    }).then((t) => t.json());

    console.log("data", data);

	const key_id = "rzp_test_q5BHP9ApeUJ9Xl" /// your key id from razorpay dashboard
    const options = {
      key: __DEV__ ? key_id : "PRODUCTION_KEY",
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id, //from backend developer TODO::: in our code got to backend and check index.js
      name: "TestPay",
      description: "Thank you for give us some money",
      image: "https://avatars.githubusercontent.com/u/41790742?v=4",
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name:"Shravan Meena",
        email: "shravan@meena.com",
        phone_number: "9899999999",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={displayRazorpay}>Test Pay ₹ 499</button>
      </header>
    </div>
  );
}

export default App;
