import { Fragment } from "react";

const ProductItem = () => {
  return (
    <Fragment>
      <div id="card" className="w-5/6 bg-white h-96 rounded-lg">
        <div id="product-image-container" className="rounded-t-lg bg-green-500 h-1/2">

        </div>
        <div id="card-body" className="rounded-b-lg p-4 h-1/2 bg-gray-300">
          <h1>Nama Barang</h1>
          <h1>Rp 200,000</h1>
          <h1>Qty: 200</h1>
          <div>Tangerang Selatan</div>
          <div>5.0 | Alat Tulis</div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductItem;