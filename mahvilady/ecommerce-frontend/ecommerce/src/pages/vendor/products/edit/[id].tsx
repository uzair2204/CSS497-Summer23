import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import * as yup from "yup";
import { Formik } from "formik";
import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Grid from "@component/grid/Grid";
import DropZone from "@component/DropZone";
import TextArea from "@component/textarea";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import Product from "@models/product.model";
import { H3, H6 } from "@component/Typography";
import { theme } from "@utils/theme";
import FlexBox from "@component/FlexBox";
import Image from "@component/Image";
import CheckBox from "@component/CheckBox";
import { getListOfSelectedValues } from "@utils/common-utils";
import { Option } from "../../../../interfaces/index"
import categoryApi from "@utils/real_api/category-api";
import sizeApi from "@utils/real_api/size-api";
import prductApi from "@utils/real_api/product-api";
import brandApi from "@utils/real_api/brand-api";
import showAlert from "@utils/show-alert";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";
import { useAppContext } from "@context/AppContext";

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageChange, setImageChange] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedSizeOption, setSelectedSizeOption] = useState(null);
  const [sizeOptions, setSizeOptions] = useState<Option[]>([]);
  const [selectedCatogriesOption, setSelectedCatogriesOption] = useState(null);
  const [catogriesOption, setCatogriesOption] = useState<Option[]>([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandsOption, setBrandsOption] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>(null);
  const router = useRouter();
  const [submissionInprogress, setSubmissionInprogress] = useState(false);
  const { id } = router.query;

  const { state } = useAppContext();

  const fetchOptions = async () => {



    try {
      const data = await categoryApi.get();
      // Assuming the API response is an array of objects with label and value fields
      setCatogriesOption(data.map((item) => ({
        value: item.id,
        label: item.name,
      })));
    } catch (error) {
      console.error('Error fetching options:', error);
    }

    try {
      const data = await sizeApi.get();
      // Assuming the API response is an array of objects with label and value fields
      setSizeOptions(data.map((item) => ({
        value: item.id,
        label: item.name,
      })));
    } catch (error) {
      console.error('Error fetching options:', error);
    }

    try {
      const data = await brandApi.get();
      // Assuming the API response is an array of objects with label and value fields
      setBrandsOption(data.map((item) => ({
        value: item.id,
        label: item.name,
      })));
    } catch (error) {
      console.error('Error fetching options:', error);
    }

  };

  useEffect(() => {
    // Fetch the options when the component mounts
    fetchOptions();
  }, []);



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

  const initialValues = {
    title: product?.title,
    slug: product?.slug,
    description: product?.description,
    stock: product?.stock,
    price: product?.price,
    retailPrice: product?.retailPrice,
    salePrice: product?.salePrice,
    discount: product?.discount,
    published: product?.published,
    onDiscount: product?.onDiscount,
    categories: product?.categories?.map(value => value.id),
    sizes: product?.size?.map(value => value.id),
    brand: product?.brand?.id,
  };

  const checkoutSchema = yup.object().shape({
    title: yup.string().required("required"),
    slug: yup.string().required("required"),
    description: yup.string().required("required"),
    stock: yup.number().typeError('Must be a number')
      .integer('Must be a whole number')
      .required('Field is required'),
    price: yup.number().required("required"),
    retailPrice: yup.number().required("required"),
    salePrice: yup.number().required("required"),
    discount: yup.number().required("required"),
    categories: yup.array().min(1).required("required"),
    published: yup.boolean().required(),
    onDiscount: yup.boolean().required("required"),
    brand: yup.number().required("required").positive("select brand")
  });

  const slugExist = async (value) => {
    if (value === null || value === "" || value === product?.slug)
      return false;
    try {
      return await prductApi.slugExist(value);
    } catch (error) {
      return true;
    }
  };

  const handleFormSubmit = async (values: typeof initialValues) => {
    let formData = new FormData();
    console.log(JSON.stringify(values.brand));
    if (submissionInprogress) {
      showAlert("previous submission in-progress", "warn");
    } else {
      setSubmissionInprogress(true);
      if (selectedImage !== null) {
        console.log(selectedImage.length);
        for (const imageFile of selectedImage) {
          formData.append('images', imageFile);
        }
      }
      if (thumbnail !== null) {
        formData.append('thumbnail', thumbnail[0]);
      }

      formData.append('product', JSON.stringify(values));

      try {
        let response;
        if (thumbnail === null && selectedImage === null) {
          console.log("put")
          response = await prductApi.put(state?.user?.shop?.id, id, formData);
        }else if (selectedImage === null) {
          response = await prductApi.putWithThumbNail(state?.user?.shop?.id, id, formData);
        } else if (thumbnail === null) {
          response = await prductApi.putWithImage(state?.user?.shop?.id, id, formData);
        } else {
          response = await prductApi.putWithImageAndThumbNail(state?.user?.shop?.id, id, formData);
        }


        console.log(response.data);
        setImageChange(false);
        showAlert("Product Updated successfully.", "success");
        // Display a success alert

      } catch (error) {
        console.error('Error uploading file:', error);
        showAlert("Ops Error occur.", "error");

      } finally {
        setSubmissionInprogress(false);
      }
    }
  };

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
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            validate={async (values) => {
              const errors: Partial<any> = {};
              const { slug } = values;
              const slugExists = await slugExist(slug);

              if (slugExists) {
                errors.slug = 'already exists';
              }

              return errors;
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={6}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullwidth
                      name="title"
                      label="Name"
                      placeholder="name"
                      onBlur={handleBlur}
                      value={values.title}
                      onChange={handleChange}
                      errorText={touched.title && errors.title}

                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullwidth
                      name="slug"
                      label="Slug"
                      placeholder="Slug"
                      onBlur={handleBlur}
                      value={values.slug}
                      onChange={handleChange}
                      errorText={touched.slug && errors.slug}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Select
                      options={catogriesOption}
                      isMulti={true}
                      label="Category" // Change "Caterogy" to "Category"
                      value={selectedCatogriesOption} // Change "values.country" to "values.category"
                      placeholder="Select category"
                      errorText={touched.categories && errors.categories} // Change "tags" to "category"
                      onChange={(selectedOptions: Option[]) => {
                        // Get the list of selected values
                        setSelectedCatogriesOption(selectedOptions)
                        setFieldValue("categories", getListOfSelectedValues(selectedOptions));
                      }} // Change "tags" to "category"
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Select
                      options={sizeOptions}
                      isMulti={true}
                      label="Size" // Change "Caterogy" to "Category"
                      value={selectedSizeOption} // Change "values.country" to "values.category"
                      placeholder="Select Size"
                      errorText={touched.sizes && errors.sizes} // Change "tags" to "category"
                      onChange={(selectedOptions: Option[]) => {
                        // Get the list of selected values
                        setSelectedSizeOption(selectedOptions)
                        setFieldValue("sizes", getListOfSelectedValues(selectedOptions));
                      }} // Change "tags" to "category"
                    />
                  </Grid>


                  <Grid item xs={12}>
                    <DropZone onChange={(files) => { setSelectedImage(files); setImageChange(true) }} />

                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                      {imageChange && selectedImage.map((img, id) => (
                        <UploadImageBox key={id} mr=".5rem">
                          <Image src={URL.createObjectURL(img)} width="100%" />
                        </UploadImageBox>
                      ))}

                      {!imageChange && product.images.map((img, id) => (
                        <UploadImageBox key={id} mr=".5rem">
                          <Image src={`/assets/images/${img}`} width="100%" />
                        </UploadImageBox>
                      ))}
                    </FlexBox>
                  </Grid>


                  <Grid item xs={12}>
                    <DropZone multiple={false} label="Drag and Drop Thumbnail" onChange={(files) => { setThumbnail(files); }} />

                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                      {thumbnail && thumbnail.map((img, id) => (
                        <UploadImageBox key={id} mr=".5rem">
                          <Image src={URL.createObjectURL(img)} width="100%" />
                        </UploadImageBox>
                      ))}
                      {!thumbnail &&
                        <UploadImageBox key={product.thumbnail} mr=".5rem">
                          <Image src={`/assets/images/${product.thumbnail}`} width="100%" />
                        </UploadImageBox>
                      }

                    </FlexBox>
                  </Grid>


                  <Grid item xs={12}>
                    <TextArea
                      rows={6}
                      fullwidth
                      name="description"
                      label="Description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Description"
                      value={values.description}
                      errorText={touched.description && errors.description}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Select
                      options={brandsOption}
                      isMulti={false}
                      label="Brand" // Change "Caterogy" to "Category"
                      value={selectedBrand} // Change "values.country" to "values.category"
                      placeholder="Select Brand"
                      errorText={touched.brand && errors.brand} // Change "tags" to "category"
                      onChange={(selectedOptions: Option) => {
                        // Get the list of selected values
                        console.log(selectedOptions);
                        setSelectedBrand(selectedOptions);
                        setFieldValue("brand", selectedOptions.value);
                      }} // Change "tags" to "category"
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullwidth
                      name="stock"
                      label="Stock"
                      type="number"
                      placeholder="Available Stock"
                      onBlur={handleBlur}
                      value={values.stock}
                      onChange={handleChange}
                      errorText={touched.stock && errors.stock}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullwidth
                      name="retailPrice"
                      label="Retail Price"
                      placeholder="retailPrice"
                      onBlur={handleBlur}
                      value={values.retailPrice}
                      onChange={handleChange}
                      errorText={touched.retailPrice && errors.retailPrice}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullwidth
                      name="price"
                      type="number"
                      onBlur={handleBlur}
                      value={values.price}
                      label="Regular Price"
                      onChange={handleChange}
                      placeholder="Regular Price"
                      errorText={touched.price && errors.price}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullwidth
                      type="number"
                      name="salePrice"
                      label="Sale Price"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Sale Price"
                      value={values.salePrice}
                      errorText={touched.salePrice && errors.salePrice}
                    />



                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullwidth
                      type="number"
                      name="discount"
                      label="Discount %"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Sale Price"
                      value={values.discount}
                      errorText={touched.discount && errors.discount}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <CheckBox
                      mb="1.75rem"
                      name="onDiscount"
                      color="secondary"
                      onChange={handleChange}
                      checked={values.onDiscount}
                      label={
                        <FlexBox>
                          <H6>On Discount</H6>
                        </FlexBox>
                      }
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <CheckBox
                      mb="1.75rem"
                      name="published"
                      color="secondary"
                      onChange={handleChange}
                      checked={values.published}
                      label={
                        <FlexBox>
                          <H6>Published</H6>
                        </FlexBox>
                      }
                    />
                  </Grid>


                </Grid>

                <Button mt="25px" variant="contained" disabled={isSubmitting} color="primary" type="submit">
                  Save product
                </Button>
              </form>
            )}
          </Formik>
        </Card>
      )}
    </Fragment>
  );
};

ProductDetails.layout = AdminDashboardLayout;

export default ProductDetails;
