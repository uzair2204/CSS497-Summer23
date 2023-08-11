import { FC } from "react";
import Link from "next/link";
import { format } from "date-fns";
import Box from "@component/Box";
import { Chip } from "@component/Chip";
import Hidden from "@component/hidden";
import Icon from "@component/icon/Icon";
import TableRow from "@component/TableRow";
import { IconButton } from "@component/buttons";
import Typography, { H5, Small } from "@component/Typography";
import { currency } from "@utils/utils";
import Order ,{OrderStatus}from "@models/order.model";

// =================================================
type OrderRowProps = { order: Order , url : string };
// =================================================

const OrderRow: FC<OrderRowProps> = ({ order,url }) => {
  const getColor = (status: string) => {
    switch (status) {
      case OrderStatus.PLACED:
        return "secondary";
      case OrderStatus.SHIPPED:
        return "secondary";
      case OrderStatus.DELIVERED:
        return "success";
      case OrderStatus.CANCELLED:
        return "error";
      default:
        return "";
    }
  };

  return (
    <Link href={`/${url}/${order.id}`} passHref>
      <TableRow as="a" my="1rem" padding="6px 18px">
        <H5 m="6px" textAlign="left">
          #{order.id}
        </H5>

        <Box m="6px">
          <Chip p="0.25rem 1rem" bg={`${getColor(order.status)}.light`}>
            <Small color={`${getColor(order.status)}.main`}>{order.status}</Small>
          </Chip>
        </Box>

        <Typography className="flex-grow pre" m="6px" textAlign="left">
          {format(new Date(order.createdAt), "MMM dd, yyyy")}
        </Typography>

        <Typography m="6px" textAlign="left">
          {currency(order.totalPrice)}
        </Typography>

        <Hidden flex="0 0 0 !important" down={769}>
          <Typography textAlign="center" color="text.muted">
            <IconButton size="small">
              <Icon variant="small" defaultcolor="currentColor">
                arrow-right
              </Icon>
            </IconButton>
          </Typography>
        </Hidden>
      </TableRow>
    </Link>
  );
};

export default OrderRow;
