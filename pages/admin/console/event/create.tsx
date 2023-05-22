import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';

interface FormData{
  eventName: string,
  eventPath: string,
  startDate: string,
  endDate: string,
  image: string
}

export default function Event() {
  const [form, setForm] = useState<FormData>({eventName: '', eventPath: '', startDate: '', endDate: '', image: ''});
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File>();
  
  const handleUpload = async () => {
    try {
        if(!selectedFile) return;
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("eventName", form.eventName);
        formData.append("eventPath", form.eventPath);
        formData.append("startDate", form.startDate);
        formData.append("endDate", form.endDate);
        //formData.append("image", selectedFile);
        await axios.post('http://localhost:3000/api/admin/event/create/', formData).then(() => {router.back() });
    } catch (error: any) {
        //console.log(error);
    }
  }

  const renderSelectedImage = () => {

    if(selectedImage) return <img src={selectedImage} alt="Unable to display selected image" className='w-full h-1/2 object-cover'/>;
  }

  function formatDate(date : Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  return (
    <div className='lg:px-36'>
      <div id='title-hack-container' className=''>
        <section className='pl-4 lg:w-1/2 flex lg:flex-col lg:justify-center lg:items-center'>
          <div className='lg:w-5/6 justify-start'>
            <h1 className=' text-2xl  font-bold mb-2 font-bold'>Add Event</h1>
          </div>
        </section>
      </div>
      <form action="" onSubmit={e=>{e.preventDefault(); handleUpload();}} className='lg:flex lg:flex-row'>
        <section className='px-4 lg:w-1/2 flex lg:flex-col justify-center items-center'>
          <div className='border-gray-600 border border-dashed rounded-xl flex justify-center items-center h-40 w-full lg:h-5/6 lg:w-5/6 relative'>
            <input type="file" accept='.jpg, .jpeg, .png, .webp' name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute' 
              onChange={({target}) => {
                if(target.files){
                    const file = target.files[0];
                    setSelectedImage(URL.createObjectURL(file));
                    setSelectedFile(file);
                }
            }}
            />
            {renderSelectedImage()}
          </div>
        </section>
        <section  className='p-4 lg:w-1/2'>
          <div className=' space-y-4 flex flex-col'>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="event-name-input" className='font-bold'>Event Name</label>
              <input  id='event-name-input' name='event-name' type="text" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.eventName} onChange={e => setForm({...form, eventName: e.target.value})}
              />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="event-path-input" className='font-bold'>Event Path</label>
              <input id='event-path-input' name='event-path' type="text" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.eventPath} onChange={e => setForm({...form, eventPath: e.target.value})}
              />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="event-path-input" className='font-bold'>Event Start Date</label>
              <input id='event-path-input' name='event-path' type="date" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.startDate} onChange={(e) => {setForm({...form, startDate: e.target.value}); console.log( formatDate(new Date(e.target.value)))}}
              />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="event-path-input" className='font-bold'>Event End Date</label>
              <input id='event-path-input' name='event-path' type="date" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.endDate} onChange={(e) => {setForm({...form, endDate: e.target.value}); console.log( formatDate(new Date(e.target.value)))}}
              />
            </div>
            <button className='h-10 lg:w-36 rounded text-white bg-indigo-700'>
              Submit
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
