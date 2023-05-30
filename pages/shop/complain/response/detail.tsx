import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { User, Shop, Status } from "@prisma/client";

interface ShopComment {
    shopComment: {
        id: number;
        image: string;
        description: string;
    }
}

interface CartId {
  id: Number;
}

export default function Detail({ shopComment }: ShopComment) {
  const router = useRouter();

  async function onReturn(id: Number) {
    const cartId: CartId = {id: id};
    try{
        fetch('http://localhost:3000/api/shop/rejectreturn', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.reload())
      }catch(error){
          //console.log(error)
      }
  }

  console.log(shopComment);
  return (
    <div>
      <div className="card bg-base-100 shadow-xl text-md">
        <div>
          <div className="card-body py-5">
            {shopComment.image ? (
              <div className="rounded-md h-40 w-40 flex gap-5">
                {shopComment.image.split(",").map((image) => (
                  <img
                    className="rounded-md w-40 h-40"
                    src={`http://localhost:3000/${image}`}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src =
                        "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg";
                    }}
                  />
                ))}
              </div>
            ) : (
              <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
            )}
          </div>
          <div className="w-full">
            <div className="py-5 px-10 flex w-full">
                <p>Deskripsi: {shopComment.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const shopComment = await prisma.shopComment.findFirst({
    where: { 
      complainId: Number(id)
     },
    select: {
      id: true,
      image: true,
      description: true,
    },
  });

  return {
    props: {
        shopComment: JSON.parse(JSON.stringify(shopComment)),
    },
  };
};
