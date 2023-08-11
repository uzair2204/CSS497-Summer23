import { FC } from "react";
import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
//import { Button } from "@component/buttons";
//import TextField from "@component/text-field";
import Typography from "@component/Typography";
import { useAppContext } from "@context/AppContext";
import { calculateDiscount, currency } from "@utils/utils";

const CheckoutSummary: FC = () => {
  const { state } = useAppContext();

  const getTotalPrice = () => {
    return state.cart.reduce((accumulator, item) => accumulator + (item.product.onDiscount ? calculateDiscount(item.product.price, item.product.discount) : item.product.price) * item.qty, 0) || 0;
  };

  const price = getTotalPrice();
  const total = state.cart.reduce((accumulator, item) => accumulator + item.product.price * item.qty, 0) || 0;
  const shipment = price >=2000 ? 0 : 250;

  return (
    <Card1>
      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Subtotal:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(total)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Shipping:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(shipment)}
          </Typography>
        </FlexBox>
      </FlexBox>

      {/* <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Tax:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            $40.
          </Typography>

          <Typography fontWeight="600" fontSize="14px" lineHeight="1">
            00
          </Typography>
        </FlexBox>
      </FlexBox> */}

      <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
        <Typography color="text.hint">Discount:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(total - price)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <Divider mb="1rem" />
      <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
        <Typography color="text.hint">Total:</Typography>
        <FlexBox alignItems="flex-end">
        <Typography fontSize="20px" fontWeight="600" lineHeight="1">
            {currency(price+shipment)}
          </Typography>
        </FlexBox>
      </FlexBox>

      {/* <TextField placeholder="Voucher" fullwidth />

      <Button variant="outlined" color="primary" mt="1rem" mb="30px" fullwidth>
        Apply Voucher
      </Button> */}
    </Card1>
  );
};

export default CheckoutSummary;
