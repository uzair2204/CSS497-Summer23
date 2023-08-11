import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";
import { useAppContext } from "@context/AppContext";
import Box from "@component/Box";
import Image from "@component/Image";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography from "@component/Typography";
import { IconButton } from "@component/buttons";
import { calculateDiscount, currency, getTheme } from "@utils/utils";
import Product from "@models/product.model";
import { handleCartChange } from "@utils/common-utils";
import { useRouter } from "next/router";
import showAlert from "@utils/show-alert";

// styled component
const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  box-shadow: ${getTheme("shadows.4")};
  background-color: ${getTheme("colors.body.paper")};

  .product-details {
    padding: 20px;
  }
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media only screen and (max-width: 425px) {
    flex-wrap: wrap;
    img {
      height: auto;
      min-width: 100%;
    }
    .product-details {
      // padding: 1rem;
    }
  }
  ${space}
`;

// =====================================================================
interface ProductCard7Props extends SpaceProps {
  qty: number;
  product: Product;
}
// =====================================================================

const ProductCard7: FC<ProductCard7Props> = (props) => {
  const { qty, product, ...others } = props;
  const price = product.onDiscount ? calculateDiscount(product.price, product.discount) : product.price
  const router = useRouter();
  const { dispatch, state } = useAppContext();
  const handleCartAmountChange = (amount: number) => () => {
    if (!state?.user) {
      showAlert("Login to perform the desired action");
      router.push("/login");
      return;
    }
    handleCartChange(amount, product, state.cart, dispatch, state?.user?.id);
  };

  

  return (
    <Wrapper {...others}>
      <Image
        size={140}
        alt={product.title}
        display="block"
        src={`/assets/images/${product.thumbnail}` || "/assets/images/no-images.png"}
      />

      <FlexBox
        width="100%"
        minWidth="0px"
        flexDirection="column"
        className="product-details"
        justifyContent="space-between"
      >
        <Link href={`/product/${product.slug}`}>
          <a>
            <Typography className="title" fontWeight="600" fontSize="18px" mb="0.5rem">
              {product.title}
            </Typography>
          </a>
        </Link>

        <Box position="absolute" right="1rem" top="1rem">
          <IconButton padding="4px" ml="12px" size="small" onClick={handleCartAmountChange(0)}>
            <Icon size="1.25rem">close</Icon>
          </IconButton>
        </Box>

        <FlexBox justifyContent="space-between" alignItems="flex-end">
          <FlexBox flexWrap="wrap" alignItems="center">
            {product.onDiscount && (
              <Typography color="gray.600" mr="0.5rem">
                <del>{currency(product.price)}</del>
              </Typography>
            )}
            <Typography color="gray.600" mr="0.5rem">
              {currency(price)} x {qty}
            </Typography>


            <Typography fontWeight={600} color="primary.main" mr="1rem">
              {currency(price * qty)}
            </Typography>
          </FlexBox>

          <FlexBox alignItems="center">
            <Button
              size="none"
              padding="5px"
              color="primary"
              variant="outlined"
              disabled={qty === 1}
              borderColor="primary.light"
              onClick={handleCartAmountChange(qty - 1)}
            >
              <Icon variant="small">minus</Icon>
            </Button>

            <Typography mx="0.5rem" fontWeight="600" fontSize="15px">
              {qty}
            </Typography>

            <Button
              size="none"
              padding="5px"
              color="primary"
              variant="outlined"
              borderColor="primary.light"
              onClick={handleCartAmountChange(qty + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
};

export default ProductCard7;

