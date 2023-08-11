import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Formik } from "formik";
import * as yup from "yup";
import Card from "@component/Card";
import Select from "@component/Select";
import Grid from "@component/grid/Grid";
import TextArea from "@component/textarea";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { Option } from "../../../interfaces/index"
import { getListOfSelectedValues } from "@utils/common-utils";
import FlexBox from "@component/FlexBox";
import Image from "@component/Image";
import { theme } from "@utils/theme";
import styled from "styled-components";
import Box from "@component/Box";
import CheckBox from "@component/CheckBox";
import { H6 } from "@component/Typography";
import showAlert from "@utils/show-alert";
import categoryApi from "@utils/real_api/category-api";
import sizeApi from "@utils/real_api/size-api";
import prductApi from "@utils/real_api/product-api";
import brandApi from "@utils/real_api/brand-api";
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
  backgroundColor: theme.colors.gray[100],
});

const slugExist = async (value) => {
  if (value === null || value === "")
    return false;
  try {
    return await prductApi.slugExist(value);
  } catch (error) {
    return false;
  }
};




const AddProduct = () => {
  useUserRoleValidation([UserRole.ADMIN]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageChange, setImageChange] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [submissionInprogress, setSubmissionInprogress] = useState(false);
  const [selectedSizeOption, setSelectedSizeOption] = useState(null);
  const [sizeOptions, setSizeOptions] = useState<Option[]>([]);
  const [selectedCatogriesOption, setSelectedCatogriesOption] = useState(null);
  const [catogriesOption, setCatogriesOption] = useState<Option[]>([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandsOption, setBrandsOption] = useState<Option[]>([]);

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


  const { state } = useAppContext();




  const initialValues = {
    title: "",
    slug: "",
    description: "",
    stock: "",
    price: "",
    retailPrice: "",
    salePrice: "",
    discount: "",
    published: false,
    onDiscount: false,
    categories: [],
    sizes: [],
    brand:0,
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
    brand:yup.number().required("required").positive("select brand")
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    let formData = new FormData();
    console.log(JSON.stringify(values.brand));
    if (submissionInprogress) {
      showAlert("previous submission in-progress", "warn");
    } else if (selectedImage === undefined || selectedImage === null || thumbnail === null || thumbnail === undefined) {
      showAlert("please select images or thumbnail.", "warn");

    } else {

      setSubmissionInprogress(true);

   
      console.log(selectedImage.length);
      for (const imageFile of selectedImage) {
        formData.append('images', imageFile);
      }
      formData.append('thumbnail', thumbnail[0]);
      formData.append('product', JSON.stringify(values));
     
      try {
        const response = await prductApi.post(state?.user?.shop?.id,formData);

        console.log(response.data);
        resetForm();
        setSelectedImage(null);
        setThumbnail(null);
        setImageChange(false);
        showAlert("Services added successfully.", "success");
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
      <DashboardPageHeader title="Add Product" iconName="delivery-box" button={HEADER_LINK} />

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
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
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

              <Button mt="25px" variant="contained" color="primary" type="submit">
                Save product
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </Fragment>
  );
};

AddProduct.layout = AdminDashboardLayout;

export default AddProduct;
