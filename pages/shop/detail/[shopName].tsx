import Navbar from '@/pages/navbar'
import getDataShop from './action/getDetailShop'
import { GetServerSideProps } from 'next'
import { getTypeShop } from '@/types'

import ShopHead from './components/ShopHead'
import ProductTabs from './components/ProductTabs'

interface Props {
    getShop: getTypeShop
}

export default function DetailShop({ getShop }: Props) {
    return <>
        <Navbar />
        <div className='hidden lg:block lg:px-44 lg:py-4'>
            <section>
                <ShopHead getShop={getShop} />
            </section>
            <section>
                <ProductTabs getShop={getShop} />
            </section>
        </div>
        <div className='lg:hidden'>
            <section>
                <ShopHead getShop={getShop} />
            </section>
            <section>
                <ProductTabs getShop={getShop} />
            </section>
        </div>
    </>
} 

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shop = context.query.shopName
    const shopGet = await getDataShop(String(shop))
    console.log(`shop`, shop)

    return {
        props: {
            getShop: shopGet
        },
    };
}
