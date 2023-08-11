import React from "react";
import Grid from "@component/grid/Grid";
import ProductCard1List from "./ProductCard1List";
import ProductCard9List from "./ProductCard9List";


const ProductListingSection = ({ view, products, pageMeta, onPageChange }) => {
  return (
    <Grid container spacing={6}>
      {/* Render product cards based on the 'view' prop */}
      {view === "grid" ? (
        <ProductCard1List products={products} pageMeta={pageMeta} onPageChange={onPageChange} />
      ) : (
        <ProductCard9List products={products} pageMeta={pageMeta} onPageChange={onPageChange} />
      )}
    </Grid>
  );
};

export default ProductListingSection;
