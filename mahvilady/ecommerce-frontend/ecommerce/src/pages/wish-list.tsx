import { Fragment, useEffect, useState } from "react";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import { ProductCard1 } from "@component/product-cards";
import DashboardLayout from "@component/layout/customer-dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Product from "@models/product.model";
import wishListApi from "@utils/real_api/wish-list-api";
import { PageMeta } from "interfaces";
import { H6 } from "@component/Typography";
import { useAppContext } from "@context/AppContext";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";

const WishList = () => {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PageMeta>(null);
  const [products, setProduct] = useState<Product[]>([]);
  const { state } = useAppContext();

  // const router = useRouter();
  // const hasPermission = useRBAC([UserRole.USER], state?.user?.role);

  // useEffect(() => {
  //   if (!hasPermission) {
  //     console.log(state?.user)
  //     router.push('/'); // Redirect to the dashboard page or another route
  //   }
  // }, [hasPermission]);
  
  useUserRoleValidation([UserRole.USER]);
  const getProduct = async () => {
    if(state?.user){
      const { data, meta } = await wishListApi.getByPaging(state?.user.id, page - 1);
      setProduct(data);
      setMeta(meta);
    }
    
  };
  const handleWishChange = (productId: number | string) => {
    // Your logic for wish change with the productId   
    // Perform any state updates or API calls related to wish change
    setProduct(products.filter((item) => item.id !== productId));

  };


  useEffect(() => {
    getProduct();
  }, [page]);


  const HEADER_LINK = (
    <Button color="primary" bg="primary.light" px="2rem">
      Wish List   
    </Button>
  );

  return (
    
    <Fragment>
      {/* PAGE TITLE AREA */}
      <DashboardPageHeader title='My Wish List ' iconName="heart_filled" button={HEADER_LINK} />

      {/* PRODUCT LIST AREA */}
      <Grid container spacing={6}>
        {products.map((item) => (
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              product={item}
              onWishAction={handleWishChange}
            />
          </Grid>
        ))
        }
      </Grid>
      {!products || products?.length <= 0 &&
       <Grid container spacing={6}>
        <Grid item lg={4} sm={6} xs={12} key={-1}>
        <H6>No Product in Wish List</H6>
        </Grid>
      </Grid>
      }

      {/* PAGINATION AREA */}
      {products && products?.length > 0 &&
      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={meta?.totalPages | 1} onChange={(data) => setPage(data + 1)} />
      </FlexBox>
      }
    </Fragment>
  );
};

WishList.layout = DashboardLayout;

export default WishList;
