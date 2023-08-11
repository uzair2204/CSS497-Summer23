import { Fragment, useState } from "react";
import Link from "next/link";
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
import { realAxios as axios } from "../../../__server__/mock";
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


const AddService = () => {
  const initialValues = {
    icon: "",
    title: "",
    description: "",
    active: true,
    displayOrder:1,

  };


  const [selectedImage, setSelectedImage] = useState(null);
  const [submissionInprogress, setSubmissionInprogress] = useState(false);
  useUserRoleValidation([UserRole.ADMIN]);

  const accept: Accept = { "image": ["image/svg+xml"] }

  const checkoutSchema = yup.object().shape({
    title: yup.string()
      .trim().min(3).required(),
    active: yup.boolean().required(),
    description: yup.string().trim().min(3).required(),
    displayOrder: yup.number().positive().required()
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    let formData = new FormData();
    console.log( JSON.stringify(values));
    if (submissionInprogress) {
      showAlert("previous submission in-progress", "warn");
    } else if (selectedImage === undefined || selectedImage === null) {
      showAlert("Please select an image.", "warn");
    } else {

      setSubmissionInprogress(true);

      formData.append('file', selectedImage[0]);
      formData.append('service', JSON.stringify(values));

      try {
        const response = await axios.post("/services/v2", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log(response.data);
        resetForm();
        setSelectedImage(null);
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

  function choseUpload(files) {
    console.log(files[0].name);
    setSelectedImage(files);
  }
  const HEADER_LINK = (
    <Link href="/services">
      <Button color="primary" bg="primary.light" px="2rem">
        Back to Services List
      </Button>
    </Link>
  );

  return (
    <Fragment>
      <DashboardPageHeader title="Add Service" iconName="services-icon" button={HEADER_LINK} />

      <Card p="30px">
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
                                        errorText={touched.description && errors.description}
                                    />
                                </Grid>
                <Grid item xs={12}>
                  <DropZone onChange={choseUpload} label="Drop Service Icon Here"
                    accept={accept} maxFiles={1} multiple={false} sublable="uplaod a svg file"
                  />
                  <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                    {selectedImage && <UploadImageBox key={1} mr=".5rem">
                      <Image src={URL.createObjectURL(selectedImage[0])} width="100%" />
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
    </Fragment>
  );
};

AddService.layout = AdminDashboardLayout;

export default AddService;
