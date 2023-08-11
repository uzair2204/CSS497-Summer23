import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import Divider from "@component/Divider";
import TableRow from "@component/TableRow";
import TextArea from "@component/textarea";
import { Button } from "@component/buttons";
import Typography, { H5, H6 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";
import Order, { OrderStatus } from "@models/order.model";
import orderApi from "@utils/real_api/order-api";
import { currency } from "@utils/utils";
import { formatAddress } from "@utils/common-utils";
import showAlert from "@utils/show-alert";
import AdminDashboardLayout from "@component/layout/admin-dashboard";

const OrderDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order>(null);
  useUserRoleValidation([UserRole.ADMIN]);

  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const getOrder = async () => {
    const o = await orderApi.getById(String(id));
    setSelectedOrderStatus({label:o?.status, value:o?.status})
    setOrder(o);
  };

  useEffect(() => {
    getOrder();
  }, [id]);




  const handleOrderStatusChange = (newValue) => {
    setSelectedOrderStatus(newValue);
    console.log(newValue);
  };

  const updateStatus = () => {
    if(order?.status===selectedOrderStatus.value){
      showAlert('No alterations have been made')
      return;
    }
    try{
      orderApi.updateStatus(order?.id,selectedOrderStatus.value);
        showAlert("The order status has been successfully updated","success");
       
    }catch(eror){
      showAlert("An error occurred during the status update process.","error")
    }
  };

  return (
    <Fragment>
      <DashboardPageHeader
        title="Order Details"
        iconName="bag_filled"
        button={
          <Link href="/vendor/orders">
            <Button color="primary" bg="primary.light" px="2rem">
              Back to Order List
            </Button>
          </Link>
        }
      />

      <Card p="0px" mb="30px" overflow="hidden">

          
        {order && (
          <>
            <TableRow bg="gray.200" p="12px" boxShadow="none" borderRadius={0}>
              <FlexBox className="pre" flex="0 0 0 !important" m="6px" alignItems="center">
                <Typography fontSize="14px" color="text.muted" mr="4px">
                  Order ID:
                </Typography>

                <Typography fontSize="14px">{order.id}</Typography>
              </FlexBox>

              <FlexBox className="pre" m="6px" alignItems="center">
                <Typography fontSize="14px" color="text.muted" mr="4px">
                  Placed on:
                </Typography>
               
                <Typography fontSize="14px">{format(new Date(order.createdAt), "dd MMM, yyyy")}</Typography>
              </FlexBox>

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

        <Box py="0.5rem">
          {order && order.items.map((item) => (
            <FlexBox px="1rem" py="0.5rem" flexWrap="wrap" alignItems="center" key={item.id}>
              <FlexBox flex="2 2 260px" m="6px" alignItems="center">
                <Avatar src={`/assets/images/${item.product.thumbnail}`} size={64} />

                <Box ml="20px">
                  <H6 my="0px">Nike React Phantom Run Flyknit 2</H6>
                  <FlexBox alignItems="center">
                    {item.discount > 0 &&
                      <Typography fontSize="12px" color="text.muted">
                        <del>{currency(item.productPrice)}</del> dicsount {item.discount}%
                      </Typography>
                    }
                    <Typography fontSize="14px" color="text.muted">
                      {currency(item.discountedPrice)} x {item.productQuantity}
                    </Typography>

                    {/* <Box maxWidth="60px" ml="8px" mt="0.25rem">
                      <TextField disabled defaultValue={item.productQuantity} type="number" fullwidth />
                    </Box> */}
                  </FlexBox>
                </Box>
              </FlexBox>

              <FlexBox flex="1 1 260px" m="6px" alignItems="center">
                <Typography fontSize="14px" color="text.muted">
                  Brand: {item.product.brand.name} categories : {item.product.categories.map((item) => item.name).join(", ")}
                </Typography>
              </FlexBox>

              {/* <FlexBox flex="0 0 0 !important" m="6px" alignItems="center">
                <IconButton size="small">
                  <Icon variant="small">delete</Icon>
                </IconButton>
              </FlexBox> */}
            </FlexBox>
          ))}
        </Box>
      </Card>
      {order && (

        <Grid container spacing={6}>
          <Grid item lg={6} md={6} xs={12}>
            <Card p="20px 30px" mb="1.5rem">
              <H5 mt="0px" mb="14px">
                Shipping Address
              </H5>

              <TextArea
                rows={5}
                fullwidth
                borderRadius={10}
                disabled
                defaultValue={formatAddress(order.shippingAddress)}
              />
            </Card>

            {/* <Card p="20px 30px">
            <H5 mt="0px" mb="14px">
              Customer's Note
            </H5>
            <TextArea disabled defaultValue="Please deliver ASAP." rows={5} borderRadius={10} fullwidth />
          </Card> */}
          </Grid>

          {/* <Grid item lg={6} md={6} xs={12}>
          <Card p="20px 30px" mb="1.5rem">
            <H5 mt="0px" mb="14px">
              Total Summary
            </H5>

            <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
              <Typography fontSize="14px" color="text.hint">
                Subtotal:
              </Typography>
              <H6 my="0px">$335</H6>
            </FlexBox>

            <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
              <Typography fontSize="14px" color="text.hint">
                Shipping fee:
              </Typography>

              <FlexBox alignItems="center" maxWidth="100px" ml="8px" mt="0.25rem">
                <Typography mr="0.5rem">$</Typography>
                <TextField defaultValue={10} type="number" fullwidth />
              </FlexBox>
            </FlexBox>

            <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
              <Typography fontSize="14px" color="text.hint">
                Discount:
              </Typography>

              <FlexBox alignItems="center" maxWidth="100px" ml="8px" mt="0.25rem">
                <Typography mr="0.5rem">-$</Typography>
                <TextField defaultValue={30} type="number" fullwidth />
              </FlexBox>
            </FlexBox>

            <Divider mb="0.5rem" />

            <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
              <H6 my="0px">Total</H6>
              <H6 my="0px">$315</H6>
            </FlexBox>

            <Typography fontSize="14px">Cash On Delivery</Typography>
          </Card>

          <Button variant="contained" color="primary" ml="auto">
            Save Changes
          </Button>
        </Grid> */}

          <Grid item lg={6} md={6} xs={12}>
            <Card p="20px 30px" mb="1.5rem">
              <H5 mt="0px" mb="14px">
                Total Summary
              </H5>

              <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
                <Typography fontSize="14px" color="text.hint">
                  Subtotal:
                </Typography>

                <H6 my="0px">{currency(order.grossTotal)}</H6>
              </FlexBox>

              <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
                <Typography fontSize="14px" color="text.hint">
                  Shipping fee:
                </Typography>

                <H6 my="0px">${currency(order.shippingCharges)}</H6>
              </FlexBox>

              <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
                <Typography fontSize="14px" color="text.hint">
                  Discount:
                </Typography>

                <H6 my="0px">-{currency(order.discount)}</H6>
              </FlexBox>

              <Divider mb="0.5rem" />

              <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
                <H6 my="0px">Total</H6>
                <H6 my="0px">{currency(order.totalPrice)}</H6>
              </FlexBox>

              <Typography fontSize="14px">Cash On Delivery</Typography>
            </Card>
            <Button variant="contained" color="primary" ml="auto" onClick={updateStatus}>
            Save Changes
          </Button>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

const orderStatusList = [
  { label: "Placed", value: OrderStatus.PLACED },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED }
];

OrderDetails.layout = AdminDashboardLayout;

export default OrderDetails;
