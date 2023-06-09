import React from "react";
import axios from "axios";

export default function canceltest() {
  // var options = {
  //   method: 'POST',
  //   url: 'https://api.rajaongkir.com/starter/cost',
  //   headers: {key: '7d840a0e0bb1962debcae4fd1f65fb8e', 'content-type': 'application/x-www-form-urlencoded'},
  //   form: {origin: '501', destination: '114', weight: 1700, courier: 'jne'}
  // };

  // axios
  //   .request(options)
  //   .then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  const options = {
    method: "POST",
    url: "https://api.sandbox.midtrans.com/v2/transcation-order-27/refund",
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      accept: "application/json",
      //"content-type": "application/json",
      authorization:
        "Basic U0ItTWlkLXNlcnZlci12WGVDYnVkd3R2WTZZTldDRjBqVTZzM1A=",
    },
    data: { refund_key: "reference1", amount: 5000, reason: "for some reason" },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
  return <div></div>;
}
