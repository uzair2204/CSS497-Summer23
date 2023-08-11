import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { Paragraph } from "@component/Typography";
import { ProductCard16 } from "@component/product-cards";
import CategorySectionCreator from "@component/CategorySectionCreator";
import { theme } from "@utils/theme";
import Product from "@models/product.model";
import productApi from "@utils/real_api/product-api";

// styled component
const SubTitle = styled(Paragraph)({
  fontSize: 12,
  marginTop: "-20px",
  marginBottom: "20px",
  color: theme.colors.gray[600],
});

// =====================================================
type Props = { products: Product[] };
// =====================================================

const Section4: FC<Props> = ({ products}) => {

  const [visibleProducts, setVisibleProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(0);
  const [moreData, setMoreData] = useState(true);

  // Function to fetch products based on the page number
  const fetchProducts = async (page) => {
    try {
      console.log(`load more called ${page}`)
      if(page!==0){
        const response = await productApi.getByPaging(page,'rating,desc');
        setVisibleProducts([...visibleProducts, ...response.data]);
        if(page>=response.meta.totalPages-1){
          setMoreData(false);
        }
      }
      
    
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Load initial products when the component mounts
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Increase the page number to fetch more products
  };

  return (
    <CategorySectionCreator title="All Products" seeMoreLink="product/view/all/2">
      <SubTitle>Best collection in { new Date().getFullYear()} for you!</SubTitle>

      <Grid container spacing={6}>
        {visibleProducts.map((item) => (
          <Grid key={item.id} item md={4} sm={6} xs={12}>
            <ProductCard16
             product={item}
            />
          </Grid>
        ))}
      </Grid>
          {moreData && 
      <FlexBox alignItems="center" justifyContent="center" mt={32}>
        <Button color="primary" variant="contained" onClick={loadMore}>
          Load More...
        </Button>
      </FlexBox>
      }
    </CategorySectionCreator>
  );
};

export default Section4;
