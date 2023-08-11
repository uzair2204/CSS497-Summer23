import { FC } from "react";
import Box from "@component/Box";
import Typography, { H3 } from "@component/Typography";
import Product from "@models/product.model";

type Props = { product: Product };

const ProductDescription: FC<Props> = ({ product })  => {
  return (
    <Box>
      <H3 mb="1rem">Specification:</H3>
      <Typography>
        Brand: {product.brand.name} <br />
        Categories: {product.categories.map((item) => item.name).join(", ")}<br />
        Sizes: {product.size.map((item) => item.name).join(", ")}<br />
        {product.description} <br />
      </Typography>
    </Box>
  );
};

export default ProductDescription;
