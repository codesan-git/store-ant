import styles from '../../styles/Form.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from "../../lib/prisma"
import Image from 'next/image'
import Link from 'next/link'

interface FetchData{
    product:{
        id: Number,
        name: string,
        price: Number,
        stock: Number
    }
}

export default function CreateShop({product} : FetchData) {    
  const [name, setName] = useState(product.name);   
  const [price, setPrice] = useState(String(product.price));   
  const [stock, setStock] = useState(String(product.stock));
  const router = useRouter();
  const {id} = router.query;

  async function update(id: string) {
    try{
        console.log("update")
        fetch(`http://localhost:3000/api/product/${id}`, {
            body: JSON.stringify({
                name: name,
                price: price,
                stock: stock
            }),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PATCH'
        }).then(()=> { 
            setName('')
            setPrice('') 
            setStock('')  
            router.back() 
        })
    }catch(error){
        console.log(error)
    }
  }

  const handleSubmit = async(id: string) => {
    try{
        update(id)
    }catch(error){
        console.log(error)
    }
  }

  return (
    <div>
        <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div className="title">
                <h1 className="text-gray-800 text-4xl font-bold py-4">Update Product</h1>
                <p className="mx-auto text-gray-400">Update product</p>
            </div>

            <form onSubmit={e=>{e.preventDefault(); handleSubmit(String(id))}} className="flex flex-col gap-5">
                <div className={styles.input_group}>
                    <input type="text" name="name" placeholder="Name" className={styles.input_text} value={name} onChange={e => setName(e.target.value)}/>
                    {/* <span className="icon flex items-center px-4">
                        <HiAtSymbol size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <input type="number" name="price" placeholder="Price" className={styles.input_text} value={price} onChange={e => setPrice(e.target.value)}/>
                    {/* <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span> */}
                </div>                
                <div className={styles.input_group}>
                    <input type="number" name="stock" placeholder="Qty" className={styles.input_text} value={stock} onChange={e => setStock(e.target.value)}/>
                    {/* <span className="icon flex items-center px-4" onClick={()=>setShow(!show)}>
                        <HiKey size={25}/>
                    </span> */}
                </div>
                <div className={styles.input_group}>
                    <button type="submit" className={styles.button}>Save</button>
                </div>
            </form>
        </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const product = await prisma.product.findFirst({
        where: { id: Number(context.query.id)},
        select:{
            id: true,
            name: true,
            price: true,
            stock: true
        }
    })
    return { props: {product} }
}