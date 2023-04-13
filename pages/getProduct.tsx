// import React, { useState, useEffect } from 'react';
// import { ProductService } from './service/ProductService';
// import { Button } from 'primereact/button';
// import { DataView } from 'primereact/dataview';
// import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
// import { Rating } from 'primereact/rating';
// import { Tag } from 'primereact/tag';

// interface Product {
//     id: string;
//     code: string;
//     name: string;
//     description: string;
//     image: string;
//     price: number;
//     category: string;
//     quantity: number;
//     inventoryStatus: string;
//     rating: number;
// }

// interface SortOption {
//     label: string;
//     value: string;
// }

// export default function GetProduct() {
//     const [products, setProducts] = useState<Product>([]);
//     const [sortKey, setSortKey] = useState<string>('');
//     const [sortOrder, setSortOrder] = useState<number>(0);
//     const [sortField, setSortField] = useState<string>('');
//     const sortOptions: SortOption[] = [
//         { label: 'Price High to Low', value: '!price' },
//         { label: 'Price Low to High', value: 'price' },
//         { label: 'Name A to Z', value: 'name' },
//         { label: 'Name Z to A', value: '!name' },
//     ];

//     useEffect(() => {
//         ProductService.getProductsSmall().then((data) => setProducts(data));
//     }, []);

//     const getSeverity = (product: Product) => {
//         switch (product.inventoryStatus) {
//             case 'INSTOCK':
//                 return 'success';

//             case 'LOWSTOCK':
//                 return 'warning';

//             case 'OUTOFSTOCK':
//                 return 'danger';

//             default:
//                 return null;
//         }
//     };

//     const onSortChange = (event: DropdownChangeEvent) => {
//         const value = event.value;

//         if (value.indexOf('!') === 0) {
//             setSortOrder(-1);
//             setSortField(value.substring(1, value.length));
//             setSortKey(value);
//         } else {
//             setSortOrder(1);
//             setSortField(value);
//             setSortKey(value);
//         }
//     };

//     const header = () => {
//         return <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} className="w-full sm:w-14rem" />;
//     };

//     const itemTemplate = (product: Product) => {
//         return (
//             <div className="">
//                 <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
//                     <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} />
//                     <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
//                         <div className="flex flex-column align-items-center sm:align-items-start gap-3">
//                             <div className="text-2xl font-bold text-900">{product.name}</div>
//                             <Rating value={product.rating} readOnly cancel={false}></Rating>
//                             <div className="flex align-items-center gap-3">
//                                 <span className="flex align-items-center gap-2">
//                                     <i className="pi pi-tag"></i>
//                                     <span className="font-semibold">{product.category}</span>
//                                 </span>
//                                 <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>
//                             </div>
//                         </div>
//                         <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
//                             <span className="text-2xl font-semibold">${product.price}</span>
//                             <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="card">
//             <DataView value={products} itemTemplate={itemTemplate} header={header()} sortField={sortField} sortOrder={sortOrder} paginator rows={5} />
//         </div>
//     )
// }

import React, { useState, useEffect } from "react";
import { ProductService } from "./service/ProductService";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

interface SortOption {
  label: string;
  value: string;
}

export default function BasicDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [layout, setLayout] = useState("grid");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [sortField, setSortField] = useState<string>("");
  const sortOptions: SortOption[] = [
    { label: "Price High to Low", value: "!price" },
    { label: "Price Low to High", value: "price" },
    { label: "Name A to Z", value: "name" },
    { label: "Name Z to A", value: "!name" },
  ];

  useEffect(() => {
    ProductService.getProducts().then((data) => setProducts(data.slice(0, 12)));
  }, []);

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const listItem = (product: Product) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
            alt={product.name}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{product.name}</div>
              <Rating value={product.rating} readOnly cancel={false}></Rating>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold">{product.category}</span>
                </span>
                <Tag
                  value={product.inventoryStatus}
                  severity={getSeverity(product)}
                ></Tag>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold">${product.price}</span>
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-rounded"
                disabled={product.inventoryStatus === "OUTOFSTOCK"}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (product: Product) => {
    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">{product.category}</span>
            </div>
            <Tag
              value={product.inventoryStatus}
              severity={getSeverity(product)}
            ></Tag>
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img
              className="w-9 shadow-2 border-round"
              src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
              alt={product.name}
            />
            <div className="text-2xl font-bold">{product.name}</div>
            <Rating value={product.rating} readOnly cancel={false}></Rating>
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-semibold">${product.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              className="p-button-rounded"
              disabled={product.inventoryStatus === "OUTOFSTOCK"}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (product: Product, layout: string) => {
    if (!product) {
      return;
    }

    if (layout === "list") return listItem(product);
    else if (layout === "grid") return gridItem(product);
  };

  const header = () => {
    return (
      <div className="flex justify-around">
        <div className="mr-auto">
          <Dropdown
            options={sortOptions}
            value={sortKey}
            optionLabel="label"
            placeholder="Sort By Price"
            onChange={onSortChange}
            className="w-full sm:w-14rem"
          />
        </div>
        <div className="">
          <DataViewLayoutOptions
            layouCommercial
            Usage
            Multiple
            End
            Products
            Lifetime
            Support
            Unlimited
            Updatest={layout}
            onChange={(e) => setLayout(e.value)}
          />
        </div>
      </div>
    );
  };
  //   const headerSort = () => {
  //     return (

  //     );
  //   };

  return (
    <div className="card">
      <DataView
        value={products}
        itemTemplate={itemTemplate}
        layout={layout}
        header={header()}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </div>
  );
}
