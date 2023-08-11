import { Fragment, useState } from "react";
// import { GetStaticProps } from "next";
import Router, { useRouter } from "next/router";
import { Formik } from "formik";
import * as yup from "yup";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import { Card1 } from "@component/Card1";
import { Button, IconButton } from "@component/buttons";
import TextField from "@component/text-field";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { UserRole } from "@models/user.model";
import { useUserRoleValidation } from "@component/RBAC";
import { useAppContext } from "@context/AppContext";
import userApi from "@utils/real_api/user-api";
import showAlert from "@utils/show-alert";
import AdminDashboardLayout from "@component/layout/admin-dashboard";

// ===========================================================
//type Props = { user: User };
// ===========================================================

const ProfileEditor = () => {

    const { state } = useAppContext();
    useUserRoleValidation([UserRole.ADMIN]);

    const router = useRouter();

    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisibility((visible) => !visible);
    };


    const user = state.user;


    const INITIAL_VALUES = {
        password: "",
        re_password: "",
        oldPassword: "",
    };

    const VALIDATION_SCHEMA = yup.object().shape({
        oldPassword: yup.string().trim().min(8,"Password must be at least 8 characters").required("${path} is required"),
        password: yup
            .string()
            .required("${path} is required")
            .min(8, "Password must be at least 8 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?[\]\\;',./~`]).*(?=.*[0-9]).*$/,
                "Password must contain at least one capital letter, one special character, and one number"
            ),
        re_password: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Please re-type password"),
    });



    const handleFormSubmit = async (values) => {
        try{
            const updated = await userApi.updatepassword(user?.id,values);
            if(updated){
                showAlert("Password has been changed successfully.","success");
                router.push("/admin-profile");
            }else{
                showAlert("The provided old password is incorrect. Please verify it.",'error');
            }

           
        }catch(error){
            showAlert("The provided old password is incorrect. Please verify it. or error occured",'error');
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
            {user && (
                <Card1>

                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={INITIAL_VALUES}
                        validationSchema={VALIDATION_SCHEMA}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Box mb="30px">
                                    <Grid container horizontal_spacing={6} vertical_spacing={4}>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullwidth
                                                mb="0.75rem"
                                                name="oldPassword"
                                                label="Old Password"
                                                placeholder="*********"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.oldPassword || ""}
                                                errorText={touched.oldPassword && errors.oldPassword}
                                                type={passwordVisibility ? "text" : "password"}
                                                endAdornment={
                                                    <IconButton
                                                        p="0.25rem"

                                                        mr="0.25rem"
                                                        type="button"
                                                        color={passwordVisibility ? "gray.700" : "gray.600"}
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        <Icon variant="small" defaultcolor="currentColor">
                                                            {passwordVisibility ? "eye-alt" : "eye"}
                                                        </Icon>
                                                    </IconButton>
                                                }
                                            />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullwidth
                                                mb="0.75rem"
                                                name="password"
                                                label="New Password"
                                                placeholder="*********"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.password || ""}
                                                errorText={touched.password && errors.password}
                                                type={passwordVisibility ? "text" : "password"}
                                                endAdornment={
                                                    <IconButton
                                                        p="0.25rem"

                                                        mr="0.25rem"
                                                        type="button"
                                                        color={passwordVisibility ? "gray.700" : "gray.600"}
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        <Icon variant="small" defaultcolor="currentColor">
                                                            {passwordVisibility ? "eye-alt" : "eye"}
                                                        </Icon>
                                                    </IconButton>
                                                }
                                            />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                mb="1rem"
                                                fullwidth
                                                name="re_password"
                                                placeholder="*********"
                                                label="Confirm Password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.re_password || ""}
                                                type={passwordVisibility ? "text" : "password"}
                                                errorText={touched.re_password && errors.re_password}
                                                endAdornment={
                                                    <IconButton
                                                        p="0.25rem"

                                                        mr="0.25rem"
                                                        type="button"
                                                        onClick={togglePasswordVisibility}
                                                        color={passwordVisibility ? "gray.700" : "gray.600"}
                                                    >
                                                        <Icon variant="small" defaultcolor="currentColor">
                                                            {passwordVisibility ? "eye-alt" : "eye"}
                                                        </Icon>
                                                    </IconButton>
                                                }
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
