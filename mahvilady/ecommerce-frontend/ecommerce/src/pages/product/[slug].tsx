import { Fragment, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5 } from "@component/Typography";
import NavbarLayout from "@component/layout/NavbarLayout";
import ProductIntro from "@component/products/ProductIntro";
import ProductReview from "@component/products/ProductReview";
//import AvailableShops from "@component/products/AvailableShops";
import RelatedProducts from "@component/products/RelatedProducts";
//import FrequentlyBought from "@component/products/FrequentlyBought";
import ProductDescription from "@component/products/ProductDescription";
import Shop from "@models/shop.model";
import Product from "@models/product.model";
import productApi from "@utils/real_api/product-api";
import { useAppContext } from "@context/AppContext";

// ===============================================================
type Props = {
  product: Product;
  shops: Shop[];
  relatedProducts: Product[];
  //frequentlyBought: Product[];
};
// ===============================================================

const ProductDetails = (props: Props) => {
  const { product, 
    // shops, 
    relatedProducts } = props;

  const router = useRouter();
  const { state } = useAppContext();
  const [selectedOption, setSelectedOption] = useState(state.user ? "review" : "description");
  const handleOptionClick = (opt) => () => setSelectedOption(opt);



  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <Fragment>
      <ProductIntro
        price={product.price}
        title={product.title}
        images={product.images}
        id={product.id}
        brand={product.brand}
        rating={product.rating}
        reviewCounts={product?.reviews.length}
        shop={product.shop}
        stock={product.stock}
        discount={product.discount}
        onDiscount={product.onDiscount}
        product={product}


      />

      <FlexBox borderBottom="1px solid" borderColor="gray.400" mt="80px" mb="26px">
        <H5
          mr="25px"
          p="4px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("description")}
          borderBottom={selectedOption === "description" && "2px solid"}
          color={selectedOption === "description" ? "primary.main" : "text.muted"}
        >
          Description
        </H5>

        <H5
          p="4px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("review")}
          borderBottom={selectedOption === "review" && "2px solid"}
          color={selectedOption === "review" ? "primary.main" : "text.muted"}
        >
          Review ({product.reviews?.length})
        </H5>
      </FlexBox>

      {/* DESCRIPTION AND REVIEW TAB DETAILS */}
      <Box mb="50px">
        {selectedOption === "description" && <ProductDescription product={product}/>}
        {selectedOption === "review" && <ProductReview reviews={product.reviews} productId={product.id}  router={router} slug={product.slug}/>}
      </Box>

      {/* FREQUENTLY BOUGHT TOGETHER PRODUCTS */}
      {/* {frequentlyBought && <FrequentlyBought products={frequentlyBought} />} */}

      {/* AVAILABLE SHOPS */}
       {/* {shops && <AvailableShops shops={shops} />}
 */}
      {/* RELATED PRODUCTS */}
      {relatedProducts && <RelatedProducts products={relatedProducts} />}
    </Fragment>
  );
};

ProductDetails.layout = NavbarLayout;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await productApi.getSlugs();
  console.log(paths);
  return {
    paths: paths, //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {

  //const frequentlyBought = await api.getFrequentlyBought();
  const product = await productApi.getBySlug(params.slug as string);
  const catIds=product.categories.map(cat=>cat.id).join(',');
  const shops = await productApi.getShopsByCategoryIds(catIds);
  const relatedProducts = (await productApi.getProductsByCategoryIds(catIds,'rating')).filter(p => p.id !== product.id).slice(0, 4);

  return { props: { relatedProducts, product, shops } };
};

export default ProductDetails;
