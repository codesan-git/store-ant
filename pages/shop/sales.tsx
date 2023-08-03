// import React from 'react'
// import { GetServerSideProps } from "next";
// import { prisma } from "../../lib/prisma";
// import { Product } from '@prisma/client';
// import { getSession } from 'next-auth/react';
// import Navbar from '../navbar';

// interface SalesReport{
//   finishedOrders: ProductInCart[]
//   soldProducts: ProductInCart[],
//   cancelled: ProductInCart[],
//   returnedOrders: ProductInCart[],
//   returnedProducts: ProductInCart[],
//   allOrders: ProductInCart[],
//   revenue: number
// }

// interface ProductInCart {
//   id: number,
//   count: number,
//   status: Status,
//   product: Product
// }

// export default function Sales({finishedOrders, soldProducts, cancelled, returnedOrders, returnedProducts, allOrders, revenue} : SalesReport) {
//   return (
//     <div>
//       <Navbar/>
//       <p className="card-title mt-5">Products Sold: {soldProducts?.length} Products in {finishedOrders?.length} Orders | {Number.parseFloat(String(finishedOrders?.length / allOrders?.length * 100)).toFixed(2)}%</p>
//       <div className='flex-col grid lg:grid-cols-3 gap-10'>
//         {soldProducts?.map((sold) => (
//           <div
//           className="card bg-base-100 shadow-xl text-md w-full"
//           key={String(sold?.id)}
//           >
//               <div className="flex">
//                   <div className="card-body py-5">
//                       <figure className="rounded-md h-40 w-40">
//                           {sold?.product.image? (
//                               <img src={sold?.product.image.split(",")[0]}/>
//                           ) : (
//                               <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
//                           )}
//                       </figure>
//                   </div>
//                   <div className="w-full">
//                       <div className="py-5 px-10 flex w-full">
//                           <div>
//                               <h2 className="card-title">{sold?.product.name}</h2>
//                               <p>{sold?.product.price}</p>
//                               <p>Amount Sold: {sold?.count}</p>
//                           </div>
//                       </div>
//                   </div>
//               </div>
//           </div>
//         ))}
//       </div>
//       <p className="card-title mt-5">Products Returned: {returnedProducts?.length} Products in {returnedOrders?.length} Orders | {Number.parseFloat(String(returnedOrders?.length / allOrders?.length * 100)).toFixed(2)}%</p>
//       <div className='flex-col grid lg:grid-cols-3 gap-10'>
//         {returnedProducts?.map((returned) => (
//           <div
//           className="card bg-base-100 shadow-xl text-md w-full"
//           key={String(returned?.id)}
//           >
//               <div className="flex">
//                   <div className="card-body py-5">
//                       <figure className="rounded-md h-40 w-40">
//                           {returned?.product.image? (
//                               <img src={returned?.product.image.split(",")[0]}/>
//                           ) : (
//                               <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
//                           )}
//                       </figure>
//                   </div>
//                   <div className="w-full">
//                       <div className="py-5 px-10 flex w-full">
//                           <div>
//                               <h2 className="card-title">{returned?.product.name}</h2>
//                               <p>{returned?.product.price}</p>
//                               <p>Amount Returned: {returned?.count}</p>
//                           </div>
//                       </div>
//                   </div>
//               </div>
//           </div>
//         ))}
//       </div>
//       <p className="card-title mt-5">Orders Cancelled: {cancelled?.length} Orders | {Number.parseFloat(String(cancelled?.length / allOrders?.length * 100)).toFixed(2)}%</p>
//       <p className="card-title mt-5">Total Orders: {allOrders?.length} Orders</p>
//       <p className="card-title mt-5">Total Revenue: Rp.{revenue},-</p>
//     </div>
//   )
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const session = await getSession(context);
//     const shop = await prisma.shop.findFirst({
//         where:{userId: session?.user?.id!}
//     })
//     let i = 0, j = 0;
//     let isSame = false;

//     const finishedOrders = await prisma.productInCart.findMany({
//       where: { product: {shopId: shop?.id!}, status: Status.FINISHED },
//       select: {
//         id: true,
//         count: true,
//         status: true,
//         product: true
//       }
//     });
    
//     let soldProducts = new Array();
//     soldProducts.push(finishedOrders[0]);
//     for(i = 1; i < finishedOrders.length; i++){
//       isSame = false;
//       for(j = 0; j < soldProducts.length; j++){
//         if(finishedOrders[i].product.id == soldProducts[j].product.id){
//           console.log("count sp: ", soldProducts[j].count);
//           console.log("count s: ", finishedOrders[j].count);
//           soldProducts[j].count += finishedOrders[i].count;
//           console.log("count sp after: ", soldProducts[j].count);
//           isSame = true;
//           break;
//         }
//       }
//       if(!isSame){
//         soldProducts.push(finishedOrders[i]);
//       }
//     }

//     const cancelled = await prisma.productInCart.findMany({
//         where: { product: {shopId: shop?.id!}, status: Status.CANCELED },
//         select: {
//           id: true,
//           count: true,
//           status: true,
//           product: true
//         }
//     });

//     const returnedOrders = await prisma.productInCart.findMany({
//         where: { product: {shopId: shop?.id!}, status: Status.RETURNED },
//         select: {
//           id: true,
//           count: true,
//           status: true,
//           product: true
//         }
//     });
    
//     let returnedProducts = new Array();
//     returnedProducts.push(returnedOrders[0]);
//     for(i = 1; i < returnedOrders.length; i++){
//       isSame = false;
//       for(j = 0; j < returnedProducts.length; j++){
//         if(returnedOrders[i].product.id == returnedProducts[j].product.id){
//           console.log("count sp: ", returnedProducts[j].count);
//           console.log("count s: ", returnedOrders[j].count);
//           returnedProducts[j].count += returnedOrders[i].count;
//           console.log("count sp after: ", returnedProducts[j].count);
//           isSame = true;
//           break;
//         }
//       }
//       if(!isSame){
//         returnedProducts.push(returnedOrders[i]);
//       }
//     }

//     const allOrders = await prisma.productInCart.findMany({
//         where: { 
//           AND: [
//             {
//               product: {shopId: shop?.id!}, 
//             },
//             {
//               AND:[
//                 {
//                   status: {not: Status.INCART}
//                 },
//                 {
//                   status: {not: Status.DELIVERING}
//                 },
//                 {
//                   status: {not: Status.UNPAID}
//                 }            
//               ]
//             }
//           ]
//         },
//         select:{
//             id: true,
//             count: true,
//             status: true,
//             product: true
//         }
//     });

//     let revenue = 0;

//     allOrders.forEach(order => {
//         revenue += order.product.price * order.count;
//     });

//     return {
//       props: {
//         finishedOrders: JSON.parse(JSON.stringify(finishedOrders)),
//         soldProducts: JSON.parse(JSON.stringify(soldProducts)),
//         cancelled: JSON.parse(JSON.stringify(cancelled)),
//         returnedOrders: JSON.parse(JSON.stringify(returnedOrders)),
//         returnedProducts: JSON.parse(JSON.stringify(returnedProducts)),
//         allOrders: JSON.parse(JSON.stringify(allOrders)),
//         revenue
//       },
//     };
// };
  