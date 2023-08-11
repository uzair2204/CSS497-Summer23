import { FC, useState } from "react";
import Link from "next/link";
//import { useRouter } from "next/router";
import * as yup from "yup";
import { Formik } from "formik";
import Select from "@component/Select";
import Grid from "@component/grid/Grid";
import { Card1 } from "@component/Card1";
import CheckBox from "@component/CheckBox";
import countryList from "@data/countryList";
import cityList from "@data/pk-cities-list";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography from "@component/Typography";
import Radio from "@component/radio";
import { Option } from "../../interfaces/index";
import orderApi from "@utils/real_api/order-api";
import showAlert from "@utils/show-alert";
import { useAppContext } from "@context/AppContext";
import { useRouter } from "next/router";

const CheckoutForm: FC = () => {
  //const router = useRouter();
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [countryShipping,setCountryShipping] = useState<Option>({label: 'Pakistan', value: 'PK'})
  const [cityShipping,setCityShipping] = useState<Option>(null)
  const [countryBilling,setCountryBilling] = useState<Option>({label: 'Pakistan', value: 'PK'})
  const [cityBilling,setCityBilling] = useState<Option>(null)

  const { state, dispatch } = useAppContext();
  const router = useRouter();

  const handleFormSubmit = async (values) => {
    console.log(values);
     // Format phone numbers to international format
     if(state?.user){
      try{
        const order = await orderApi.post(state?.user?.id,values);
        dispatch({ type: "INITIALIZE_CART", payload: [] });
        showAlert("order placed thanks for purchasing Order Created! Thanks for Your Purchase.","success")
        router.push(`orders/${order.id}`);
      }catch(error){
        showAlert("something went wrong","error");
      }
     }
    
    //router.push("/payment");
   
  };



  const initialValues = {
    shippingName: "",
    shippingCity: "",
    shippingContact: "",
    shippingCompany: "",
    shippingZip: "",
    shippingCountry:  countryShipping.label,
    shippingAddress1: "",
    shippingAddress2: "",
  
    billingName: "",
    billingCity: "",
    billingContact: "",
    billingCompany: "",
    billingZip: "",
    billingCountry: countryBilling.label,
    billingAddress1: "",
    billingAddress2: "",
  };
  
  const checkoutSchema = yup.object().shape({
    shippingName: yup.string().required("required"),
    shippingCity: yup.string().required("required"),
    shippingContact: yup.string().matches(
      /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/,
      "invalid phone number"
    )
    .required("required"),
    shippingZip: yup.string().required("required"),
    shippingCountry: yup.string().required("required"),
    shippingAddress1: yup.string().required("required"),
    billingName: yup.string().when('sameAsShipping', {
      is: false,
      then: yup.string().required('required'),
      otherwise: yup.string(),
    }),
    billingCity: yup.string().when('sameAsShipping', {
      is: false,
      then: yup.string().required('required'),
      otherwise: yup.string(),
    }),
    billingContact: yup.string().when('sameAsShipping', {
      is: false,
      then: yup.string().required('required'),
      otherwise: yup.string(),
    }),
    billingZip: yup.string().when('sameAsShipping', {
      is: false,
      then: yup.string().required('required'),
      otherwise: yup.string(),
    }),
    billingCountry: yup.string().when('sameAsShipping', {
      is: false,
      then: yup.string().required('required'),
      otherwise: yup.string(),
    }),
    billingAddress1: yup.string().when('sameAsShipping', {
      is: false,
      then: yup.string().required('required'),
      otherwise: yup.string(),
    }),
  });

  const handleCheckboxChange =
    (values: typeof initialValues, setFieldValue) =>
      ({ target: { checked } }) => {
        setSameAsShipping(checked);
        setFieldValue("sameAsShipping", checked);
        setFieldValue("billingName", checked ? values.shippingName : "");
      };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={checkoutSchema}
      onSubmit={handleFormSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Card1 mb="2rem">
            <Typography fontWeight="600" mb="1rem">
              Shipping Address
            </Typography>

            <Grid container spacing={7}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  mb="1rem"
                  label="Full Name"
                  name="shippingName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shippingName}
                  errorText={touched.shippingName && errors.shippingName}
                />

                <TextField
                  fullwidth
                  mb="1rem"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="shippingContact"
                  value={values.shippingContact}
                  errorText={touched.shippingContact && errors.shippingContact}
                />

                <TextField
                  fullwidth
                  mb="1rem"
                  type="number"
                  label="Zip Code"
                  onBlur={handleBlur}
                  name="shippingZip"
                  onChange={handleChange}
                  value={values.shippingZip}
                  errorText={touched.shippingZip && errors.shippingZip}
                />

                <TextField
                  fullwidth
                  label="Address 1"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="shippingAddress1"
                  value={values.shippingAddress1}
                  errorText={touched.shippingAddress1 && errors.shippingAddress1}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  mb="1rem"
                  label="Company"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="shippingCompany"
                  value={values.shippingCompany}
                  errorText={touched.shippingCompany && errors.shippingCompany}
                />

                <Select
                  mb="1rem"
                  label="Country"
                  isDisabled={true}
                  options={countryList}
                  value={countryShipping}
                  name="shippingCountry"
                  errorText={touched.shippingCountry && errors.shippingCountry}
                  onChange={(country:Option) =>{setFieldValue("shippingCountry", country.label);setCountryBilling(country);}}
                />

                
                <Select
                  mb="1rem"
                  label="City"
                  options={cityList}
                  value={cityBilling}
                  name="shippingCity"
                  errorText={touched.shippingCity && errors.shippingCity}
                  onChange={(city:Option) =>{setFieldValue("shippingCity", city.label);setCityBilling(city);}}
                />

                <TextField
                  fullwidth
                  label="Address 2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="shippingAddress2"
                  value={values.shippingAddress2}
                  errorText={touched.shippingAddress2 && errors.shippingAddress2}
                />
              </Grid>
            </Grid>
          </Card1>

          <Card1 mb="2rem">
            <Typography fontWeight="600" mb="1rem">
              Billing Address
            </Typography>

            <CheckBox
              color="secondary"
              label="Same as shipping address"
              mb={sameAsShipping ? "" : "1rem"}
              onChange={handleCheckboxChange(values, setFieldValue)}
            />

            {!sameAsShipping && (
              <Grid container spacing={7}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  mb="1rem"
                  label="Full Name"
                  name="billingName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.billingName}
                  errorText={touched.billingName && errors.billingName}
                />

                <TextField
                  fullwidth
                  mb="1rem"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="billingContact"
                  value={values.billingContact}
                  errorText={touched.billingContact && errors.billingContact}
                />

                <TextField
                  fullwidth
                  mb="1rem"
                  type="number"
                  label="Zip Code"
                  onBlur={handleBlur}
                  name="billingZip"
                  onChange={handleChange}
                  value={values.billingZip}
                  errorText={touched.billingZip && errors.billingZip}
                />

                <TextField
                  fullwidth
                  label="Address 1"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="billingAddress1"
                  value={values.billingAddress1}
                  errorText={touched.billingAddress1 && errors.billingAddress1}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  mb="1rem"
                  label="Company"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="billingCompany"
                  value={values.billingCompany}
                  errorText={touched.billingCompany && errors.billingCompany}
                />

                <Select
                  mb="1rem"
                  label="Country"
                  isDisabled={true}
                  options={countryList}
                  value={countryShipping}
                  errorText={touched.billingCountry && errors.billingCountry}
                  onChange={(country:Option) =>{setFieldValue("billingCountry", country.label);setCountryShipping(country);}}
                />

                
                <Select
                  mb="1rem"
                  label="City"
                  options={cityList}
                  value={cityShipping}
                  errorText={touched.billingCity && errors.billingCity}
                  onChange={(city:Option) =>{setFieldValue("billingCity", city.label);setCityShipping(city);}}
                />

                <TextField
                  fullwidth
                  label="Address 2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="billingAddress2"
                  value={values.billingAddress2}
                  errorText={touched.billingAddress2 && errors.billingAddress2}
                />
              </Grid>
            </Grid>
            )}



          </Card1>

          <Card1 mb="2rem">
            <Typography fontWeight="600" mb="1rem">
              Payment Method
            </Typography>
            <Radio
              name="cod"
              color="secondary"
              checked={true}
              disabled
              label={
                <Typography ml="6px" fontWeight="600" fontSize="18px">
                  Cash On Delivery
                </Typography>
              }
            />
          </Card1>

          <Grid container spacing={7}>
            <Grid item sm={6} xs={12}>
              <Link href="/cart">
                <Button variant="outlined" color="primary" type="button" fullwidth>
                  Back to Cart
                </Button>
              </Link>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Button variant="contained" color="primary" type="submit" fullwidth>
                Proceed to CheckOut
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};



export default CheckoutForm;
