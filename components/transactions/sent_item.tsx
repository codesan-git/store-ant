import { Product, TransactionStatus } from "@prisma/client";
import axios from "axios";
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
  cost:{
    etd: string,
    value: number
  }[],
  service: string
}
  
const SentItemModal = ({htmlElementId: id, selectProductCallback} : Props) => {
  const {
    selectedTransaction
  } = selectProductCallback();
  const [isUsingBalance, setUsingBalance] = useState<boolean>(false);
  const [cost, setCost] = useState<Cost>();
  const router = useRouter();

  let i, totalPrice = 0;
  for(i = 0; i < selectedTransaction?.order.length; i++){
    totalPrice += (selectedTransaction?.order[i].product.price * selectedTransaction?.order[i].count);
  }
    
  const onClose = () => {
    console.log("close"); 
    console.log("transaction modal ", selectedTransaction);
  }
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const handleChange = () => {
    setUsingBalance(!isUsingBalance);
    console.log(isUsingBalance);
  };

  async function onBayar() {
    const params : Params = {id: selectedTransaction.id, price: totalPrice + cost?.cost[0].value!};
    const transactionToken : TransactionToken = (await axios.post(`http://localhost:3000/api/cart/pay`, params)).data;
    window.open(transactionToken.redirectUrl);
  }

  async function onBayarDenganSaldo() {
    const params : Params = {id: selectedTransaction.id, price: totalPrice + cost?.cost[0].value!};
    const transactionToken : TransactionToken = (await axios.post(`http://localhost:3000/api/cart/paywithbalance`, params)).data;
    window.open(transactionToken.redirectUrl);
  }

  async function onSentItem() {
    const terimaTransactions = await axios.put(`http://localhost:3000/api/shop/sentItem`, {
        id: selectedTransaction?.id
    })
  }

  const onSubmit = async () => {
    onSentItem()
  }

  const getCost = async () => {
    let totalWeight = 0;
    let i: number;
    for(i = 0; i < selectedTransaction?.order.length; i++){
      totalWeight += selectedTransaction?.order[i].product.weight;
    }

    const data = {shopId: selectedTransaction?.shopId, totalWeight: totalWeight};
    console.log(data);
    try {
			const response = await axios.post(`http://localhost:3000/api/cart/shipping`, data);
			const { cost: costData } =  response.data;
      console.log("cost: ", costData);
      setCost(costData);
    } catch (error) {
			
    }
  };

  useEffect(() => {
    getCost();
  }, []);

  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle"/>
      <div id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box space-y-2">
          <div className="flex">
            <h1 className="text-lg font-bold">Payment</h1>
            <div className="w-full flex justify-end" onClick={onClose}>
                <label htmlFor={id} className="text-lg font-bold">✕</label>
            </div>
          </div>
          {selectedTransaction?.order.map((order: any)=> (
            <div key={order.id} id="product-box" className="p-2 space-x-2 flex flex-row">
            <div id="product-detail-img-container" className=" flex justify-center items-center">
                <img className="w-20 h-20 object-cover" 
                    src={`http://localhost:3000/${order?.product.image.split(",")[0]}`}
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
          <p>Kurir: JNE</p>
          <p>Layanan: {cost?.service}</p>
          <p>Estimasi Pengiriman: {cost?.cost[0].etd} hari</p>
          <p>Biaya: {formatter.format(cost?.cost[0].value!)}</p>
          <h1 className="text-md">Total: {formatter.format(totalPrice + cost?.cost[0].value!)}</h1>
          <form id="review-form" action="" className="py-1 space-y-1">
            <label>
                <input type="checkbox" checked={isUsingBalance} onChange={handleChange}/>
                Bayar dengan Saldo
            </label>
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

export default SentItemModal;