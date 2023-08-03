import Navbar from '@/pages/navbar'
import { GetServerSideProps } from 'next'
import { getTypeShop } from '@/types'

import ShopHead from './components/ShopHead'
import ProductTabs from './components/ProductTabs'

import { prisma } from "@/lib/prisma";

import { Shop, Product } from '@prisma/client'

interface Props {
    getShop: Shop & {
        product: Product[]
    }
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
    const shop = context.query.shopName;
    //const shopGet = await getDataShop(String(shop));
    console.log(`shop`, shop);

    const getShop = await prisma.shop.findFirst({
        where: { shopName: String(shop) },
        include: {
            product: true
        }
    })

    return {
        props: {
            getShop: getShop
        },
    };
}
