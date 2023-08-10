import { Product } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

interface Props {
  htmlElementId: string,
  selectProductCallback: () => any;
}

const ReviewModal = ({htmlElementId: id, selectProductCallback} : Props) => {

  const [starValue, setStarValue] = useState<number>(5);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); //TODO: pass the setState function from transactions.tsx
  const [comment, setComment] = useState<string>("");

  const {currentRateProductName, currentCartItemId} = selectProductCallback();

  const handleImageUpload = (e: any) => {

    // //console.log(`obj list: ${obj.target}`);

    let files = e.target.files;

    //console.log(`filecount in event's target: ${files.length}`)
    //console.log(`filecount in selectedFiles Sate: ${selectedFiles.length}`)

    // if((selectedFiles.length + files.length) > 5 ) return;

    // for (const file of files){
    //   //console.log(`filename: ${file}`);
    // }

    setSelectedFiles([...selectedFiles, ...files]);
  }

  const handleRemoveImage = (imageName: string) => {
    setSelectedFiles(selectedFiles.filter(file => file.name !== imageName));

    /* TODO: Fix bug related to file removal logic
    *
    *  The current way we remove files is still a simple solution. The bug arises when you upload a file with the same file names, deleting
    *  one of them would result in the removal of both of them. Maybe change the logic into remove at index instead.
    */
  }

  const onSubmit = async () => {
    try{
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("image", file) );
      formData.append("cartId", String(currentCartItemId));
      formData.append("star", String(starValue));
      formData.append("comment", comment);
      await axios.post('/api/cart/rate/', formData);
    }catch(error){
      //console.log(`Error in posting data. Error: ${error}`);
    }

    setStarValue(5);
    setSelectedFiles([]);
    setComment("");
  }

  const onClose = () => {
    setSelectedFiles([]);
    setStarValue(1); 
  }

  const renderInitialImageInput = () => {

    if(selectedFiles.length > 0) return;

    return (
      <>
        <div className='border-gray-600 border border-dashed rounded-xl flex justify-center items-center h-24 w-full relative'>
          <input type="file" accept='.jpg, .jpeg, .png, .webp' multiple name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute' 
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
                  <div onClick={() => handleRemoveImage(file.name)} className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold absolute -right-0 -top-2 sm:right-3 hover:cursor-pointer">
                    ✕
                  </div>
                  <img src={URL.createObjectURL(file)} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-cover border border-gray-600" />
                </div>
            )
          }
          {
            (selectedFiles.length > 0 && selectedFiles.length < 5) 
            ? <div className='border-gray-600 border border-dashed rounded-lg flex justify-center items-center w-12 h-12 sm:w-16 sm:h-16 relative'>
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
      <div id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box space-y-2">
          <div className="w-full flex justify-end" onClick={onClose}>
            <label htmlFor={id} className="text-lg font-bold">✕</label>
          </div>
          <div id="product-box" className="p-2 space-x-2 flex flex-row bg-blue-gray-100">
            {/* <img src={product.image} alt="none" className="w-10 h-10 border object-cover"/> */} {/*This won't work for some reason*/}
            <img src={`https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg`} alt="none" className="w-10 h-10 border object-cover"/> 
            <h1>{currentRateProductName}</h1>
          </div>
          <form id="review-form" action="" className="pt-4 space-y-1">
            <div className="rating rating-lg flex justify-center items-center mb-2">
              <input type="radio" name="rating-1" className="mask mask-star" onClick={() => setStarValue(1)}/>
              <input type="radio" name="rating-1" className="mask mask-star" onClick={() => setStarValue(2)}/>
              <input type="radio" name="rating-1" className="mask mask-star" onClick={() => setStarValue(3)}/>
              <input type="radio" name="rating-1" className="mask mask-star" onClick={() => setStarValue(4)}/>
              <input type="radio" name="rating-1" className="mask mask-star" onClick={() => setStarValue(5)}/>
            </div>
            {renderInitialImageInput()}
            {renderSelectedImages()}
            <div id="commet-input-group" className="flex flex-col space-y-1">
              <label htmlFor="" className="font-extrabold">Komentar</label>
              <textarea value={comment} aria-label="Example: lorem" name="user-comment" id="comment-input-field" onChange={(e) => setComment(e.target.value)} className="h-40 p-2 rounded border border-gray-600"/>
            </div>
          </form>
          <div className="" onClick={onSubmit}>
            <label htmlFor={id} className="h-10 w-full rounded text-white bg-indigo-700 hover:bg-indigo-900 hover:cursor-pointer flex justify-center items-center">
              Submit
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewModal;