import { Fragment } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { HiClipboard, HiOutlineClipboard, HiStar } from "react-icons/hi2";

interface Product {
  id: string,
  name: string,
  price: number,
  stock: number,
  category: Category,
  image: string,
  averageRating: number
}

interface Category{
  id: Number,
  category: string
}

interface Props {
  product: Product
}

const ProductItem = ({ product } : Props) => {
  return (
    <Fragment>
      <div id="card" className="w-64 lg:w-5/6 bg-white h-96 rounded-lg">
        {/* <div id="product-image-container" className="object-cover rounded-t-lg bg-green-500 h-1/2"></div> */}
        <img 
          src={`http://localhost:3000/${product.image.split(",")[0]}`} 
          alt="no image available" 
          className="w-full h-1/2 object-cover rounded-t-2xl"
        />
        <div id="card-body" className="w-64 lg:w-auto rounded-b-lg p-4 h-1/2 space-y-2 bg-gray-300">
          <p className="truncate overflow-hidden">{product.name}</p>
          <h1 className="text-xl font-bold">
            Rp {product.price}
          </h1>
          <h1 className="text-sm">
            Qty: {product.stock}
          </h1>
          <div className="text-sm flex flex-row items-center space-x-1">
            <HiLocationMarker className="fill-gray-600" />
            Tangerang Selatan
          </div>
          <div className="flex flex-row space-x-2 text-sm">
            <div id="rating-container" className="flex flex-row items-center space-x-1">
              <HiStar className="fill-yellow-800 w-5 h-5 "/>
              <span>{product.averageRating}</span>
            </div>
            <div>
              |
            </div>
            <div className="flex flex-row items-center space-x-1">
              <HiOutlineClipboard/>
              <span>{product.category.category}</span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductItem;