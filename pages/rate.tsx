import React from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react';
import axios from 'axios';

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
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [files, setFile] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  const handleFile = (e:any) => {
    setMessage("");
    let file = e.target.files;
    
    for (let i = 0; i < file.length; i++) {
        const fileType = file[i]['type'];
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (validImageTypes.includes(fileType)) {
            setFile([...files,file[i]]);
        } else {
            setMessage("only images accepted");
        }
        //console.log("FILES: ", files);
    }
  } 
  const removeImage = (i:string) => {
     setFile(files.filter(x => x.name !== i));
  }

  async function rate() {
    const data:Rating = {cartId: Number(id), star: star, comment: comment};
    try{
        const formData = new FormData();
        files.forEach((file) => formData.append("image", file) );
        formData.append("cartId", String(id));
        formData.append("star", String(star));
        formData.append("comment", comment);
        await axios.post('/api/cart/rate/', formData).then(() => { router.back() });
    }catch(error){
        ////console.log(error)
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
                <div>
                    <div className="p-3 md:w-1/4 bg-white rounded-md">
                        <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">{message}</span>
                        <div className="h-32 relative border-2 items-center rounded-md cursor-pointer bg-gray-300 border-gray-400 border-dotted">
                            <input type="file" onChange={handleFile} className="h-full w-full bg-green-200 opacity-0 z-10 absolute" multiple={true} name="files[]" />
                            <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0"> 
                                <div className="flex flex-col">
                                    <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
                                    <span className="text-[12px]">{`Drag and Drop a file`}</span>
                                </div>
                            </div> 
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {files.map((file, key) => {
                                return (
                                    <div key={key} className="relative">
                                        <div
                                            onClick={() => {
                                                removeImage(file.name);
                                            }}
                                            className="right-1 hover:text-white cursor-pointer bg-red-400"
                                        >Remove</div>            
                                        <img className="h-20 w-20 rounded-md" src={URL.createObjectURL(file)}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div> 
                </div>
                {/* <div className='max-w-4xl space-y-6'>
                    <label>
                        <input 
                            type='file' 
                            hidden 
                            onChange={({target}) => {
                                if(target.files){
                                    const file = target.files[0];
                                    setSelectedImage(URL.createObjectURL(file));
                                    setSelectedFile(file);
                                }
                            }}
                        />
                        <div className='w-80 aspect-video rounded flex border-2 border-dashed cursor-pointer'>
                            {selectedImage? (
                                <img src={selectedImage} alt=""/>
                            ) : (
                                <span>Select Image</span>
                            )}
                        </div>
                    </label>
                </div> */}
                <div className="w-32 btn btn-primary">
                    <button onClick={()=>rate()}>Save</button>
                </div>
            </div>
        </section>
    </div>
  )
}
