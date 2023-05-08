import { Category } from "@prisma/client";
import { useRouter } from "next/router";

interface Props {
  onClick?: (product: string) => void,
  category: Category
}

const CategoryListItem = ({onClick, category} : Props) => {

  const onItemClick = () => {

    if(onClick != null) onClick(category.id);

  }

  return (
    <div id="category-item" onClick={onItemClick} className="carousel-item flex-col items-center p-2 w-16 h-16 hover:cursor-pointer">
      <div id="category-icon-container" className="h-1/2 w-full flex justify-center items-center ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" />
        </svg>
      </div>
      <div id="category-name-container" className="flex justify-center items-center h-1/2 w-full ">
        <h1 className="text-xs text-center">{category.category}</h1>
      </div>
    </div>
  );
}

export default CategoryListItem;