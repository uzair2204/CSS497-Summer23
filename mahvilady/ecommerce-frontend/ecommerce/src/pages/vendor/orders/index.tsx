import { Fragment, useEffect, useState } from "react";
import Hidden from "@component/hidden";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import  { H5, H6 } from "@component/Typography";
import Pagination from "@component/pagination";
import OrderRow from "@component/orders/OrderRow";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Order, { OrderStatus } from "@models/order.model";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";
import orderApi from "@utils/real_api/order-api";
import { PageMeta } from "interfaces";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import Grid from "@component/grid/Grid";
import Box from "@component/Box";
import Select from "@component/Select";

const Orders = () => {
  useUserRoleValidation([UserRole.ADMIN]);
  const [orders, setOrders] = useState<Order[]>(null);
  const [pageMeta, setPageMeta] = useState<PageMeta>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(orderStatusList[4]);
  const [page, setPage] = useState(1);
  const getOrders = async () => {
    if(selectedOrderStatus && selectedOrderStatus.value!=="All"){
      const { data, meta } = await orderApi.getByPagingByStatus(selectedOrderStatus.value,page - 1);
      setOrders(data);
      setPageMeta(meta);
    }else{
      const { data, meta } = await orderApi.getByPaging(page - 1);
      setOrders(data);
      setPageMeta(meta);
    }
   
  };
  
  useEffect(() => {
    getOrders();
  }, [page,selectedOrderStatus]);
 


  const handleOrderStatusChange = (newValue) => {
    setSelectedOrderStatus(newValue);
    console.log(newValue);
  };


  return (
    <Fragment>
      <DashboardPageHeader title="My Orders" iconName="bag_filled" />



      {!orders || orders?.length <= 0 &&
       <Grid container spacing={6}>
        <Grid item lg={4} sm={6} xs={12} key={-1}>
        <H6>You haven't any {selectedOrderStatus.value!=="all" ? selectedOrderStatus.label : ""} orders  . </H6>
        </Grid>
      </Grid>
      }

      {orders && (
          <>
            <TableRow bg="gray.200" p="12px" boxShadow="none" borderRadius={0}>
          

              <Box maxWidth="160px">
                <Select placeholder="Order Status" options={orderStatusList} value={selectedOrderStatus}
                 onChange={(newValue) => handleOrderStatusChange(newValue)}/>
              </Box>
            </TableRow>

            {/* <Box p="1rem 1.5rem 10px">
              <TextField label="Add Product" fullwidth />
            </Box> */}
          </>
        )}
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
        <OrderRow order={item} key={item.id} url="vendor/orders" />
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

const orderStatusList = [
  { label: "Placed", value: OrderStatus.PLACED },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
  {label: "All", value: "All"}
];

Orders.layout = AdminDashboardLayout;

export default Orders;
