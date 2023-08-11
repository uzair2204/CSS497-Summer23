import { Fragment, useEffect, useState } from "react";
import Router from "next/router";
import { Formik } from "formik";
import * as yup from "yup";
import Card from "@component/Card";
import CheckBox from "@component/CheckBox";
import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { H6 } from "@component/Typography";
import { Accept } from "react-dropzone";
import Image from "@component/Image";
import { theme } from "@utils/theme";
import styled from "styled-components";
import Box from "@component/Box";
import categoryApi from "@utils/real_api/category-api";
import showAlert from "@utils/show-alert"; // Import the custom showAlert function
import Select from "@component/Select";
import { getListOfSelectedValues } from "@utils/common-utils";
import {Option} from "../../../interfaces/index"
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
    backgroundColor: theme.colors.gray[100],
});


const AddCategory = () => {
    useUserRoleValidation([UserRole.ADMIN]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageChange, setImageChange] = useState(false);
    const [submissionInprogress, setSubmissionInprogress] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState<Option[]>([]);
    const accept: Accept = { "image": ["image/svg+xml"] }
   
    const fetchOptions = async () => {
        try {
          const data = await categoryApi.get(); 
          // Assuming the API response is an array of objects with label and value fields
          setOptions(data.map((item) => ({
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

    const initialValues = {
        name: "",
        slug:"",
        description: "",
        mainCategory: false,
        featured: false,
        children: [],

    };
    const checkoutSchema = yup.object().shape({
        name: yup.string().trim().min(3).required(),
        slug: yup.string().trim().min(3).required(),
        description: yup.string().trim().min(3).required(),
        mainCategory: yup.boolean().required(),
        featured: yup.boolean().required(),
    });

    const handleFormSubmit = async (values) => {
        let formData = new FormData();
        console.log(`called ${JSON.stringify(values)}`);
        if (submissionInprogress) {
            showAlert("previous submission in-progress", "warn");
        } else if (selectedImage === undefined || selectedImage === null) {
            showAlert("Please select an image.", "warn");
        } else {

            setSubmissionInprogress(true);
            try {
                    formData.append('file', selectedImage[0]);
                    formData.append('object', JSON.stringify(values));
                    await categoryApi.post(formData);
                  showAlert("Categoy Updated.", "success");
            } catch (error) {
                console.error('Error uploading file:', error);
                showAlert("Ops Error occur.", "error");

            } finally {
                setSubmissionInprogress(false);
            }

        }
    };

    function choseUpload(files:any) {
        console.log("file");
        setSelectedImage(files);
        setImageChange(true);
    }

    const handleGoBack = () => Router.push("/category");

    const HEADER_LINK = (
        <Button color="primary" bg="primary.light" px="2rem" onClick={handleGoBack}>
           Back to Categories 
        </Button>
    );


    return (
        <Fragment>
            <DashboardPageHeader title="Add Category" iconName="category" button={HEADER_LINK} />
          
            {<Card p="30px">
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}

                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={6}>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="name"
                                        label="Name"
                                        placeholder="name"
                                        onBlur={handleBlur}
                                        value={values.name}
                                        onChange={handleChange}
                                        errorText={touched.name && errors.name}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="slug"
                                        label="Slug"
                                        placeholder="slug"
                                        onBlur={handleBlur}
                                        value={values.slug}
                                        onChange={handleChange}
                                        errorText={touched.slug && errors.slug}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="description"
                                        label="Description"
                                        placeholder="description"
                                        onBlur={handleBlur}
                                        value={values.description}
                                        onChange={handleChange}
                                        errorText={touched.description && errors.description}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <Select
                                        options={options}
                                        isMulti={true}
                                        label="Sub Categories" // Change "Caterogy" to "Category"
                                        value={selectedOption} // Change "values.country" to "values.category"
                                        placeholder="Select Sub Nav"
                                        errorText={touched.children && errors.children} // Change "tags" to "category"
                                        onChange={(selectedOptions: Option[]) => {
                                            // Get the list of selected values
                                            setSelectedOption(selectedOptions)
                                            setFieldValue("children", getListOfSelectedValues(selectedOptions));
                                          }}
                                    />
                                </Grid>
                               
                                <Grid item xs={12}>
                                    <DropZone onChange={choseUpload} label="drop icon here"
                                        accept={accept} maxFiles={1} multiple={false} sublable="uplaod a svg file"
                                    />
                                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                                        {imageChange && <UploadImageBox key={1} mr=".5rem">
                                            <Image src={URL.createObjectURL(selectedImage[0])} width="100%" />
                                        </UploadImageBox>
                                        }
                                    </FlexBox>
                                    </FlexBox>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <CheckBox
                                        mb="1.75rem"
                                        name="mainCategory"
                                        color="secondary"
                                        onChange={handleChange}
                                        checked={values.mainCategory}
                                        label={
                                            <FlexBox>
                                                <H6>Main Category</H6>
                                            </FlexBox>
                                        }
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <CheckBox
                                        mb="1.75rem"
                                        name="featured"
                                        color="secondary"
                                        onChange={handleChange}
                                        checked={values.featured}
                                        label={
                                            <FlexBox>
                                                <H6>Featured</H6>
                                            </FlexBox>
                                        }
                                    />
                                </Grid>
                            </Grid>


                            <Button mt="25px" variant="contained" color="primary" type="submit" disabled={submissionInprogress}>
                                Save
                            </Button>
                        </form>
                    )}
                </Formik>
            </Card>
            }
        </Fragment>
    );
};

AddCategory.layout = AdminDashboardLayout;

export default AddCategory;
