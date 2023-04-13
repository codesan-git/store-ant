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

const ProductCard = ({id, name, price, stock, category, image}: Product) => {
    return (
        <>
            <figure>
                {image? (
                    <img src={image}/>
                ) : (
                    <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                )}
            </figure>
            <div className="card-body py-5 h-1/4">
                <h2 className="card-title">{name}</h2>
                <p className='text-md'>{category?.category}</p>   
                <p className="text-md">Rp. {price}</p>
                <p className="text-md">Qty. {stock}</p>
            </div>
        </>
    );
}

export default ProductCard;