import React from 'react'
import styles from '../styles/Form.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { GetServerSideProps } from "next";
import axios from 'axios';

interface FormData{
    address: string,
    region: string,
    cityId: string,
    city: string,
    provinceId: string,
    province: string,
    postcode: string,
    contact: string
}

interface Data {
    provinceData: {
        province_id: string,
        province: string
    }[]

    cityData: {
        city_id: string,
        province_id: string
        city_name: string
    }[]
}

export default function Address({cityData, provinceData} : Data) {
  const [form, setForm] = useState<FormData>({
    address: '', 
    region: '', 
    cityId:'',
    city: '', 
    provinceId: provinceData[0].province_id, 
    province: provinceData[0].province, 
    postcode: '', 
    contact: ''
  });
  const router = useRouter()

  async function create(){
    if(form.city == '')
        form.city = cityData.filter((x) => x.province_id == form.provinceId)[0].city_name;
    if(form.cityId == '')
        form.cityId = cityData.filter((x) => x.province_id == form.provinceId)[0].city_id;
    try{
        fetch('/api/address/create', {
            body: JSON.stringify(form),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> { router.back() })
    }catch(error){
        ////console.log(error)
    }
  }

  function setCityid(city: string){
    //console.log("prov:", form.province );
    let chosenCity = cityData.filter((x) => x.city_name == city);
    setForm({...form, cityId: chosenCity[0].city_id, city: chosenCity[0].city_name});
    //console.log(chosenCity[0].city_name, chosenCity[0].city_id)
  }

  return (
    <div>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Add Address</h1>
                <p className="mx-auto text-gray-400">Input address details</p>
            </div>

            <form onSubmit={e=>{e.preventDefault(); create()}} className="flex flex-col gap-5">
                <div>
                    <input type="text" name="address" placeholder="Address" className={styles.input_text} value={form?.address} onChange={e => setForm({...form, address: e.target.value})}/>
                </div>                
                <div className='flex flex-col space-y-1 w-full'>
                    <label htmlFor="province-input" className='font-bold'>Province</label>
                    <select name="province" id="province-input" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                        onChange={e => {e.preventDefault(); setForm({...form, provinceId: String(e.target.selectedIndex + 1), province: e.target.value});}} 
                    >
                        {provinceData?.map(province =>(
                            <option value={province.province} key={province.province_id}>{province.province}</option>
                        ))}
                    </select>
                </div>               
                <div className='flex flex-col space-y-1 w-full'>
                    <label htmlFor="city-input" className='font-bold'>City</label>
                    <select name="city" id="city-input" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                        onChange={e => {e.preventDefault(); setForm({...form, city: e.target.value}); setCityid(e.target.value)}} 
                    >
                        {cityData?.filter((x) => x.province_id == form.provinceId).map(city =>(
                            <option value={city.city_name} key={city.city_id}>{city.city_name}</option>
                        ))}
                    </select>
                </div>     
                <div>
                    <input type="text" name="region" placeholder="Region" className={styles.input_text} value={form?.region} onChange={e => setForm({...form, region: e.target.value})}/>
                </div>    
                <div>
                    <input type="text" name="postcode" placeholder="Postcode" className={styles.input_text} value={form?.postcode} onChange={e => setForm({...form, postcode: e.target.value})}/>
                </div>
                <div>
                    <input type="number" name="contact" placeholder="Contact Number" className={styles.input_text} value={form?.contact} onChange={e => setForm({...form, contact: e.target.value})}/>
                </div>

                <div>
                    <button type="submit" className={styles.button}>Save</button>
                </div>
            </form>
        </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  
    var options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/province',
      headers: {key: 'c6ea8e82078275e61b3a46b5e65b69f1'}
    }; 
  
    const provinceRes = await axios.request(options);
    const province = provinceRes.data.rajaongkir.results;
  
    options.url = 'https://api.rajaongkir.com/starter/city'
    const cityRes = await axios.request(options);
    const city = cityRes.data.rajaongkir.results;

    //console.log("city: ", city);
    //console.log("province: ", province);
    return {
      props:{
        cityData: city,
        provinceData: province
      }
    };
  };
  