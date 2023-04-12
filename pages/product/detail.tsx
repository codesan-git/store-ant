import styles from '../../styles/Form.module.css'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from "../../lib/prisma"
import Image from 'next/image'
import Link from 'next/link'
import { getSession} from 'next-auth/react';
import Navbar from '../navbar'

interface FetchData{
    product:{
        id: Number,
        name: string,
        price: Number,
        stock: Number,
        category: Category
    }
}

interface Category{
  id: Number,
  category: string
}

export default function CreateShop({product} : FetchData) {    
  const router = useRouter();
  const {id} = router.query;

  return (
    <div>
        <Navbar/>
        <div>
            <section className="w-3/4 mx-auto flex flex-col gap-10">
                <div className="title">
                    <h1 className="text-gray-800 text-4xl font-bold py-4">Product Detail</h1>
                </div>

                <div>
                    <figure>
                        <img
                        src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                        alt="image!"
                        />
                    </figure>
                    <p>{product.name}</p>
                    <p>{product.category.category}</p>
                    <p>{String(product.price)}</p>
                    <p>{String(product.stock)}</p>
                </div>
            </section>
        </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const product = await prisma.product.findFirst({
        where: { id: Number(context.query.id)},
        select:{
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true
        }
    })
    return{
        props:{
            product
        }
    }
}