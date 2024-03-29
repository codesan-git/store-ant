import { Product, TransactionStatus } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  htmlElementId: string,
  selectProductCallback: () => any;
}

interface Params {
  id: number;
  price: number
}

interface TransactionToken {
  token: string;
  redirectUrl: string;
}

interface Cost {
  cost: {
    etd: string,
    value: number
  }[],
  service: string
}

const CanceledModal = ({ htmlElementId: id, selectProductCallback }: Props) => {
  const {
    selectedTransaction
  } = selectProductCallback();
  const [isUsingBalance, setUsingBalance] = useState<boolean>(false);
  const [cost, setCost] = useState<Cost>();
  const router = useRouter();

  let i, totalPrice = 0;
  for (i = 0; i < selectedTransaction?.order.length; i++) {
    totalPrice += (selectedTransaction?.order[i].product.price * selectedTransaction?.order[i].count);
  }

  const onClose = () => {
    //console.log("close");
    //console.log("transaction modal ", selectedTransaction);
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const handleChange = () => {
    setUsingBalance(!isUsingBalance);
    //console.log(isUsingBalance);
  };

  async function onCanceled() {
    await axios.put(`/api/shop/cancel`, {
      id: selectedTransaction?.id
    }).then(router.reload)
  }

  const onSubmit = async () => {
    onCanceled()
  }

  const getCost = async () => {
    let totalWeight = 0;
    let i: number;
    for (i = 0; i < selectedTransaction?.order.length; i++) {
      totalWeight += selectedTransaction?.order[i].product.weight;
    }

    const data = { shopId: selectedTransaction?.shopId, totalWeight: totalWeight, transactionId: selectedTransaction?.id };
    //console.log("DATA: ", data);
    try {
      const response = await axios.post(`/api/cart/shipping`, data);
      const { cost: costData } = response.data;
      //console.log("cost: ", costData);
      setCost(costData);
    } catch (error) {

    }
  };

  useEffect(() => {
    getCost();
  }, [selectedTransaction]);

  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box space-y-2">
          <div className="flex">
            <h1 className="text-lg font-bold">Konfirmasi Pembatalan</h1>
            <div className="w-full flex justify-end" onClick={onClose}>
              <label htmlFor={id} className="text-lg font-bold">✕</label>
            </div>
          </div>
          {selectedTransaction?.order.map((order: any) => (
            <div key={order.id} id="product-box" className="p-2 space-x-2 flex flex-row">
              <div id="product-detail-img-container" className=" flex justify-center items-center">
                <Image
                  className="w-20 h-20 object-cover"
                  width={1500}
                  height={1500}
                  src={order?.product.image.split(",")[0]}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                  }}
                  alt=''
                />
              </div>
              <div className="mx-5">
                <h1 className="text-lg font-bold">{order?.product.name}</h1>
                <p>{formatter.format(order?.product.price)}</p>
                <p>Qty. {order?.count}</p>
              </div>
            </div>
          ))}
          <p className="text-lg font-bold">Detail Pengiriman</p>
          {cost?.cost?.length! > 0 ? (
            <div>
              <p>Kurir: JNE</p>
              <p>Layanan: {cost?.service}</p>
              <p>Estimasi Pengiriman: {cost?.cost[0]?.etd} hari</p>
              <p>Biaya: {formatter.format(cost?.cost[0]?.value!)}</p>
              <h1 className="text-md">Total: {formatter.format(totalPrice + cost?.cost[0]?.value!)}</h1>
              <div className="" onClick={onSubmit}>
                <label htmlFor={id} className="h-10 w-full rounded text-white bg-indigo-700 hover:bg-indigo-900 hover:cursor-pointer flex justify-center items-center">
                  Terima
                </label>
              </div>
            </div>
          ) : (
            <div>
              <p>{cost?.service}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CanceledModal;