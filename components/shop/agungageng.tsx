import { FC } from 'react'

interface AgungagengProps {
  shop: {
    id: Number,
    shopName: string,
    averageRating: Number,
    balance: number
  },
  kodok: () => void,
  onKerang:(products:Product) => void,
  kerang: Product
}
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


const Agungageng: FC<AgungagengProps> = ({ shop, kodok, kerang, onKerang }) => {
  return (
    <>
      <div>agungageng {shop.shopName}</div>
      <button onClick={()=>kodok()}>ini button</button>
      <button onClick={()=>onKerang(kerang)}>KerangBtn</button>
    </>
  )
}

export default Agungageng