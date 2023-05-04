interface Props{
    product: Product,
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

const ProductCard = ( {product, onEdit, onDelete} : Props ) => {
    return (
        <div id="card" data-theme="garden" className="card w-auto glass">
            <figure className="h-max bg-gray-500">
                {product.image? (
                    <img src={product.image} alt="no image available" className="object-fill"/>
                ) : (
                    <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                )}
            </figure>
            <div className="h-1/2 card-body p-8">
                <h2 className="card-title">{product.name}</h2>
                <p className='text-md'>{product.category?.category}</p>   
                <p className="text-md">Rp. {product.price}</p>
                <p className="text-md">Qty. {product.stock}</p>
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