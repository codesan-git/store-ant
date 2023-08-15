import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next';
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage";

interface FormData{
  eventName: string,
  eventPath: string,
  startDate: string,
  endDate: string,
  image: string
}

interface Event {
    event: {
      id: number;
      eventName: string;
      eventPath: string;
      startDate: Date;
      endDate: Date;
      image: string;
    }
  }
  
export default function Event({event} : Event) {
  const [form, setForm] = useState<FormData>({eventName: event.eventName, eventPath: event.eventPath, startDate: formatDate(event.startDate), endDate: formatDate(event.endDate), image: event.image});
  const [selectedImage, setSelectedImage] = useState<string>(event.image);
  const [selectedFile, setSelectedFile] = useState<any>();
  const router = useRouter()
  const {id} = router.query;

  const handleUpload = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/event/${form.eventName}`);

    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            //console.log('Upload is paused');
            break;
          case 'running':
            //console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        //console.log("error, ", error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const data = {image: downloadURL, oldImage: event.image, eventName: form.eventName, eventPath: form.eventPath, startDate: form.startDate, endDate: form.endDate};
            await axios.put(`/api/admin/event/${id}`, data).then(() => {router.back() });
          } catch (error: any) {
              ////console.log(error);
          }
        }).then(() => router.reload());
      }
    );
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
            <h1 className=' text-2xl  font-bold mb-2 font-bold'>Update Event</h1>
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
                value={form?.startDate} onChange={(e) => {setForm({...form, startDate: e.target.value});}}
              />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <label htmlFor="event-path-input" className='font-bold'>Event End Date</label>
              <input id='event-path-input' name='event-path' type="date" className='p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white'
                value={form?.endDate} onChange={(e) => {setForm({...form, endDate: e.target.value}); }}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const eventId = context.query.id;
    const event = await prisma.event.findFirst({
        where:{id: Number(eventId)}
    });
  
    return {
      props: {
        event: JSON.parse(JSON.stringify(event)),
      },
    };
  };
  
