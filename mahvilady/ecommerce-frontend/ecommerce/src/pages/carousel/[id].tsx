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
import carouselAPi from "@utils/real_api/carousel-item-api";
import { HealthCarouselItem } from "@models/carousel.model";
import showAlert from "@utils/show-alert"; // Import the custom showAlert function
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


const EditCarouselItem = () => {
    useUserRoleValidation([UserRole.ADMIN]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [carouselItem, setCarouselItem] = useState<HealthCarouselItem>(null);
    const { id } = router.query;

    const getCarouselItem = async () => {
        if (id) {
            setLoading(true);
            const data = await carouselAPi.getCarouselById(id);
            setCarouselItem(data);
            setLoading(false);
        }
    };

    useEffect(() => {
        getCarouselItem();
    }, [id]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageChange, setImageChange] = useState(false);
    const [submissionInprogress, setSubmissionInprogress] = useState(false);

    const accept: Accept = {"image": [".png", ".jpeg", ".jpg"] }

    const initialValues = {
        title: carouselItem?.title || null,
        subTitle: carouselItem?.subTitle || null,
        buttonText: carouselItem?.buttonText || null,
        buttonLink: carouselItem?.buttonLink || null,
        description: carouselItem?.description || null,
        displayOrder: carouselItem?.displayOrder || null,
        active: carouselItem?.active || false,

    };
    const checkoutSchema = yup.object().shape({
        title: yup.string().trim().min(3).required(),
        buttonLink: yup.string().when('buttonText', {
            is: (value) => value && value.trim() !== '', // Condition for validation
            then: yup.string().trim().min(1).required(),
            otherwise: yup.string(), // No validation when the condition is not met
          }),
        active: yup.boolean().required(),
        displayOrder: yup.number().positive().required()
    });

    const handleFormSubmit = async (values) => {
        let formData = new FormData();
        console.log(`called ${imageChange}`);
        if (submissionInprogress) {
            showAlert("previous submission in-progress", "warn");
        } else if (imageChange && (selectedImage === undefined || selectedImage === null)) {
            showAlert("Please select an image.", "warn");
        } else {

            setSubmissionInprogress(true);
            try {
                if (imageChange) {
                    formData.append('file', selectedImage[0]);
                    formData.append('service', JSON.stringify(values));
                    const response = await carouselAPi.putCarouselsWithImage(id, formData);
                    console.log(response.data);
                    // Display a success alert
                    console.log('file change')
                } else {
                    await carouselAPi.putCarousels(id, values);
                }
                showAlert("HealthCarouselItems updated.", "success");
            } catch (error) {
                console.error('Error uploading file:', error);
                showAlert("Ops Error occur.", "error");

            } finally {
                setSubmissionInprogress(false);
            }

        }
    };

    function choseUpload(files) {
        console.log("file");
        setSelectedImage(files);
        setImageChange(true);
    }

    const handleGoBack = () => Router.push("/carousel");

    const HEADER_LINK = (
        <Button color="primary" bg="primary.light" px="2rem" onClick={handleGoBack}>
            Back to Carousel List
        </Button>
    );


    return (
        <Fragment>
            <DashboardPageHeader title="Edit Carousel Item" iconName="services-icon" button={HEADER_LINK} />
            {loading && <H3>Loading...</H3>}
            {carouselItem && <Card p="30px">
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
                                        name="title"
                                        label="Title"
                                        placeholder="title"
                                        onBlur={handleBlur}
                                        value={values.title}
                                        onChange={handleChange}
                                        errorText={touched.title && errors.title}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="subTitle"
                                        label="Sub Title"
                                        placeholder="Sub Title"
                                        onBlur={handleBlur}
                                        value={values.subTitle}
                                        onChange={handleChange}
                                        errorText={touched.subTitle && errors.subTitle}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="buttonText"
                                        label="Button Text"
                                        placeholder="Button Text"
                                        onBlur={handleBlur}
                                        value={values.buttonText}
                                        onChange={handleChange}
                                        errorText={touched.buttonText && errors.buttonText}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="buttonLink"
                                        label="Button Link"
                                        placeholder="Button Link"
                                        onBlur={handleBlur}
                                        value={values.buttonLink}
                                        onChange={handleChange}
                                        errorText={touched.buttonLink && errors.buttonLink}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="description"
                                        label="description"
                                        placeholder="description"
                                        onBlur={handleBlur}
                                        value={values.description}
                                        onChange={handleChange}
                                        errorText={touched.description && errors.description}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="displayOrder"
                                        label="Display Order"
                                        placeholder="displayOrder"
                                        onBlur={handleBlur}
                                        value={values.displayOrder}
                                        onChange={handleChange}
                                        errorText={touched.displayOrder && errors.displayOrder}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <DropZone onChange={choseUpload} label="Drop HealthCarouselItem Icon Here"
                                        accept={accept} maxFiles={1} multiple={false} sublable="uplaod a svg file"
                                    />
                                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                                        {imageChange && <UploadImageBox key={1} mr=".5rem">
                                            <Image src={URL.createObjectURL(selectedImage[0])} width="100%" />
                                        </UploadImageBox>
                                        } {!imageChange &&
                                            <UploadImageBox key={1} mr=".5rem">
                                                <Image src={`/assets/images/${carouselItem.imgUrl}`} width="100%" />
                                            </UploadImageBox>
                                        }
                                    </FlexBox>
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


                            <Button mt="25px" variant="contained" color="primary" onClick={()=>console.log('clicked')} type="submit" disabled={submissionInprogress}>
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

EditCarouselItem.layout = AdminDashboardLayout;

export default EditCarouselItem;
