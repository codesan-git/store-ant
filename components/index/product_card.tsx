import { Rating } from "@prisma/client"

interface Props{
  product: Product,
  onClick?: () =>  void,
  onEdit?: (id: string) => Promise<Boolean>,
  onDelete?: (id: string) => Promise<void>
}

interface Product {
  id: string | number,
  name: string
  price: number,
  stock: number,
  category?: Category,
  image: string | null,
  averageRating: number
}

interface Category{
  id: Number,
  category: string
}

const ProductCard = ( {product, onClick , onEdit, onDelete} : Props ) => {
    const onCardClick = () => {
      if(onClick != null) onClick();
    }
    console.log(product?.image?.split(",")[0]);

    return (
      <div data-testid="card" id="card" data-theme="garden" className='card glass w-30 h-96 lg:h-auto lg:w-auto hover:cursor-pointer' onClick={onCardClick}>  {/*Find a way to style cursor pointer if onClick is not null*/}
        {product.image? (
          <img 
            src={`http://localhost:3000/${product.image.split(",")[0]}`} 
            alt="no image available" 
            className="w-full h-44 lg:h-44 object-cover rounded-t-2xl"                                         
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src =
              "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
            }}
          />
        ) : (
          <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
        )}
        <div className=" card-body p-4">
          <h1 data-testid="product-title" className="truncate font-bold text-lg">{product.name}</h1>
          <h1 data-testid="product-category" className='text-sm lg:text-md '>{product.category?.category}</h1>
          <h1 data-testid="product-price" className="text-sm lg:text-md ">Rp. {product.price}</h1>
          <h1 data-testid="product-stock" className="text-sm lg:text-md ">Qty. {product.stock}</h1>
          <div className="flex flex-row">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-yellow-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"/>
            </svg>
            {product.averageRating.toPrecision(3)}
          </div>
          {
            (onEdit && onDelete) 
            ? <div data-testid="product-action-buttons-container" className="card-actions justify-end my-2">
                <button data-testid="edit-button" onClick={() => onEdit(product.id.toString())} className="w-16 btn btn-primary">Edit</button>
                <button data-testid="delete-button" onClick={() => onDelete(product.id.toString())} className="w-16 btn bg-red-500">Delete</button>
              </div>
            : null
          }
        </div>
      </div>
    );
}

export default ProductCard;