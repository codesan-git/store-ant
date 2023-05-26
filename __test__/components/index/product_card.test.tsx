import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "@/components/index/product_card";
import { Category } from "@prisma/client";

interface Product {
  id: string | number,
  name: string
  price: number,
  stock: number,
  category?: Category,
  image: string | null,
  averageRating: number
}

describe('Product Card', () => {

  const dummyProduct: Product = {
    id: "1",
    name: "haha",
    price: 12000,
    stock: 12,
    category: {
      id:4,
      category: "Makanan"
    },
    image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg",
    averageRating: 3
  }

  it('should render a product correctly when it is given a product only', async () => {

    //  ARRANGE
    const component = <ProductCard product={dummyProduct}/>; //TODO: move to beforeEach();

    const result = render(component);

    const productTitle = await result.findByTestId('product-title');
    const productCategory = await result.findByTestId('product-category');
    const productPrice = await result.findByTestId('product-price');
    const productStock = await result.findByTestId('product-stock');

    //  ACT

    //  ASSERT
    expect(productTitle).toHaveTextContent(dummyProduct.name);
    expect(productCategory).toHaveTextContent(dummyProduct.category?.category!);
    expect(productPrice).toHaveTextContent(`Rp. ${dummyProduct.price}`);
    expect(productStock).toHaveTextContent(`Qty. ${dummyProduct.stock}`)
  });
});