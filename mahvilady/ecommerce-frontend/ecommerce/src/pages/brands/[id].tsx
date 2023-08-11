import { Fragment, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
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
import { H3, H6 } from "@component/Typography";
import { Accept } from "react-dropzone";
import Image from "@component/Image";
import { theme } from "@utils/theme";
import styled from "styled-components";
import Box from "@component/Box";
import brandApi from "@utils/real_api/brand-api";
import showAlert from "@utils/show-alert"; // Import the custom showAlert function
import Brand from "@models/Brand.model";
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


const EditBrand = () => {


  useUserRoleValidation([UserRole.ADMIN]);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [brand, setBrand] = useState<Brand>(null);
    const { id } = router.query;

    const getBrand = async () => {
        if(id){
        setLoading(true);
        const data = await brandApi.getById(id);
        setBrand(data);
        setLoading(false);
        }
    };

    useEffect(() => {
        getBrand();
    }, [id]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [iconChange, seticonChange] = useState(false);
    const [submissionInprogress, setSubmissionInprogress] = useState(false);

    const accept: Accept = {"image": [".png", ".jpeg", ".jpg"] }

    const initialValues = {
        image: brand?.image || null,
        name: brand?.name || null,
        slug: brand?.slug || null,
        featured: brand?.featured || false,
        active: brand?.active || false,

    };
    const checkoutSchema = yup.object().shape({
        name: yup.string()
            .trim().min(3).required(),
        slug: yup.string().trim().min(3).required(),
        featured: yup.boolean().required(),
        active: yup.boolean().required(),
    });

    const handleFormSubmit = async (values) => {
        let formData = new FormData();
        if (submissionInprogress) {
            showAlert("previous submission in-progress", "warn");
        } else if (iconChange && (selectedImage === undefined || selectedImage === null)) {
            showAlert("Please select an image.", "warn");
        } else {

            setSubmissionInprogress(true);
            try {
                if (iconChange) {
                    formData.append('file', selectedImage[0]);
                    formData.append('brand', JSON.stringify(values));
                    const response = await brandApi.putWithImage(id,formData);
                    console.log(response.data);
                } else {
                    await brandApi.put(id,values);
                }
                showAlert("Brands updated.", "success");
            } catch (error) {
                console.error('Error uploading file:', error);
                showAlert("Ops Error occur.", "error");

            } finally {
                setSubmissionInprogress(false);
            }

        }
    };

    function choseUpload(files) {
        setSelectedImage(files);
        seticonChange(true);
    }

    const handleGoBack = () => Router.push("/brands");

    const HEADER_LINK = (
        <Button color="primary" bg="primary.light" px="2rem" onClick={handleGoBack}>
            Back to Brands List
        </Button>
    );


    return (
        <Fragment>
            <DashboardPageHeader title="Edit Brand" iconName="brand" button={HEADER_LINK} />
            {loading && <H3>Loading...</H3>}
            {brand && <Card p="30px">
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}

                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
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
                                <Grid item xs={12}>
                                    <DropZone onChange={choseUpload} label="Drop Brand Icon Here"
                                        accept={accept} maxFiles={1} multiple={false} sublable="uplaod a image file"
                                    />
                                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                                        {iconChange && <UploadImageBox key={1} mr=".5rem">
                                            <Image src={URL.createObjectURL(selectedImage[0])} width="100%" />
                                        </UploadImageBox>
                                        } {!iconChange &&
                                            <UploadImageBox key={1} mr=".5rem">
                                                <Image src={`/assets/images/${brand.image}`} width="100%" />
                                            </UploadImageBox>
                                        }
                                    </FlexBox>
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
                                <Grid item sm={6} xs={12}>
                                    <CheckBox 
                                        mb="1.75rem"
                                        name="active"
                                        color="secondary"
                                        onChange={handleChange}
                                        checked={values.active}
                                        label={
                                            <FlexBox>
                                                <H6>Active</H6>
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

EditBrand.layout = AdminDashboardLayout;

export default EditBrand;
