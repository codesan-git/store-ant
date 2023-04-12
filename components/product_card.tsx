interface Product {
    id: string,
    name: string
    price: number,
    stock: number
}

const ProductCard = ({id, name, price, stock}: Product) => {
    return (
        <>
            <figure>
                <img
                    src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                    alt="image!"
                />
            </figure>
            <div className="card-body py-5 h-1/4">
                <h2 className="card-title">{name}</h2>
                <p className="text-md">Rp. {price}</p>
                <p className="text-md">Qty. {stock}</p>
            </div>
        </>
    );
}

export default ProductCard;