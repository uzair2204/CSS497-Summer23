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
import serviceApi from "@utils/real_api/service-api";
import showAlert from "@utils/show-alert"; // Import the custom showAlert function
import Service from "@models/service.model";
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


const AddService = () => {

    const router = useRouter();
    useUserRoleValidation([UserRole.ADMIN]);
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState<Service>(null);
    const { id } = router.query;
    useUserRoleValidation([UserRole.ADMIN]);
    const getService = async () => {
        if(id){
        setLoading(true);
        const data = await serviceApi.getById(id);
        setService(data);
        setLoading(false);
        }
    };

    useEffect(() => {
        getService();
    }, [id]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [iconChange, seticonChange] = useState(false);
    const [submissionInprogress, setSubmissionInprogress] = useState(false);

    const accept: Accept = { "image": ["image/svg+xml"] }

    const initialValues = {
        icon: service?.icon || null,
        title: service?.title || null,
        description: service?.description || null,
        active: service?.active || false,
        displayOrder: service?.displayOrder || 0

    };
    const checkoutSchema = yup.object().shape({
        title: yup.string()
            .trim().min(3).required(),
        active: yup.boolean().required(),
        description: yup.string().trim().min(3).required(),
        displayOrder: yup.number().positive().required()
    });

    const handleFormSubmit = async (values) => {
        let formData = new FormData();
        console.log(`called ${iconChange}`);
        if (submissionInprogress) {
            showAlert("previous submission in-progress", "warn");
        } else if (iconChange && (selectedImage === undefined || selectedImage === null)) {
            showAlert("Please select an image.", "warn");
        } else {

            setSubmissionInprogress(true);
            try {
                if (iconChange) {
                    formData.append('file', selectedImage[0]);
                    formData.append('service', JSON.stringify(values));
                    const response = await serviceApi.putWithImage(id,formData);
                    console.log(response.data);
                    // Display a success alert
                    console.log('file change')
                } else {
                    await serviceApi.put(id,values);
                }
                showAlert("Services updated.", "success");
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

    const handleGoBack = () => Router.push("/services");

    const HEADER_LINK = (
        <Button color="primary" bg="primary.light" px="2rem" onClick={handleGoBack}>
            Back to Services List
        </Button>
    );


    return (
        <Fragment>
            <DashboardPageHeader title="Edit Service" iconName="services-icon" button={HEADER_LINK} />
            {loading && <H3>Loading...</H3>}
            {service && <Card p="30px">
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
                                <TextField
                                        fullwidth
                                        name="displayOrder"
                                        label="Display Order"
                                        placeholder="1"
                                        onBlur={handleBlur}
                                        value={values.displayOrder}
                                        onChange={handleChange}
                                        errorText={touched.displayOrder && errors.displayOrder}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <DropZone onChange={choseUpload} label="Drop Service Icon Here"
                                        accept={accept} maxFiles={1} multiple={false} sublable="uplaod a svg file"
                                    />
                                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                                        {iconChange && <UploadImageBox key={1} mr=".5rem">
                                            <Image src={URL.createObjectURL(selectedImage[0])} width="100%" />
                                        </UploadImageBox>
                                        } {!iconChange &&
                                            <UploadImageBox key={1} mr=".5rem">
                                                <Image src={`/assets/images/${service.icon}`} width="100%" />
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

AddService.layout = AdminDashboardLayout;

export default AddService;
