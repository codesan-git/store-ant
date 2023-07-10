import React from "react";
import axios from "axios";
import { GetServerSideProps } from "next";

export default function canceltest() {
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  var options = {
    headers: { 'key': "78aa3bcef91ff67ac1200ce9533f9783"}
  };
 
  const form = {
    origin: '455',
    destination: '32',
    weight: Number(100),
    courier: "jne",
  };
  const costRes = await axios.post("https://api.rajaongkir.com/starter/cost", form, options);
  const cost = costRes.data.rajaongkir.results[0].costs.filter((x) => x.service == "REG")[0].cost;
  console.log("cost: ", cost);
  return {
    props:{
      
    }
  };
};
