import Link from "next/link";

const ShopDashboard =  () => {

  return(
    <>
      <div id='dashboard' className=""> {/*Try to use drawer here*/}
        <div id="shop-profile">
          <div id="profile-photo-container" className="avatar">
            <div className="w-24 rounded-full">
              <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" alt="" />
            </div>
          </div>
          <h1 className="font-bold">Peter Shop</h1>
          <h1 className="font-bold">Rating: 5/5</h1>
          <button className="bg-green-400 p-1 w-24 text-white">Edit</button>
        </div>
        <div id="shop-stats">
          <h1>Balance Rp.30000</h1>
        </div>
        <div id="dashboard-navigation">
          <ul>
            <li><Link href={''}>Home</Link></li>
            <li><Link href={''}>Chat</Link></li>
            <li><Link href={''}>Product</Link></li>
            <li><Link href={''}>Sales</Link></li>
              {/*Create dropdown menu here using https://tailwindcomponents.com/component/tailwind-css-sidebar-dropdown*/}
            <li><Link href={''}>Stats</Link></li>
          </ul>
        </div>
      </div>
    </>
  );

}

export default ShopDashboard;