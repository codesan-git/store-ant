import React from "react";
import { fireEvent, queryByTestId, render, screen } from "@testing-library/react";
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

  const dummyProduct: Product = { //TODO: Move dummy data into seperate module
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

  const onClick = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  //We can mock functions this way, but we can also mock functions from modules

  afterEach(() => {
    jest.clearAllMocks(); //We have to do this because after each mock function call, it increments the counter in the mock. 
    //So if we click the funciton again in the next it, and you expect it to be called once, it will return a failure because you haven't cleared it and it now totals to 2
  });

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

  it('should not render the product actions buttons when no onEdit and onDelete functions are passed', async () => {

    /*  Note regarding findById
    *   
    *   The standard getBy methods throw an error when they can't find an element, 
    *   so if you want to make an assertion that an element is not present in the DOM, you can use queryBy APIs instead
    *   
    *   https://stackoverflow.com/questions/52783144/how-do-you-test-for-the-non-existence-of-an-element-using-jest-and-react-testing
    */ 
    
    // ARRANGE
    const component = <ProductCard product={dummyProduct}/>
    const result = render(component);

    const productActionButtonsContainer = result.queryByTestId('product-action-buttons-container');
    const editButton = result.queryByTestId('edit-button');
    const deleteButton = result.queryByTestId('delete-button');

    // ACT

    // ASSERT
    expect(productActionButtonsContainer).toBeNull();
    expect(editButton).toBeNull();
    expect(deleteButton).toBeNull();
  });

  it('should render the product action buttons when onEdit and onDelete functions are passed', async () => {
    // ARRANGE
    const component = <ProductCard product={dummyProduct} onEdit={onEdit} onDelete={onDelete}/>
    const result = render(component);

    const productActionButtonsContainer = result.queryByTestId('product-action-buttons-container');
    const editButton = result.queryByTestId('edit-button');
    const deleteButton = result.queryByTestId('delete-button');
    
    // ACT

    // ASSERT
    expect(productActionButtonsContainer).not.toBeNull();
    expect(productActionButtonsContainer).toContainElement(editButton);
    expect(productActionButtonsContainer).toContainElement(deleteButton);
    expect(editButton).not.toBeNull();
    expect(deleteButton).not.toBeNull();
  });

  it('should call the passed onEdit function only once when Edit is clicked', async () => {
    // ARRANGE
    const component = <ProductCard product={dummyProduct} onEdit={onEdit} onDelete={onDelete}/>
    const result = render(component);

    const editButton = result.getByTestId('edit-button');

    // ACT
    fireEvent.click(editButton);

    // ASSERT
    expect(onEdit).toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('should call the passed onEdit function with the correct arguments', async () => {
    // ARRANGE
    const component = <ProductCard product={dummyProduct} onEdit={onEdit} onDelete={onDelete}/>
    const result = render(component);

    const editButton = result.getByTestId('edit-button');

    // ACT
    fireEvent.click(editButton);

    // ASSERT
    expect(onEdit).toHaveBeenCalledWith(dummyProduct.id.toString());
  });

  it('should call the passed onDelete function only once when Delete is clicked', async () => {
    // ARRANGE
    const component = <ProductCard product={dummyProduct} onEdit={onEdit} onDelete={onDelete}/>
    const result = render(component);

    const deleteButton = result.getByTestId('delete-button');

    // ACT
    fireEvent.click(deleteButton);

    // ASSERT
    expect(onDelete).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('should call the passed onEdit function with the correct arguments', async () => {
    // ARRANGE
    const component = <ProductCard product={dummyProduct} onEdit={onEdit} onDelete={onDelete}/>
    const result = render(component);

    const deleteButton = result.getByTestId('delete-button');

    // ACT
    fireEvent.click(deleteButton);

    // ASSERT
    expect(onDelete).toHaveBeenCalledWith(dummyProduct.id.toString());
  });

  it('should call the passed onClick function when the card is clicked', async () => {
    // ARRANGE
    const component = <ProductCard product={dummyProduct} onClick={onClick}/>
    const result = render(component);

    const productCard = result.getByTestId('card')

    // ACT
    fireEvent.click(productCard);

    // ASSERT
    expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});