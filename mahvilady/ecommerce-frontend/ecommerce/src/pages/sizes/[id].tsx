import { Fragment, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Formik } from "formik";
import * as yup from "yup";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { H3} from "@component/Typography";
import sizeApi from "@utils/real_api/size-api";
import showAlert from "@utils/show-alert"; // Import the custom showAlert function
import {Size} from "@models/size.model";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";



interface FormValues {
    name: string;
}

const AddSize = () => {
    useUserRoleValidation([UserRole.ADMIN]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState<Size>(null);
    const { id } = router.query;

    const getSize = async () => {
        if(id){
        setLoading(true);
        const data = await sizeApi.getById(id);
        setSize(data);
        setLoading(false);
        }
    };

    useEffect(() => {
        getSize();
    }, [id]);

    const [submissionInprogress, setSubmissionInprogress] = useState(false);


    const initialValues = {
    name: size?.name || null
    };
    const checkoutSchema = yup.object().shape({
        name: yup.string()
            .trim().min(1).required()
    });

    const existByName = async (value) => {
        try {
          return await sizeApi.existByName(value);
        } catch (error) {
          return false;
        }
      };

    const handleFormSubmit = async (values) => {
        if (submissionInprogress) {
            showAlert("previous submission in-progress", "warn");
        }else {

            setSubmissionInprogress(true);
            try {
                    await sizeApi.put(id,values);
                    showAlert("Sizes updated.", "success");
            } catch (error) {
                console.error('Error uploading file:', error);
                showAlert("Ops Error occur.", "error");

            } finally {
                setSubmissionInprogress(false);
            }

        }
    };


    const handleGoBack = () => Router.push("/sizes");

    const HEADER_LINK = (
        <Button color="primary" bg="primary.light" px="2rem" onClick={handleGoBack}>
            Back to Sizes List
        </Button>
    );


    return (
        <Fragment>
            <DashboardPageHeader title="Edit Size" iconName="sizes-icon" button={HEADER_LINK} />
            {loading && <H3>Loading...</H3>}
            {size && <Card p="30px">
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}
                    validate={async (values) => {
                        const errors: Partial<FormValues> = {};
                        const { name } = values;
                        const sizeExists = await existByName(name);
                
                        if (sizeExists && name!=size.name) {
                          errors.name = 'Size already exists';
                        }
                
                        return errors;
                      }}

                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={6}>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        fullwidth
                                        name="name"
                                        label="Size"
                                        placeholder="xl 250ml etc"
                                        onBlur={handleBlur}
                                        value={values.name}
                                        onChange={handleChange}
                                        errorText={touched.name && errors.name}
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

AddSize.layout = AdminDashboardLayout;

export default AddSize;
