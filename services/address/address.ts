import axios from "axios"

interface Address {
  id: number;
  address: string;
  region: string;
  city: string;
  province: string;
  postcode: string;
  isMainAddress: boolean;
  isShopAddress: boolean;
  contact: string;
}

interface AddressFormData{
  id?: number,
  address: string,
  region: string,
  cityId: string,
  city: string,
  provinceId: string,
  province: string,
  postcode: string,
  contact: string
}

interface provinceData {
  province_id: string,
  province: string
}

interface cityData {
    city_id: string,
    province_id: string
    city_name: string
}


const getAllAddress =  async (): Promise<Address[]> => {
  
  let addresses: Address[] = [];
  
  try{
    const response = await axios.get(`api/address/`);
    
    addresses = response.data.address;
    
    console.log(`all addresses 1: ${response.data.address}`)
    
    console.log(`all addresses: ${addresses}`)
  } catch (error) {
    //console.log(error);
  }
  
  return addresses;
}

interface createAddressParams {
  form: AddressFormData, 
  cityData: cityData[],
}

const createAddress = async ({form, cityData}: createAddressParams) => {
  if(form.city == '')
    form.city = cityData.filter((x) => x.province_id == form.provinceId)[0].city_name;
  if(form.cityId == '')
    form.cityId = cityData.filter((x) => x.province_id == form.provinceId)[0].city_id;
  try{
    await fetch('/api/address/create', {
      body: JSON.stringify(form),
      headers: {
          'Content-Type' : 'application/json'
      },
      method: 'POST'
    });
  }catch(error){
      ////console.log(error)
  }
}

interface updateAddressParams {
  form: AddressFormData, 
  cityData: cityData[],
}

const updateAddress = async ({form, cityData}: createAddressParams) => {
  if(form.city == '')
    form.city = cityData.filter((x) => x.province_id == form.provinceId)[0].city_name;
  if(form.cityId == '')
    form.cityId = cityData.filter((x) => x.province_id == form.provinceId)[0].city_id;
  try{
    await fetch('/api/address/update', {
      body: JSON.stringify(form),
      headers: {
          'Content-Type' : 'application/json'
      },
      method: 'PUT'
    })
  }catch(error){
      ////console.log(error)
  }
}


const deleteAddress = async (id: number) => {
  const addressId = {id: id};
  try{
    await fetch("/api/address/delete", {
      body: JSON.stringify(addressId),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  }
  catch(e){

  }
}

export type {Address, createAddressParams, updateAddressParams, cityData, provinceData, AddressFormData}
export {createAddress, getAllAddress, updateAddress, deleteAddress}
