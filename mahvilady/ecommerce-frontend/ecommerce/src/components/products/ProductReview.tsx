import { FC, useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import Box from "@component/Box";
import Rating from "@component/rating";
import FlexBox from "@component/FlexBox";
import TextArea from "@component/textarea";
import { Button } from "@component/buttons";
import { H2, H5 } from "@component/Typography";
import ProductComment from "./ProductComment";
import Review from "@models/Review.model";
import { useAppContext } from "@context/AppContext";
import reviewApi from "@utils/real_api/review-api";
import showAlert from "@utils/show-alert";
import { useRouter } from "next/router";

type Props = { reviews: Review[], productId: number | string , router: ReturnType<typeof useRouter> ,  slug:string};
const ProductReview: FC<Props> = ({ reviews, productId , router, slug}) => {

  const { state } = useAppContext();
  const [eligibleToReview, setEligibleToreview] = useState(false);
  const initialValues = {
    rating: "",
    comment: "",
  };

  const validationSchema = yup.object().shape({
    rating: yup.number().required("required"),
    comment: yup.string().required("required"),
  });
  const checkReviewEligibility = async () => {
    if (!state.user) {
      return false;
    }
    try {
      // Make the API call and set the eligible state based on the response
      const response = await reviewApi.eligiable(state?.user?.id, productId);
      setEligibleToreview(response); // Assuming the response contains an "eligible" property

    } catch (error) {
      console.error("Error checking review eligibility:", error);
    }
  };
  useEffect(() => {
    // Call the API to check review eligibility
    checkReviewEligibility();
  }, [eligibleToReview]); // Empty dependency array to run the effect only once

  const handleFormSubmit = async (values, { resetForm }) => {
    try{
        await reviewApi.post(state?.user?.id, productId,values);
        showAlert("Thank you for sharing your review.","success")
        resetForm();
        setEligibleToreview(false);
        router.push(`/product/${slug}`);
    }catch(error){
      console.error("Error checking review eligibility:", error);
    }   
    
    
  };

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Box>
      {reviews.map((item, ind) => (
        <ProductComment review={item} key={ind} />
      ))}
      {eligibleToReview &&
        <H2 fontWeight="600" mt="55px" mb="20">
          Write a Review for this product
        </H2>
      }
      {eligibleToReview &&
        <form onSubmit={handleSubmit}>
          <Box mb="20px">
            <FlexBox mb="12px">
              <H5 color="gray.700" mr="6px">
                Your Rating
              </H5>
              <H5 color="error.main">*</H5>
            </FlexBox>

            <Rating
              outof={5}
              color="warn"
              size="medium"
              readonly={false}
              value={values.rating || 0}
              onChange={(value) => setFieldValue("rating", value)}
            />
          </Box>

          <Box mb="24px">
            <FlexBox mb="12px">
              <H5 color="gray.700" mr="6px">
                Your Review
              </H5>
              <H5 color="error.main">*</H5>
            </FlexBox>

            <TextArea
              fullwidth
              rows={8}
              name="comment"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.comment || ""}
              placeholder="Write a review here..."
              errorText={touched.comment && errors.comment}
            />
          </Box>

          <Button
            size="small"
            type="submit"
            color="primary"
            variant="contained"
            disabled={!(dirty && isValid)}
          >
            Submit
          </Button>
        </form>}

    </Box>
  );
};

export default ProductReview;
