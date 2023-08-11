//import Link from "next/link";
import { FC, useState } from "react";
import { useRouter } from "next/router";
import Box from "@component/Box";
import Image from "@component/Image";
import Rating from "@component/rating";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { H1, H2, H3, H6, SemiSpan } from "@component/Typography";
import { useAppContext } from "@context/AppContext";
import { calculateDiscount, currency } from "@utils/utils";
import Brand from "@models/Brand.model";
import Shop from "@models/shop.model";
import Product from "@models/product.model";
import { handleCartChange } from "@utils/common-utils";
import showAlert from "@utils/show-alert";

// ========================================
type ProductIntroProps = {
  price: number;
  title: string;
  images: string[];
  id: string | number;
  brand: Brand;
  rating: number,
  reviewCounts: number,
  shop: Shop;
  stock: number,
  discount: number,
  onDiscount: boolean,
  product?:Product
};
// ========================================

const ProductIntro: FC<ProductIntroProps> = ({ images, title, price, id, brand, shop, rating, reviewCounts, stock, discount, onDiscount,product }) => {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);

  const routerId = router.query.id as string;
  const cartItem = state.cart.find((item) => item.id === id || item.id === routerId);

  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  const actualPrice = onDiscount?calculateDiscount(price,discount) : price;

  const handleCartAmountChange = (amount: number) => () => {
    if (!state?.user) {
      showAlert("Login to perform the desired action");
      router.push("/login");
      return;
    }
    handleCartChange(amount,product, state.cart, dispatch,state?.user.id);
  };

  return (
    <Box overflow="hidden">
      <Grid container justifyContent="center" spacing={16}>
        <Grid item md={6} xs={12} alignItems="center">
          <Box>
            <FlexBox justifyContent="center" mb="50px">
              <Image
                width={300}
                height={300}
                src={`/assets/images/${images[selectedImage]}`}
                style={{ objectFit: "contain" }}
              />
            </FlexBox>

            <FlexBox overflow="auto">
              {images.map((url, ind) => (
                <Box
                  key={ind}
                  size={70}
                  bg="white"
                  minWidth={70}
                  display="flex"
                  cursor="pointer"
                  border="1px solid"
                  borderRadius="10px"
                  alignItems="center"
                  justifyContent="center"
                  ml={ind === 0 && "auto"}
                  mr={ind === images.length - 1 ? "auto" : "10px"}
                  borderColor={selectedImage === ind ? "primary.main" : "gray.400"}
                  onClick={handleImageClick(ind)}
                >
                  <Avatar src={`/assets/images/${url}`} borderRadius="10px" size={40} />
                </Box>
              ))}
            </FlexBox>
          </Box>
        </Grid>

        <Grid item md={6} xs={12} alignItems="center">
          <H1 mb="1rem">{title}</H1>

          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Brand:</SemiSpan>
            <H6 ml="8px">{brand.name}</H6>
          </FlexBox>

          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Rated:</SemiSpan>
            <Box ml="8px" mr="8px">
              <Rating color="warn" value={rating ?? 0} outof={5} />
            </Box>
            <H6>({reviewCounts})</H6>
          </FlexBox>

          <Box mb="24px">
            {onDiscount && (
              <>
              <H2 color="primary.main" mb="4px" lineHeight="1">
                {currency(actualPrice)}
              </H2>
              <H6 color="primary.main" mb="4px" lineHeight="1">
              <del>{currency(price)}</del>
              </H6>
              </>
            )}


            {!onDiscount &&
            <H2 color="primary.main" mb="4px" lineHeight="1">
            {currency(price)}
            </H2>}


            {stock > 0 ? (
              <SemiSpan color="inherit">Stock Available</SemiSpan>
            ) : (
              <SemiSpan color="primary">Out Of Stock</SemiSpan>
            )}
          </Box>
          {stock > 0 ? (
            !cartItem?.qty ? (
              <Button
                mb="36px"
                size="small"
                color="primary"
                variant="contained"
                onClick={handleCartAmountChange(1)}
              >
                Add to Cart
              </Button>
            ) : (
              <FlexBox alignItems="center" mb="36px">
                <Button
                  p="9px"
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={handleCartAmountChange(cartItem?.qty - 1)}
                >
                  <Icon variant="small">minus</Icon>
                </Button>

                <H3 fontWeight="600" mx="20px">
                  {cartItem?.qty.toString().padStart(2, "0")}
                </H3>

                <Button
                  p="9px"
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={handleCartAmountChange(cartItem?.qty + 1)}
                >
                  <Icon variant="small">plus</Icon>
                </Button>
              </FlexBox>
            )) : (<Button
              mb="36px"
              size="small"
              color="primary"
              variant="contained"

            >
              Out of stock
            </Button>)}

          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Sold By:</SemiSpan>
            {/* <Link href={`/shops/${shop.slug}`}> */}
              <a>
                <H6 lineHeight="1" ml="8px">
                  {shop.name}
                </H6>
              </a>
            {/* </Link> */}
          </FlexBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductIntro;
