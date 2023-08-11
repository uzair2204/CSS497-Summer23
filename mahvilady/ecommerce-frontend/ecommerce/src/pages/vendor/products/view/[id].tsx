import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Grid from "@component/grid/Grid";
import TextArea from "@component/textarea";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Product from "@models/product.model";
import { H3, H6 } from "@component/Typography";
import { theme } from "@utils/theme";
import FlexBox from "@component/FlexBox";
import Image from "@component/Image";
import CheckBox from "@component/CheckBox";
import prductApi from "@utils/real_api/product-api";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";


const UploadImageBox = styled(Box)({
  width: 70,
  height: 70,
  display: "flex",
  overflow: "hidden",
  borderRadius: "8px",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.primary[100],
});


const ProductDetails = () => {
  useUserRoleValidation([UserRole.ADMIN]);
  const [selectedSizeOption, setSelectedSizeOption] = useState(null);
  const [selectedCatogriesOption, setSelectedCatogriesOption] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>(null);
  const router = useRouter();
  const { id } = router.query;


  const getProduct = async () => {
    if (id !== null && id !== undefined) {
      setLoading(true);
      console.log(id);
      const data = await prductApi.getById(id);
      setProduct(data);
      setSelectedCatogriesOption(data.categories.map((item) => ({
        value: item.id,
        label: item.name,
      })))
      setSelectedSizeOption(data.size?.map((item) => ({
        value: item.id,
        label: item.name,
      })))
      setSelectedBrand({
        value: data.brand.id,
        label: data.brand.name,
      })
      setLoading(false);
    }

  };

  useEffect(() => {
    getProduct();
  }, [id]);


  const HEADER_LINK = (
    <Link href="/vendor/products">
      <Button color="primary" bg="primary.light" px="2rem">
        Back to Product List
      </Button>
    </Link>
  );

  return (
    <Fragment>
      <DashboardPageHeader title="Edit Product" iconName="delivery-box" button={HEADER_LINK} />

      {loading && <H3>Loading...</H3>}

      {product && (
        <Card p="30px">



          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <TextField
                fullwidth disabled
                name="title"
                label="Name"
                placeholder="name"
                value={product?.title}

              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullwidth disabled
                label="Slug"
                value={product?.slug}

              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Select
                isDisabled={true}
                options={selectedCatogriesOption}
                isMulti={true}
                label="Category" // Change "Caterogy" to "Category"
                value={selectedCatogriesOption} // Change "product?.country" to "product?.category"
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Select
                isDisabled={true}
                options={selectedSizeOption}
                isMulti={true}
                label="Size" // Change "Caterogy" to "Category"
                value={selectedSizeOption} // Change "product?.country" to "product?.category"
              />
            </Grid>


            <Grid item xs={12}>
              <label> Images </label>
              <FlexBox flexDirection="row" mt={2} flexWrap="wrap">


                {product.images.map((img, id) => (
                  <UploadImageBox key={id} mr=".5rem">
                    <Image src={`/assets/images/${img}`} width="100%" />
                  </UploadImageBox>
                ))}
              </FlexBox>
            </Grid>


            <Grid item xs={12}>
              {<label> Thumbnail </label>}
              <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                {
                  <UploadImageBox key={product.thumbnail} mr=".5rem">
                    <Image src={`/assets/images/${product.thumbnail}`} width="100%" />
                  </UploadImageBox>
                }

              </FlexBox>
            </Grid>


            <Grid item xs={12}>
              <TextArea
                rows={6}
                fullwidth disabled
                label="Description"
                value={product?.description}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Select
                isDisabled={true}
                options={selectedBrand}
                isMulti={false}
                label="Brand" // Change "Caterogy" to "Category"
                value={selectedBrand} // Change "product?.country" to "product?.category"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullwidth disabled

                label="Stock"

                value={product?.stock}

              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                fullwidth disabled

                label="Retail Price"

                value={product?.retailPrice}

              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                fullwidth disabled

                value={product?.price}
                label="Regular Price"
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                fullwidth
                disabled
                label="Sale Price"

                value={product?.salePrice}

              />



            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullwidth disabled
                label="Discount %"
                value={product.discount}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <CheckBox
                disabled
                mb="1.75rem"
                name="onDiscount"
                color="secondary"
                checked={product?.onDiscount}
                label={
                  <FlexBox>
                    <H6>On Discount</H6>
                  </FlexBox>
                }
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <CheckBox
                disabled
                mb="1.75rem"
                name="published"
                color="secondary"
                checked={product?.published}
                label={
                  <FlexBox>
                    <H6>Published</H6>
                  </FlexBox>
                }
              />
            </Grid>


          </Grid>
          <Link href={`/vendor/products/edit/${product.id}`}>       
            <Button mt="25px" variant="contained" color="primary">
            Edit
            </Button>
          </Link>


        </Card>
      )}
    </Fragment>
  );
};

ProductDetails.layout = AdminDashboardLayout;

export default ProductDetails;
