import Link from "next/link";
import Image from "next/image";
import { FC, Fragment, useCallback, useState } from "react";
import styled from "styled-components";
import { useAppContext } from "@context/AppContext";
import Box from "@component/Box";
import Rating from "@component/rating";
import { Chip } from "@component/Chip";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Card, { CardProps } from "@component/Card";
import { H3, SemiSpan } from "@component/Typography";
import { calculateDiscount, currency, getTheme } from "@utils/utils";
import { deviceSize } from "@utils/constants";
import ProductQuickView from "@component/products/ProductQuickView";
import Product from "@models/product.model";
import { handleCartChange, handleWishChange } from "@utils/common-utils";
import { useRouter } from "next/router";
import showAlert from "@utils/show-alert";

// styled component
const Wrapper = styled(Card)`
  margin: auto;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  transition: all 250ms ease-in-out;

  &:hover {
    .details {
      .add-cart {
        display: flex;
      }
    }
    .image-holder {
      .extra-icons {
        display: block;
      }
    }
  }

  .image-holder {
    text-align: center;
    position: relative;
    display: inline-block;
    height: 100%;

    .extra-icons {
      z-index: 2;
      top: 0.75rem;
      display: none;
      right: 0.75rem;
      cursor: pointer;
      position: absolute;
    }

    @media only screen and (max-width: ${deviceSize.sm}px) {
      display: block;
    }
  }

  .details {
    padding: 1rem;

    .title,
    .categories {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .icon-holder {
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      justify-content: space-between;
    }

    .favorite-icon {
      cursor: pointer;
    }
    .outlined-icon {
      svg path {
        fill: ${getTheme("colors.text.hint")};
      }
    }
    .add-cart {
      display: none;
      margin-top: auto;
      align-items: center;
      flex-direction: column;
    }
  }

  @media only screen and (max-width: 768px) {
    .details {
      .add-cart {
        display: flex;
      }
    }
  }
`;

// =======================================================================
interface ProductCard1Props extends CardProps {
  product: Product
  onWishAction?: (productId: number | string) => void;
}
// =======================================================================

const ProductCard1: FC<ProductCard1Props> = ({
  product,
  onWishAction,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useAppContext();
  const cartItem = state.cart.find((item) => item.product.id === product.id);
  const wishItem = state.wish.find((item) => item.productId === product.id);
  const actualPrice = product.onDiscount ? calculateDiscount(product.price, product.discount) : product.price;
  const router = useRouter();


  const toggleDialog = useCallback(() => setOpen((open) => !open), []);

  const handleCartAmountChange = (amount: number) => () => {
    if (!state?.user) {
      showAlert("Login to perform the desired action");
      router.push("/login");
      return;
    }
    handleCartChange(amount, product, state.cart, dispatch, state?.user?.id);
  };


  const handleWishAction = () => {
    if (!state?.user) {
      showAlert("Login to perform the desired action");
      router.push("/login");
      return;
    }
    handleWishChange(product.id, state.wish, dispatch, state?.user?.id);
    if (onWishAction) {
      onWishAction(product.id);
    }
  };





  return (
    <>
      <Wrapper {...props}>
        <div className="image-holder">
          {product.onDiscount && (
            <Chip
              top="10px"
              left="10px"
              p="5px 10px"
              fontSize="10px"
              fontWeight="600"
              bg="primary.main"
              position="absolute"
              color="primary.text"
              zIndex={1}
            >
              {product.discount}% off
            </Chip>
          )}

          <FlexBox className="extra-icons">
            <Icon color="secondary" variant="small" mb="0.5rem" onClick={toggleDialog}>
              eye-alt
            </Icon>
            {/* <IconButton onClick={handleWishAction}> */}
            <Icon className="favorite-icon outlined-icon" variant="small" onClick={handleWishAction}>
              {wishItem ? 'heart_filled' : 'heart'}
            </Icon>
            {/* </IconButton> */}

          </FlexBox>

          <Link href={`/product/${product.slug}`}>
            <a>
              <Image
                alt={product.title}
                width={100}
                src={`/assets/images/${product.thumbnail}`}
                height={100}
                objectFit="cover"
                layout="responsive"
              />
            </a>
          </Link>
        </div>

        <div className="details">
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr="0.5rem">
              <Link href={`/product/${product.slug}`}>
                <a>
                  <H3
                    mb="10px"
                    title={product.title}
                    fontSize="14px"
                    textAlign="left"
                    fontWeight="600"
                    className="title"
                    color="text.secondary"
                  >
                    {product.title}
                  </H3>
                </a>
              </Link>

              <Rating value={product.rating || 0} outof={5} color="warn" readonly />

              <FlexBox alignItems="center" mt="10px">
                <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                  {currency(actualPrice)}
                </SemiSpan>

                {product.onDiscount && (
                  <SemiSpan color="text.muted" fontWeight="600">
                    <del>{currency(product.price)}</del>
                  </SemiSpan>
                )}
              </FlexBox>
            </Box>

            <FlexBox
              width="30px"
              alignItems="center"
              flexDirection="column-reverse"
              justifyContent={!!cartItem?.qty ? "space-between" : "flex-start"}
            >
              {product.stock > 0 &&
                <Button
                  size="none"
                  padding="3px"
                  color="primary"
                  variant="outlined"
                  borderColor="primary.light"
                  onClick={handleCartAmountChange((cartItem?.qty || 0) + 1)}
                >
                  <Icon variant="small">plus</Icon>
                </Button>
              }

              {!!cartItem?.qty && (
                <Fragment>
                  <SemiSpan color="text.primary" fontWeight="600">
                    {cartItem.qty}
                  </SemiSpan>

                  <Button
                    size="none"
                    padding="3px"
                    color="primary"
                    variant="outlined"
                    borderColor="primary.light"
                    onClick={handleCartAmountChange(cartItem.qty - 1)}
                  >
                    <Icon variant="small">minus</Icon>
                  </Button>
                </Fragment>
              )}
            </FlexBox>
          </FlexBox>
        </div>
      </Wrapper>

      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={product}
      />
    </>
  );
};

export default ProductCard1;
