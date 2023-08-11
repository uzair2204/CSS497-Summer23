import Link from "next/link";
import { FC, Fragment, useCallback, useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import Card from "@component/Card";
import { Chip } from "@component/Chip";
import Rating from "@component/rating";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import LazyImage from "@component/LazyImage";
import { H3, Span } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";
import { useAppContext } from "@context/AppContext";
import { calculateDiscount, currency } from "@utils/utils";
import Product from "@models/product.model";
import { handleCartChange, handleWishChange } from "@utils/common-utils";
import { useRouter } from "next/router";
import showAlert from "@utils/show-alert";

// styled components
const StyledBazaarCard = styled(Card)(({ theme }) => ({
  margin: "auto",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 250ms ease-in-out",
  borderRadius: "0px 10px 10px 10px",
  "&:hover": {
    boxShadow: theme.shadows[2],
    "& .controller": { right: 1 },
  },
}));

const ImageWrapper = styled(Box)({
  textAlign: "center",
  position: "relative",
  display: "inline-block",
});

const ImageBox = styled(Box)(({ theme }) => ({
  padding: "44px 40px",
  borderBottom: `1px solid ${theme.colors.gray[300]}`,
}));

const HoverWrapper = styled(FlexBox)(({ theme }) => ({
  top: 0,
  bottom: 0,
  width: 25,
  right: -30,
  height: 120,
  margin: "auto",
  overflow: "hidden",
  borderRadius: "5px",
  background: "#fff",
  alignItems: "center",
  position: "absolute",
  flexDirection: "column",
  boxShadow: theme.shadows[2],
  justifyContent: "space-between",
  transition: "right 0.3s ease-in-out",
  "& svg": { fontSize: 18, color: theme.colors.gray[600] },
  "& span": {
    width: "100%",
    height: "100%",
    display: "flex",
    padding: "10px 0px",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": { cursor: "pointer", background: "#f3f5f9" },
  },
  "& a": {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": { cursor: "pointer", background: "#f3f5f9" },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  zIndex: 11,
  top: "16px",
  left: "0px",
  color: "white",
  fontWeight: 600,
  fontSize: "11px",
  padding: "3px 12px",
  position: "absolute",
  borderRadius: "0px 50px 50px 0px",
  background: theme.colors.primary.main,
}));

const ContentWrapper = styled(Box)({
  padding: "1rem",
  "& .title, & .categories": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

const ButtonBox = styled(FlexBox)(({ theme }) => ({
  gap: 10,
  marginTop: "15px",
  justifyContent: "space-between",
  "& button": {
    color: "#fff",
    background: theme.colors.primary.main,
    "&:hover": { background: theme.colors.primary[400] },
  },
  "& button svg path": { fill: "white !important" },
}));

// =============================================================
type ProductCardProps = {
  product:Product; 
  hoverEffect?: boolean;
};
// =============================================================

const ProductCard16: FC<ProductCardProps> = (props) => {
  const {hoverEffect,product } = props;

  const { state, dispatch } = useAppContext();
  const [openModal, setOpenModal] = useState(false);

  const cartItem = state.cart.find((item) => item.product.id === product.id);
  const wishItem = state.wish.find((item) => item.productId === product.id);
  const router = useRouter();

  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
  const actualPrice = product.onDiscount?calculateDiscount(product.price,product.discount) : product.price;

  const handleWishAction = () => {
    if (!state?.user) {
      showAlert("Login to perform the desired action");
      router.push("/login");
      return;
    }
    handleWishChange(product.id,state.wish,dispatch,state?.user?.id);
  };
  
  const handleCartAmountChange = (amount: number) => () => {
    if (!state?.user) {
      showAlert("Login to perform the desired action");
      router.push("/login");
      return;
    }
    handleCartChange(amount, product, state.cart, dispatch,state?.user?.id);
  };

  

  return (
    <StyledBazaarCard hoverEffect={hoverEffect}>
      <ImageWrapper>
        {product.onDiscount && <StyledChip color="primary">{`${product.discount}% off`}</StyledChip>}

        <ImageBox>
          <Link href={`/product/${product.slug}`}>
            <a>
              <LazyImage
                alt={product.title}
                src={`/assets/images/${product.thumbnail}`}
                width={190}
                height={190}
                layout="responsive"
                objectFit="contain"
              />
            </a>
          </Link>

          <HoverWrapper className="controller">
            <Span onClick={toggleDialog}>
              <Icon variant="small">eye-alt</Icon>
            </Span>

            <Divider />
           
            <Span onClick={handleWishAction}>
            {wishItem ? (<Icon variant="small">heart_filled</Icon>) : (<Icon variant="small">heart</Icon>)}
            </Span>

            <Divider />

            <Span onClick={handleCartAmountChange(1)}>
              <Icon variant="small">shopping-cart</Icon>
            </Span>
          </HoverWrapper>
        </ImageBox>
      </ImageWrapper>

      <ProductQuickView
        open={openModal}
        onClose={toggleDialog}
        product={product}
      />

      <ContentWrapper>
        <Box flex="1 1 0" minWidth="0px" mr={1}>
          <Link href={`/product/${product.slug}`}>
            <a>
              <H3
                mb={1}
                title={product.title}
                fontSize="14px"
                fontWeight="600"
                className="title"
                color="text.secondary"
              >
                {product.title}
              </H3>
            </a>
          </Link>

          
            <FlexBox alignItems="center">
              <Rating value={product?.rating || 0} outof={5} color="warn" /> <Span ml={1}>{`(${product.rating?product.rating:0})`}</Span>
            </FlexBox>
          

          <FlexBox alignItems="center" mt={0.5}>
            <Box fontWeight="600" color="primary.main" mr={1}>
              {currency(actualPrice)}
            </Box>

            {product.onDiscount && (
              <Box color="grey.600" fontWeight="600">
                <del>{currency(product.price)}</del>
              </Box>
            )}
          </FlexBox>
        </Box>

        
          {product.stock>0?(
            <ButtonBox>
          <Button
            variant="contained"
            onClick={handleCartAmountChange(cartItem?.qty ? cartItem.qty - 1 : 1)}
            style={{ paddingTop: "3px", paddingBottom: "3px", width: "100%", fontSize: "13px" }}
          >
            {cartItem?.qty ? (
              <Fragment>
                <Icon size="16px">minus</Icon> Remove from Cart
              </Fragment>
            ) : (
              <Fragment>
                <Icon size="16px">plus</Icon> Add to Cart
              </Fragment>
            )}
          </Button>

          <Button variant="contained" style={{ padding: "3px 8px" }}  onClick={handleWishAction}>
          {wishItem ? (<Icon size="16px">heart_filled</Icon>) : (<Icon size="16px">heart</Icon>)}
          </Button>
          </ButtonBox>
          ):( <ButtonBox>
            <Button
              variant="contained"
              style={{ paddingTop: "3px", paddingBottom: "3px", width: "100%", fontSize: "13px" }}
            >
            <Fragment>
              out of stock
            </Fragment>
          
            </Button>
  
            <Button variant="contained" style={{ padding: "3px 8px" }}  onClick={handleWishAction}>
              {wishItem ? (<Icon size="16px">heart_filled</Icon>) : (<Icon size="16px">heart</Icon>)}
            </Button>
            </ButtonBox>)}
       
      </ContentWrapper>
    </StyledBazaarCard>
  );
};

export default ProductCard16;
