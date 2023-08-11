const navbarNavigations = [
  {
    title: "Home",
    url: "/"
    // child: [
    //   { title: "Mahvi Lady", url: "/" },
    // ],
  },
  {
    title: "Pages",
    child: [
      {
        title: "Sale Page",
        child: [
          { title: "Version 1", url: "/sale-page-1" },
          { title: "Version 2", url: "/sale-page-2" },
        ],
      },
      {
        title: "Vendor",
        child: [
          { title: "All vendors", url: "/shops" },
          { title: "Vendor store", url: "/shops/scarlett-beauty" },
        ],
      },
      {
        title: "Shop",
        child: [
          { title: "Search product", url: "/product/search/mobile phone" },
          { title: "Single product", url: "/product/lord-2019" },
          { title: "Cart", url: "/cart" },
          { title: "Checkout", url: "/checkout" },
          { title: "Alternative Checkout", url: "/checkout-alternative" },
        ],
      },
    ],
  },
  {
    title: "User Account",
    child: [
      {
        title: "Orders",
        child: [
          { title: "Order List", url: "/orders" },
          { title: "Order Details", url: "/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8" },
        ],
      },
      {
        title: "Profile",
        child: [
          { title: "View Profile", url: "/profile" },
          { title: "Edit Profile", url: "/profile/edit" },
        ],
      },
      {
        title: "Address",
        child: [
          { title: "Address List", url: "/address" },
          { title: "Add Address", url: "/address/create" },
        ],
      },
      {
        title: "Support tickets",
        child: [
          { title: "All tickets", url: "/support-tickets" },
          { title: "Ticket details", url: "/support-tickets/product-broken.-i-need-refund" },
        ],
      },
      { title: "Wishlist", url: "/wish-list" },
    ],
  },
  {
    title: "Vendor Account",
    child: [
      { title: "Dashboard", url: "/vendor/dashboard" },
      {
        title: "Products",
        child: [
          { title: "All products", url: "/vendor/products" },
          { title: "Add/Edit product", url: "/vendor/products/248104" },
        ],
      },
      {
        title: "Orders",
        child: [
          { title: "All orders", url: "/vendor/orders" },
          { title: "Order details", url: "/vendor/orders/248104" },
        ],
      },
      { title: "Profile", url: "/vendor/account-settings" },
    ],
  },
  { title: "Track My Orders", url: "/orders" },
  // { title: "Back to Demos", url: "/" },
  // {
  //   title: "Documentation",
  //   url:
  //     "https://docs.google.com/document/d/13Bnyugzcty75hzi9GdbVh01YV75a7AhViZws0qGf5yo/edit?usp=sharing",
  //   extLink: true,
  // },
];


export const userNavigations = [
  {
    title: "User Account",
    child: [
      {
        title: "Orders",
        url: "/orders"
      },
      {
        title: "Profile",
        child: [
          { title: "View Profile", url: "/profile" },
          { title: "Edit Profile", url: "/profile/edit" },
        ],
      },
      { title: "Wishlist", url: "/wish-list" },
    ],
  },
  { title: "Track My Orders", url: "/orders" },
];

export const commonNavigations = [
  {
    title: "Home",
    url: "/"
  },

  {
    title: "Latest",
    url: "/product/view/all/6"
  },
  {
    title: "Most Rated",
    url: "/product/view/all/3"
  },
  {
    title: "All Products",
    url: "/product/view/all/1"
  },


];




export const adminNavigations = [
  {
    title: "Admin Account",
    child: [
      {
        title: "Services",
        child: [
          { title: "Services", url: "/services" },
          { title: "Add New Service", url: "/services/add" },
        ],
      },
      {
        title: "Brands",
        child: [
          { title: "Brands", url: "/brands" },
          { title: "Add New Brands", url: "/brands/add" },
        ],
      },
      {
        title: "Carousel",
        child: [
          { title: "Carousel", url: "/carousel" },
          { title: "Add New Carousel", url: "/carousel/add" },
        ],
      },
      {
        title: "Navigations",
        child: [
          { title: "Navigations", url: "/navs" },
          { title: "Add New Navigations", url: "/navs/add" },
        ],
      },
      {
        title: "Category",
        child: [
          { title: "Category", url: "/category" },
          { title: "Add New Category", url: "/category/add" },
        ],
      },
      {
        title: "Profile Info",
        child: [
          { title: "Profile", url: "/admin-profile" },
        ],
      },
      { title: "Logout", url: "/logout" },
    ],
  },
  {
    title: "Mange Products",
    child: [
      { title: "Products", url: "/vendor/products" },
      { title: "Add New Product", url: "/vendor/add-product" },
    ],
  },
];

export default navbarNavigations;





