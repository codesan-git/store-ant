import styles from '../../styles/Form.module.css'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from "../../lib/prisma"
import { getSession} from 'next-auth/react';
import Navbar from '../navbar'

interface FetchData{
    product:{
        id: Number,
        name: string,
        price: Number,
        stock: Number,
        category: Category,
        image: string
    }
}

interface Category{
  id: Number,
  category: string
}

export default function CreateShop({product} : FetchData) {    
  const router = useRouter();
//   const {id} = router.query;

  return (
    <div>
        <Navbar/>
        <div className="my-5 mx-2">
            <div>
                <h1>Product Detail</h1>
            </div>
            <div id='content' className="flex flex-row ">
                <section className='w-2/3 p-4'>
                    <div id='product-details' className="flex flex-row space-x-10">
                        <div id='product-image-container' className="bg-blue-gray-300 w-72 h-72 py-14">
                            <img className='object-fill'
                                src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" 
                                alt=''
                            />
                        </div>
                        <div id='product-name-and-price' className=''>
                            <h1 className='text-6xl mb-4'>{product.name}</h1>
                            <div className='flex flex-row space-x-2 mb-2'>
                                <h1>{product.category.category}</h1>
                                <h1 className='text-gray-700'>•</h1>
                                <h1>Stock {renderStockCount(product.stock)}</h1>
                                <h1 className='text-gray-700'>•</h1>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-yellow-500">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                                <h1>4.3</h1>
                            </div>
                            <h1 className='text-4xl'>Rp.{product.price.toString()}</h1>
                        </div>
                    </div>
                    <div className='my-4 w-100'>
                        <h1 className='text-2xl mb-2'>Description</h1>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                            Fugiat quia doloribus est atque consequuntur in aut, cupiditate, iste velit, corrupti excepturi? Aspernatur maiores doloribus obcaecati possimus 
                            sapiente, eos mollitia doloremque.
                        </p>
                    </div>
                    <div id='button-group' className='mt-4 w-auto space-x-4'>
                        <button className='w-24 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                            Beli
                        </button>
                        <button className='w-36 btn bg-green-400 hover:bg-green-300 hover:border-gray-500 text-white border-transparent'>
                            Add to Cart
                        </button>
                    </div>
                </section>
                <section className='w-1/3 p-4'>
                    <h1>store details</h1>
                </section>
            </div>
        </div>
    </div>
  )
}

const renderStockCount = (stockNumber: Number) => {
    if(stockNumber.valueOf() > 0) {
        return <span className='text-cyan-600'>{stockNumber.toString()}</span>
    } else {
        return <span className='text-red-500'>{stockNumber.toString()}</span>
    }
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
            category: true,
            image: true
        }
    })
    return{
        props:{
            product
        }
    }
}