import { Fragment } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { HiClipboard, HiOutlineClipboard, HiStar } from "react-icons/hi2";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import { Address, Product, Profile, Shop, User, Category } from "@prisma/client";
import Image from "next/image";

interface Props {
  product: (Product &
  {
    shop: Shop
    & {
      user: User
      & {
        profile: Profile
        & {
          addresses: Address[]
        }
      }
    },
    category: Category
  }),
  onClick?: () => void,
}

const ProductCard = ({ product, onClick }: Props) => {
  const onCardClick = () => {
    if (onClick != null) onClick();
  }
  //console.log(product?.image?.split(",")[0]);

  const mainAddress = product.shop.user.profile.addresses[0];

  console.log(`main address: ${mainAddress}`);

  return (
    <Fragment>
      <div id="card" className="w-64 lg:w-5/6 bg-white h-96 rounded-lg shadow-lg relative">
        <Image
          src={product.image!.split(",")[0]}
          width={1500}
          height={1500}
          alt="no image available"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src =
              "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
          }}
          className="w-full h-1/2 object-cover rounded-t-lg"
        />
        <div id="card-body" className="w-64 lg:w-auto rounded-b-lg p-4 h-1/2 space-y-2 bg-gray-300">
          <p className="truncate overflow-hidden">{product.name}</p>
          <h1 className="text-xl font-bold">
            Rp {product.price}
          </h1>
          <h1 className="text-sm">
            Qty: {product.stock}
          </h1>
          <div className="text-sm flex flex-row items-center space-x-1">
            <HiLocationMarker className="fill-gray-600" />
            {mainAddress.city}
          </div>
          <div className="flex flex-row space-x-2 text-sm">
            <div id="rating-container" className="flex flex-row items-center space-x-1">
              <HiStar className="fill-yellow-800 w-5 h-5 " />
              <span>{product.averageRating}</span>
            </div>
            <div>
              |
            </div>
            <div className="flex flex-row items-center space-x-1">
              <HiOutlineClipboard />
              <span>{product.category.category}</span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductCard;