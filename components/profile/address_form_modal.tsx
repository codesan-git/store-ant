import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { Fragment, useState } from "react";

const AddressFormModal = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const modalOpenHandler = () => setModalOpen(!modalOpen);
  
  return (
    <Fragment>
      <Button  onClick={modalOpenHandler}>
        + Tambah Alamat Baru
      </Button>
      <Dialog open={modalOpen} handler={modalOpenHandler}>
        <DialogHeader>
          <h1 className="w-3/4">Add New Address</h1>
          <div  className="w-1/4 flex justify-end">
            <button onClick={modalOpenHandler}>
              ✕
            </button>
          </div>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={e=>{e.preventDefault()}} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="address-input">Address</label>
              <input id="address-input" type="text" name="address" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>                
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="province-input" className='font-bold'>Province</label>
              <select name="province" id="province-input" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                  onChange={e => {e.preventDefault(); }} 
              >
                {/* {provinceData?.map(province =>(
                    <option value={province.province} key={province.province_id}>{province.province}</option>
                ))} */}
              </select>
            </div>               
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="city-input" className='font-bold'>City</label>
              <select name="city" id="city-input" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                  onChange={e => {e.preventDefault()}} 
              >
                {/* {cityData?.filter((x) => x.province_id == form.provinceId).map(city =>(
                    <option value={city.city_name} key={city.city_id}>{city.city_name}</option>
                ))} */}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="address-input">Region</label>
              <input id="address-input" type="text" name="region" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>    
            <div className="flex flex-col space-y-1">
              <label htmlFor="address-input">Postcode</label>
              <input id="address-input" type="text" name="postcode" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>    
            <div className="flex flex-col space-y-1">
              <label htmlFor="address-input">Contact Number</label>
              <input id="address-input" type="text" name="contact" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>
            <div className="w-full flex justify-end">
              <button type="submit" className="w-24 h-8 bg-green-700 hover:bg-green-500 transition text-white rounded-md ">Save</button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </Fragment>
  )
}

export default AddressFormModal;