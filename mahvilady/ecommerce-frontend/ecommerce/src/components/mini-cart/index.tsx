import { FC, Fragment } from "react";
import Link from "next/link";
import NextImage from "next/image";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import Avatar from "@component/avatar";
import { Button } from "@component/buttons";
import Typography, { H5, Paragraph, Tiny } from "@component/Typography";
import { StyledMiniCart } from "./styles";
import { calculateDiscount, currency } from "@utils/utils";
import { handleCartChange } from "@utils/common-utils";
import { useAppContext } from "@context/AppContext";
import Product from "@models/product.model";

type MiniCartProps = { toggleSidenav?: () => void };

const MiniCart: FC<MiniCartProps> = ({ toggleSidenav }) => {
  const { state,dispatch} = useAppContext();

  const handleCartAmountChange = (amount: number, item: Product) => () => {
    handleCartChange(amount, item, state.cart, dispatch,state?.user?.id);
  };


  const getTotalPrice = () => {
    return state.cart.reduce((accumulator, item) => accumulator + (item.product.onDiscount? calculateDiscount(item.product.price, item.product.discount) : item.product.price ) * item.qty, 0) || 0;
  };

  return (
    <StyledMiniCart>
      <div className="cart-list">
        <FlexBox alignItems="center" m="0px 20px" height="74px">
          <Icon size="1.75rem">bag</Icon>
          <Typography fontWeight={600} fontSize="16px" ml="0.5rem">
            {state.cart.length} item
          </Typography>
        </FlexBox>

        <Divider />

        {!!!state.cart.length && (
          <FlexBox
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            height="calc(100% - 80px)"
          >
            <NextImage src="/assets/images/logos/shopping-bag.svg" width="90px" height="100%" />
            <Paragraph mt="1rem" color="text.muted" textAlign="center" maxWidth="200px">
              Your shopping bag is empty. Start shopping
            </Paragraph>
          </FlexBox>
        )}

        {state.cart.map((item) => (
          <Fragment key={item.product.id}>
            <div className="cart-item">
              <FlexBox alignItems="center" flexDirection="column">
                <Button
                  variant="outlined"
                  color="primary"
                  padding="5px"
                  size="none"
                  borderColor="primary.light"
                  borderRadius="300px"
                  onClick={handleCartAmountChange(item.qty + 1, item.product)}
                >
                  <Icon variant="small">plus</Icon>
                </Button>

                <Typography fontWeight={600} fontSize="15px" my="3px">
                  {item.qty}
                </Typography>

                <Button
                  size="none"
                  padding="5px"
                  color="primary"
                  variant="outlined"
                  borderRadius="300px"
                  borderColor="primary.light"
                  onClick={handleCartAmountChange(item.qty - 1, item.product)}
                  disabled={item.qty === 1}
                >
                  <Icon variant="small">minus</Icon>
                </Button>
              </FlexBox>

              <Link href={`/product/${item.product.slug}`}>
                <a>
                  <Avatar
                    size={76}
                    mx="1rem"
                    alt={item.product.title}
                    src={`/assets/images/${item.product.thumbnail}` || "/assets/images/no-image.png"}
                  />
                </a>
              </Link>

              <div className="product-details">
                <Link href={`/product/${item.id}`}>
                  <a>
                    <H5 className="title" fontSize="14px">
                      {item.product.title}
                    </H5>
                  </a>
                </Link>

                <Tiny color="text.muted">
                  {currency((item.product.onDiscount? calculateDiscount(item.product.price, item.product.discount) : item.product.price ), 0)} x {item.qty}
                </Tiny>

                <Typography fontWeight={600} fontSize="14px" color="primary.main" mt="4px">
                  {currency(item.qty * (item.product.onDiscount? calculateDiscount(item.product.price, item.product.discount) : item.product.price ))}
                </Typography>
              </div>

              <Icon
                size="1rem"
                ml="1.25rem"
                className="clear-icon"
                onClick={handleCartAmountChange(0, item.product)}
              >
                close
              </Icon>
            </div>
            <Divider />
          </Fragment>
        ))}
      </div>

      {!!state.cart.length && (
        <Fragment>
          <Link href="/checkout">
            <Button
              color="primary"
              variant="contained"
              m="1rem 1rem 0.75rem"
              onClick={toggleSidenav}
            >
              <Typography fontWeight={600}>Checkout Now ({currency(getTotalPrice())})</Typography>
            </Button>
          </Link>

          <Link href="/cart">
            <Button color="primary" variant="outlined" m="0px 1rem 0.75rem" onClick={toggleSidenav}>
              <Typography fontWeight={600}>View Cart</Typography>
            </Button>
          </Link>
        </Fragment>
      )}
    </StyledMiniCart>
  );
};

MiniCart.defaultProps = { toggleSidenav: () => {} };

export default MiniCart;
