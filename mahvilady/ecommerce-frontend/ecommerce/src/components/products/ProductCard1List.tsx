import { FC } from "react";
import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Pagination from "@component/pagination";
import { ProductCard1 } from "@component/product-cards";
import { SemiSpan } from "@component/Typography";
import Product from "@models/product.model";
import { PageMeta } from "interfaces";

// ==========================================================
type Props = { products: Product[]
  ,pageMeta:PageMeta, 
  onPageChange: (newValue: number) => void };
// ==========================================================

const ProductCard1List: FC<Props> = ({ products,pageMeta,onPageChange }) => {
  return (
    <div>
      <Grid container spacing={6}>
        {products.map((item) => (
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              product={item}
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt="32px">
        <SemiSpan>Showing {(pageMeta.pageNumber * pageMeta.size) +1} to {pageMeta.last?pageMeta.totalElements:(pageMeta.pageNumber+1) * pageMeta.size} of {pageMeta.totalElements} Products</SemiSpan>
        <Pagination pageCount={pageMeta.totalPages } onChange={(data) => onPageChange(data)}/>
      </FlexBox>
    </div>
  );
};

export default ProductCard1List;
