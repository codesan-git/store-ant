interface Props{
  product: Product,
  onClick?: () =>  void,
  onEdit?: (id: string) => Promise<Boolean>,
  onDelete?: (id: string) => Promise<void>
}

interface Actions {
}

interface Product {
  id: string | number,
  name: string
  price: number,
  stock: number,
  category?: Category,
  image: string | null
}

interface Category{
  id: Number,
  category: string
}

const ProductCard = ( {product, onClick , onEdit, onDelete} : Props ) => {

    const onCardClick = () => {
      if(onClick != null) onClick();
    }

    return (
      <div id="card" data-theme="garden" className={`card glass w-30 h-64 lg:h-auto lg:w-auto`} onClick={onCardClick}>  {/*Find a way to style cursor pointer if onClick is not null*/}
        {product.image? (
          <img 
            src={product.image.split(",")[0]} 
            alt="no image available" 
            className="w-full h-1/2 object-cover rounded-t-2xl"                                         
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
          <h1 className="card-title text-lg">{product.name}</h1>
          <h1 className='text-sm lg:text-md '>{product.category?.category}</h1>
          <h1 className="text-sm lg:text-md ">Rp. {product.price}</h1>
          <h1 className="text-sm lg:text-md ">Qty. {product.stock}</h1>
          {
            (onEdit && onDelete) 
            ? <div className="card-actions justify-end my-2">
                <button onClick={() => onEdit(product.id.toString())} className="w-16 btn btn-primary">Edit</button>
                <button onClick={() => onDelete(product.id.toString())} className="w-16 btn bg-red-500">Delete</button>
            </div>
            : null
          }
        </div>
      </div>
    );
}

export default ProductCard;