import { Fragment, useEffect, useState } from "react";
import Hidden from "@component/hidden";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import { H5, H6 } from "@component/Typography";
import Pagination from "@component/pagination";
import OrderRow from "@component/orders/OrderRow";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import CustomerDashboardLayout from "@component/layout/customer-dashboard";
import Order from "@models/order.model";
import orderApi from "@utils/real_api/order-api";
import { PageMeta } from "interfaces";
import Grid from "@component/grid/Grid";
import { useUserRoleValidation } from "@component/RBAC";
import { useAppContext } from "@context/AppContext";
import { UserRole } from "@models/user.model";

// ====================================================
// ====================================================

const OrderList = () => {

  const [orders, setOrders] = useState<Order[]>(null);
  const [pageMeta, setPageMeta] = useState<PageMeta>(null);
  const [page, setPage] = useState(1);
  const { state } = useAppContext();
  const getOrders = async () => {
    if(state?.user){
    const { data, meta } = await orderApi.getByUserId(state?.user?.id,page - 1);
    setOrders(data);
    setPageMeta(meta);
  }
  };
  
  useEffect(() => {
    getOrders();
  }, [page,state?.user]);
 
  useUserRoleValidation([UserRole.USER]);

  return (
    <Fragment>
      <DashboardPageHeader title="My Orders" iconName="bag_filled" />
      {!orders || orders?.length <= 0 &&
       <Grid container spacing={6}>
        <Grid item lg={4} sm={6} xs={12} key={-1}>
        <H6>You haven't made any purchases yet. Please consider buying something. </H6>
        </Grid>
      </Grid>
      }
      {orders && orders?.length > 0 && (
      <Hidden down={769}>
        <TableRow padding="0px 18px" boxShadow="none" bg="none">
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Order #
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Status
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Date purchased
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Total
          </H5>

          <H5 flex="0 0 0 !important" color="text.muted" px="22px" my="0px" />
        </TableRow>
      </Hidden>
      )}
      {orders && orders.map((item) => (
        <OrderRow order={item} key={item.id} url="orders"/>
      ))}
  {orders && orders?.length > 0 && (
      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          onChange={(data) => setPage(data+1)}
          pageCount={pageMeta?.totalPages | 1}
        />
      </FlexBox>
      )}
    </Fragment>
  );
};

OrderList.layout = CustomerDashboardLayout;


export default OrderList;
