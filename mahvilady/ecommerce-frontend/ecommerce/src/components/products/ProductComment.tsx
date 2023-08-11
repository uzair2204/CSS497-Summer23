import { FC } from "react";
import Box from "@component/Box";
import Avatar from "@component/avatar";
import Rating from "@component/rating";
import FlexBox from "@component/FlexBox";
import { H5, H6, Paragraph, SemiSpan } from "@component/Typography";
import { getDateDifference } from "@utils/utils";
import Review from "@models/Review.model";

// =========================================
type ProductCommentProps = {
  review:Review
};
// =========================================

const ProductComment: FC<ProductCommentProps> = (props) => {
  const { review } = props;

  return (
    <Box mb="32px" maxWidth="600px">
      <FlexBox alignItems="center" mb="1rem">
        <Avatar src={`/assets/images/${review.customer.avatar}`} />

        <Box ml="1rem">
          <H5 mb="4px">{review.customer.name}</H5>

          <FlexBox alignItems="center">
            <Rating value={review.rating} color="warn" readonly />
            <H6 mx="10px">{review.rating}</H6>
            <SemiSpan>{getDateDifference(review.createdAt)}</SemiSpan>
          </FlexBox>
        </Box>
      </FlexBox>

      <Paragraph color="gray.700">{review.comment}</Paragraph>
    </Box>
  );
};

export default ProductComment;
