import React from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react';

interface Rating{
    cartId: number;
    star: number;
    comment: string;
}

export default function Rate() { 
  const router = useRouter();
  const {id} = router.query;

  const [star, setStar] = useState(1);   
  const [comment, setComment] = useState("");   

  async function rate() {
    const data:Rating = {cartId: Number(id), star: star, comment: comment};
    try{
        fetch('http://localhost:3000/api/cart/rate/', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'POST'
        }).then(()=> router.back())
    }catch(error){
        //console.log(error)
    }
  }

  return (
    <div>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Add Rating</h1>
                <p className="mx-auto text-gray-400">Input rating details</p>
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex flex-row h-10 w-40 rounded-lg relative bg-transparent">
                    <button
                        onClick={()=> setStar(star - 1)}
                        disabled={star == 1? true : false}
                        className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                    >
                        <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input
                        type="text"
                        inputMode="numeric"
                        className="mx-auto outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md pointer-events-none md:text-basecursor-default flex items-center text-gray-700 "
                        name="custom-input-number"
                        value={String(star)}
                    ></input>
                    <button
                        onClick={()=> setStar(star + 1)}              
                        disabled={star == 5? true : false}
                        className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                    >
                        <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                </div>
                <div>
                    <p>Comment</p>
                    <textarea name="comment" className='w-80 h-40' value={comment} onChange={(e) => setComment(e.target.value)}/>
                </div>

                <div className="w-32 btn btn-primary">
                    <button onClick={()=>rate()}>Save</button>
                </div>
            </div>
        </section>
    </div>
  )
}
