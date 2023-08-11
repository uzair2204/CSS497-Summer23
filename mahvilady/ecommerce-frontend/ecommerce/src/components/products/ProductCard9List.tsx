import { FC, Fragment } from "react";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import { SemiSpan } from "@component/Typography";
import { ProductCard9 } from "@component/product-cards";
import Product from "@models/product.model";
import { PageMeta } from "interfaces";

// ==========================================================
type Props = {
  products: Product[],
  pageMeta: PageMeta,
  onPageChange: (newValue: number) => void
};
// ==========================================================

const ProductCard9List: FC<Props> = ({ products, pageMeta, onPageChange }) => {
  console.log('ProductCard9List - Products:', products);
  console.log('ProductCard9List - PageMeta:', pageMeta);
  return (
 
    <Fragment>
      {products.map((item) => (
        <ProductCard9 key={item.id}
          product={item}
        />
      ))}

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt="32px">
        <SemiSpan>Showing {pageMeta.first? 1:(pageMeta.pageNumber * pageMeta.size) + 1} to {pageMeta.last ? pageMeta.totalElements : (pageMeta.pageNumber + 1) * pageMeta.size} of {pageMeta.totalElements} Products</SemiSpan>
        <Pagination pageCount={pageMeta.totalPages} onChange={(data) => onPageChange(data+1)}/>
      </FlexBox>
    </Fragment>
  );
};

export default ProductCard9List;
