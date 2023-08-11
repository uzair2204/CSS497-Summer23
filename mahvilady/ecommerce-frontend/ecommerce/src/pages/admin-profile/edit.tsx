import { Fragment, useState } from "react";
// import { GetStaticProps } from "next";
import Router, { useRouter } from "next/router";
import { Formik } from "formik";
import * as yup from "yup";
import Box from "@component/Box";
import Hidden from "@component/hidden";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import { Card1 } from "@component/Card1";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { UserRole } from "@models/user.model";
import { format } from "date-fns";
import { useUserRoleValidation } from "@component/RBAC";
import { useAppContext } from "@context/AppContext";
import userApi from "@utils/real_api/user-api";
import showAlert from "@utils/show-alert";
import { loginUser } from "@utils/common-utils";
import AdminDashboardLayout from "@component/layout/admin-dashboard";

// ===========================================================
//type Props = { user: User };
// ===========================================================

const ProfileEditor = () => {

  const { state } = useAppContext();
  useUserRoleValidation([UserRole.ADMIN]);
  
  const router = useRouter();
  

  const user = state.user;
  const { dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageChange, setImageChange] = useState(false);
  const [submissionInprogress, setSubmissionInprogress] = useState(false);

  const INITIAL_VALUES = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth ? format(new Date(user?.dateOfBirth), "yyyy-MM-dd") : "",
  };

  const VALIDATION_SCHEMA = yup.object().shape({
    firstName: yup.string().trim().min(3).required("${path} is required"),
    lastName: yup.string().trim().min(3).required("${path} is required"),
    phone: yup.string().matches(
      /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/,
      "invalid phone number start with the country code +92, 0092, 92, or 0, followed by the digit 3 and then 9 additional digits"
    )
      .required("required"),
    email: yup.string().email("invalid email").required("${path} is required").test(
      "email-unique",
      "This email is already taken",
      async function (value) {
        if (value) {
          const emailExists = await userApi.emailExist(value);
          return !(emailExists && value!=user?.email);
        }
        return true; // Allow empty email field
      }
    ),
    dateOfBirth: yup
      .date()
      .max(new Date(), "Birth date must be in the past")
      .required("Birth date is required"),
  });

  function choseUpload(files) {
    console.log("file");
    setSelectedImage(files);
    setImageChange(true);
}

  const handleFormSubmit = async (values) => {
    let formData = new FormData();
    console.log(`called ${JSON.stringify(values)}`);
    if (submissionInprogress) {
        showAlert("previous submission in-progress", "warn");
    } else if (imageChange && (selectedImage === undefined || selectedImage === null)) {
        showAlert("Please select an image.", "warn");
    } else {

        setSubmissionInprogress(true);
        try {
          let updateduser;
            if(imageChange){
              console.log("image change");
                formData.append('image', selectedImage[0]);
                formData.append('user', JSON.stringify(values));
                updateduser = await userApi.putWithImage(user?.id,formData);
            }else{
              updateduser =await userApi.put(user?.id,values);
            }
            await loginUser(dispatch,updateduser);
            showAlert("Profile Updated.", "success");
            router.push('/profile');
        } catch (error) {
            console.error('Error uploading file:', error);
            showAlert("Ops Error occur.", "error");
           
        } finally {
            setSubmissionInprogress(false);
        }

    }
  };

  const handleGoBack = () => Router.push("/admin-profile");

  const HEADER_LINK = (
    <Button color="primary" bg="primary.light" px="2rem" onClick={handleGoBack}>
      Back to Profile
    </Button>
  );

  return (
    <Fragment>
      <DashboardPageHeader iconName="user_filled" title="Edit Profile" button={HEADER_LINK} />
      {user &&(
      <Card1>
        <FlexBox alignItems="flex-end" mb="22px">
          {!imageChange?(
          <Avatar src={`/assets/images/${user?.avatar}`} size={64} />):(<Avatar src={URL.createObjectURL(selectedImage[0])} size={64} />)
          }

          <Box ml="-20px" zIndex={1}>
            <label htmlFor="profile-image">
              <Button
                p="6px"
                as="span"
                size="small"
                height="auto"
                bg="gray.300"
                color="secondary"
                borderRadius="50%"
              >
                <Icon>camera</Icon>
              </Button>
            </label>
          </Box>

          <Hidden>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-image"
              onChange={(e) => {
                console.log(e.target.files[0].name);
                choseUpload(e.target.files);
              }}
            />
          </Hidden>
        </FlexBox>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={INITIAL_VALUES}
          validationSchema={VALIDATION_SCHEMA}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box mb="30px">
                <Grid container horizontal_spacing={6} vertical_spacing={4}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      name="firstName"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      errorText={touched.firstName && errors.firstName}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      name="lastName"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      errorText={touched.lastName && errors.lastName}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      name="email"
                      type="email"
                      label="Email"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      errorText={touched.email && errors.email}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      label="Phone"
                      name="phone"
                      onBlur={handleBlur}
                      value={values.phone}
                      onChange={handleChange}
                      errorText={touched.phone && errors.phone}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullwidth
                      type="date"
                      name="dateOfBirth"
                      label="Birth Date"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.dateOfBirth}
                      errorText={touched.dateOfBirth && errors.dateOfBirth}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </form>
          )}
        </Formik>
      </Card1>)}
    </Fragment>
  );
};

ProfileEditor.layout = AdminDashboardLayout;

// export const getStaticProps: GetStaticProps = async () => {
//   const user = await api.getUser();
//   return { props: { user } };
// };

export default ProfileEditor;
