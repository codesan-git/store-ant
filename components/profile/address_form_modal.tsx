import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { size } from "@material-tailwind/react/types/components/avatar";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

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

interface Props {
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


const AddressFormModal = ({ provinceData, cityData } : Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSize, setModalSize] = useState<size>();
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const modalOpenHandler = (size: size) => {
    setModalSize(size);
    setModalOpen(!modalOpen)
  };


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

  const router = useRouter();

  const create = () => {
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
      }).then(() => router.reload())
    }catch(error){
        //console.log(error)
    }
  }

  const setCityid = (city: string) => {
    console.log("prov:", form.province );
    let chosenCity = cityData.filter((x) => x.city_name == city);
    setForm({...form, cityId: chosenCity[0].city_id, city: chosenCity[0].city_name});
    console.log(chosenCity[0].city_name, chosenCity[0].city_id)
  }
  
  return (
    <Fragment>
      <Button id="open-modal-mobile" className="lg:hidden" onClick={() => modalOpenHandler("xl")}>
        + Tambah Alamat Baru
      </Button>
      <Button id="open-modal-web" className="hidden lg:block" onClick={() => modalOpenHandler("lg")}>
        + Tambah Alamat Baru
      </Button>
      <Dialog open={modalOpen} handler={modalOpenHandler} size={modalSize}>
        <DialogHeader>
          <h1 className="w-3/4">Add New Address</h1>
          <div  className="w-1/4 flex justify-end">
            <button onClick={() => modalOpenHandler("xl")}>
              ✕
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="">
          <form  onSubmit={e=>{e.preventDefault(); create()}}  className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="address-input">Address</label>
              <input id="address-input" type="text" name="address" onChange={(e) => setForm({ ...form, address: e.target.value})} className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>                
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="province-input" className='font-bold'>Province</label>
              <select name="province" id="province-input" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                  onChange={e => {e.preventDefault(); setForm({...form, provinceId: String(e.target.selectedIndex + 1), province: e.target.value})}} 
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
                {/* {cityData?.filter((x) => x.province_id == form.provinceId).map(city =>(
                    <option value={city.city_name} key={city.city_id}>{city.city_name}</option>
                ))} */}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="address-input">Region</label>
              <input id="address-input" type="text" name="region" onChange={e => setForm({...form, region: e.target.value})} className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>    
            <div className="flex flex-col space-y-1">
              <label htmlFor="address-input">Postcode</label>
              <input 
                id="address-input" 
                type="number" 
                name="postcode"                 
                onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                onChange={
                  (e) => {
                    if(e.target.value.length <= 5){
                      setForm({...form, postcode: e.target.value})
                    }
                  }
                } 
                value={form.postcode}
                className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>    
            <div className="flex flex-col space-y-1">
              <label htmlFor="address-input">Contact Number</label>
              <input 
                id="address-input" 
                type="number"
                name="contact"
                onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                onChange={
                  (e) => {
                    if(e.target.value.length <= 13){
                      setForm({...form, contact: e.target.value})
                    }
                  }
                } 
                value={form.contact}
                className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>
            <div className="w-full flex justify-end">
              <button type="submit" onClick={() => modalOpenHandler("xl")} className="w-24 h-8 bg-green-700 hover:bg-green-500 transition text-white rounded-md ">Save</button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </Fragment>
  )
}

export default AddressFormModal;