import Address from "@/pages/address";
import axios from "axios"

export interface Address {
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

export interface AddressFormData{
  address: string,
  region: string,
  cityId: string,
  city: string,
  provinceId: string,
  province: string,
  postcode: string,
  contact: string
}

export interface provinceData {
  province_id: string,
  province: string
}

export interface cityData {
    city_id: string,
    province_id: string
    city_name: string
}

export interface createAddressParams {
  form: AddressFormData, 
  cityData: cityData[], 
  provinceData: provinceData[],
}

export const getAllAddress =  async (): Promise<Address[]> => {

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


export const createAddress = async ({form, cityData, provinceData}: createAddressParams) => {
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

