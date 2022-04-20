import Axios from "axios";
import React, { useState, useEffect } from "react";
import "./App.css";
import { server } from "./server";

function App() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const [order_id, setOrder_id] = useState("");

  const handlePaymentSuccess = async (response) => {
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", response);
      console.log(bodyData);

      // useEffect(() => {
      //   // storing input name
      //   localStorage.setItem("data", JSON.stringify(data));
      // }, [data]);

      // localStorage.setItem('response', response);
      // console.log({
      //   razorpay_payment_id: response.razorpay_payment_id,
      //   razorpay_order_id: response.razorpay_order_id,
      //   razorpay_signature: response.razorpay_signature,
      // });

      await Axios({
        url: `https://shreegoshala.herokuapp.com/paymenthandler/`,
        method: "POST",
        data: response,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("Everything is OK!");
          setName("");
          setAmount("");
          setOrder_id("");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
  };

  // this will load a script tag which will open up Razorpay payment card to make transactions
  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const showRazorpay = async () => {
    const res = await loadScript();

    let bodyData = new FormData();

    // console.log("check1");

    // we will pass the amount and product name to the backend using form data
    bodyData.append("amount", amount.toString());
    bodyData.append("name", name);
    bodyData.append("contact", contact);
    bodyData.append("email", email);
    bodyData.append("address", address);
    bodyData.append("order_id", order_id);

    // console.log("check2");

    const data = await Axios({
      url: `https://shreegoshala.herokuapp.com/payment/`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: bodyData,
    }).then((res) => {
      setOrder_id(res.order_id);
      // useEffect(()=>{
      // localStorage.setItem("order_id", JSON.stringify(order_id));
      localStorage.setItem("res", JSON.stringify(res));
      // setOrder_id()
      // },[]);
      return res;
    });

    console.log(data);

    // const [data, setdata] = useState("");

    // in data we will receive an object from the backend with the information about the payment
    //that has been made by the user
    console.log("check3 81");
    var Jsondata = JSON.parse(localStorage.getItem("res"))["data"]
    var order_id = Jsondata["order_id"]
    console.log(order_id);
    
    console.log(Jsondata);


    var options = {
      key: "write here key",
      key_secret: "write here key secret",
      amount: amount * 100,
      currency: "INR",
      name: "Org. Name",
      description: "Test transaction",
      image: "", // add image url
      order_id: order_id, //localStorage.getItem("res.data.order_id"),
      handler: function (response) {
        // we will handle success by calling handlePayment method and
        // will pass the response that we've got from razorpay
        console.log({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
        handlePaymentSuccess(response);
      },
      prefill: {
        name: "DK",
        email: "deepak.meena@ilearnplace.com",
        contact: "9085295860",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    // console.log("check4 108");
    var rzp1 = new window.Razorpay(options);
    rzp1.open();

    // console.log("check5 111");
  };
  // console.log("check6 113");
  return (
    <div className="container" style={{ marginTop: "20vh" }}>
      <form>
        <h1>Payment page</h1>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            className="form-control"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Amount</label>
          <input
            type="text"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </form>
      <button onClick={showRazorpay} className="btn btn-primary btn-block">
        Pay with razorpay
      </button>
    </div>
  );
}

export default App;
