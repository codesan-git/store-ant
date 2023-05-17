import { Product } from "@prisma/client";
import { useState } from "react";

interface Props {
  id: string
  product: Product
}

const ReviewModal = ({id, product} : Props) => {

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); //TODO: pass the setState function from transactions.tsx

  const handleImageUpload = (e: any) => {

    // console.log(`obj list: ${obj.target}`);

    let files = e.target.files;

    console.log(`filecount in event's target: ${files.length}`)
    console.log(`filecount in selectedFiles Sate: ${selectedFiles.length}`)

    // if((selectedFiles.length + files.length) > 5 ) return;

    // for (const file of files){
    //   console.log(`filename: ${file}`);
    // }

    setSelectedFiles([...selectedFiles, ...files]);

  }

  const renderInitialImageInput = () => {
    if(selectedFiles.length > 0) return;

    return (
      <>
        <div className='border-gray-600 border border-dashed rounded-xl flex justify-center items-center h-24 w-full relative'>
          <input type="file" accept='.jpg, .jpeg, .png, .webp' multiple={true} name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute' 
            onChange={handleImageUpload}
          />
          <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-row'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            &nbsp;Upload Image
          </label>
        </div>
      </>
    );
  }

  const renderSelectedImages = () => {
    if(selectedFiles)
      return (
        <div className="grid grid-cols-5 gap-2">
          {
            selectedFiles.map( 
              (file, key) => 
                <div key={key} className="relative">
                  {/* <img src={URL.createObjectURL(file)} alt="" /> */}
                  <div className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold font-bold absolute -right-0 -top-2 hover:cursor-pointer">✕</div>
                  <img src={URL.createObjectURL(file)} alt="" className="h-12 w-12 object-cover" />
                </div>
            )
          }
          {
            (selectedFiles.length > 0 && selectedFiles.length < 5) 
            ? <div className='border-gray-600 border border-dashed rounded-xl flex justify-center items-center w-16 h-16 w-full relative'>
                <input type="file" accept='.jpg, .jpeg, .png, .webp' multiple={true} name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute' 
                  onChange={handleImageUpload}
                />
                <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-row'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </label>
              </div>
            : <></>
          }
        </div>
      );

    return
  }
  

  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle"/>
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="w-full flex justify-end">
            <label htmlFor={id} className="text-lg font-bold">✕</label>
          </div>
          <div id="product-box" className="p-2 space-x-2 flex flex-row bg-blue-gray-100">
            {/* <img src={`https://localhost:3000/${product.image}`} alt="none" className="w-10 h-10 border object-cover"/> */} {/*This won't work for some reason*/}
            <img src={`https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg`} alt="none" className="w-10 h-10 border object-cover"/> 
            <h1>{product.name}</h1>
          </div>
          <form id="review-form" action="" className="pt-4 space-y-4">
            <div className="rating rating-lg flex justify-center  items-center">
              <input type="radio" name="rating-1" className="mask mask-star" />
              <input type="radio" name="rating-1" className="mask mask-star" checked />
              <input type="radio" name="rating-1" className="mask mask-star" />
              <input type="radio" name="rating-1" className="mask mask-star" />
              <input type="radio" name="rating-1" className="mask mask-star" />
            </div>
            {renderInitialImageInput()}
            {renderSelectedImages()}
            <div id="commet-input-group" className="flex flex-col space-y-1">
              <label htmlFor="" className="font-extrabold">Komentar</label>
              <textarea aria-label="Example: lorem" name="user-comment" id="comment-input-field" className="h-40 p-2 rounded border border-gray-600"/>
            </div>
            <button className='h-10 w-full rounded text-white bg-indigo-700' onClick={e => e.preventDefault}>
              Submit
            </button>
          </form>

        </div>
      </div>
    </>
  );
};

export default ReviewModal;