import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@component/avatar";
import Hidden from "@component/hidden";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Pagination from "@component/pagination";
import { IconButton } from "@component/buttons";
import Typography, { H5 } from "@component/Typography";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { PageMeta } from "interfaces";
import Product from "@models/product.model";
import { calculateDiscountAsStr, currency } from "@utils/utils";
import productApi from "@utils/real_api/product-api";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";

const Products = () => {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PageMeta>(null);
  const [products, setProducts] = useState<Product[]>([]);
  useUserRoleValidation([UserRole.ADMIN]);

  const getProducts = async () => {
    const result = await productApi.getByPaging(page - 1);
    setProducts(result.data);
    setMeta(result.meta);
  };

  useEffect(() => {
    getProducts();
  }, [page]);

  return (
    <Fragment>
      <DashboardPageHeader title="Products" iconName="delivery-box" />

      <Hidden down={769}>
        <TableRow padding="0px 18px" mb="-0.125rem" boxShadow="none" bg="none">
          <FlexBox my="0px" mx="6px" flex="2 2 220px !important">
            <H5 ml="56px" color="text.muted" textAlign="left">
              Name
            </H5>
          </FlexBox>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Regular price
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Discounted Price
          </H5>

          <H5 flex="0 0 0 !important" color="text.muted" px="22px" my="0px" >Options</H5>
        </TableRow>
      </Hidden>

      {products.map((item) => (

        

        <TableRow as="a" my="1rem" padding="6px 18px">
          <FlexBox alignItems="center" m="6px" flex="2 2 220px !important">
            <Avatar src={`/assets/images/${item.thumbnail}`} size={36} />
            <Typography textAlign="left" ml="20px">
              {item.title}
            </Typography>
          </FlexBox>

          <H5 m="6px" textAlign="left" fontWeight="400">
            {currency(item.price)}
          </H5>
          <H5 m="6px" textAlign="left" fontWeight="400">
            {calculateDiscountAsStr(item.price, item.discount)}
          </H5>

          <Typography m="6px" textAlign="center" color="text.muted">
            <Link href={`/vendor/products/edit/${item.id}`} key={`edit-${item.id}`} passHref>
              <IconButton size="small">
                <Icon variant="small" defaultcolor="currentColor">
                  edit
                </Icon>
              </IconButton>
            </Link>
            <Link href={`/vendor/products/view/${item.id}`} key={`view-${item.id}`} passHref>
              <IconButton size="small">
                <Icon variant="small" defaultcolor="currentColor">
                  eye
                </Icon>
              </IconButton>
            </Link>
          </Typography>
        </TableRow>

      ))}





      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={meta?.totalPages || 1} onChange={(data) => setPage(data + 1)} />
      </FlexBox>
    </Fragment>
  );
};

Products.layout = AdminDashboardLayout;

export default Products;
