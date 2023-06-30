import React from "react";
import axios from "axios";
import { GetServerSideProps } from "next";

export default function canceltest() {
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  var options = {
    method: 'GET',
    url: 'https://api.rajaongkir.com/starter/province',
    headers: {key: '7d840a0e0bb1962debcae4fd1f65fb8e'}
  };

  const res = await axios.request(options);
  const data = res.data.rajaongkir;
    // .then(function (response) {
    //   console.log(response.data.rajaongkir);
    //   data = response.data.rajaongkir;
    // })
    // .catch(function (error) {
    //   console.error(error);
    // });

    console.log("data: ", data);
  return {
    props:{
      data
    }
  };
};
