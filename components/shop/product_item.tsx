import { Fragment } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { HiClipboard, HiOutlineClipboard, HiStar } from "react-icons/hi2";

const ProductItem = () => {
  return (
    <Fragment>
      <div id="card" className="w-5/6 bg-white h-96 rounded-lg">
        <div id="product-image-container" className="rounded-t-lg bg-green-500 h-1/2">

        </div>
        <div id="card-body" className="rounded-b-lg p-4 h-1/2 space-y-2 bg-gray-300">
          <p className="truncate overflow-hidden">Nama Barang Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur atque non, delectus animi qui, perspiciatis accusantium dolorem quos nesciunt nostrum harum ea ut minus velit porro fugiat, iste deleniti tenetur.</p>
          <h1 className="text-xl font-bold">
            Rp 200,000
          </h1>
          <h1 className="text-sm">
            Qty: 200
          </h1>
          <div className="text-sm flex flex-row items-center space-x-1">
            <HiLocationMarker className="fill-gray-600" />
            Tangerang Selatan
          </div>
          <div className="flex flex-row space-x-2 text-sm">
            <div id="rating-container" className="flex flex-row items-center space-x-1">
              <HiStar className="fill-yellow-800 w-5 h-5 "/>
              <span>5.0</span>
            </div>
            <div>
              |
            </div>
            <div className="flex flex-row items-center space-x-1">
              <HiOutlineClipboard/>
              <span>Alat Tulis</span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductItem;