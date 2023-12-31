import { FC } from "react";
import Box from "@component/Box";
import Card from "@component/Card";
import Modal from "@component/Modal";
import Icon from "@component/icon/Icon";
import ProductIntro from "./ProductIntro";
import Product from "@models/product.model";

// ===================================================
type Props = {
  open: boolean;
  onClose: () => void;
  product:Product;
};
// ===================================================

const ProductQuickView: FC<Props> = (props) => {
  const { open, onClose, product } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <Card p="1rem" position="relative" maxWidth="800px" width="100%">
        <ProductIntro
          id={product.id}
          title={product.title}
          price={product.price}
          images={product.images}
          brand={product.brand}
          rating={product.rating}
          reviewCounts={product.reviews?.length}
          shop={product.shop}
          stock={product.stock}
          onDiscount={product.onDiscount}
          discount={product.discount}
        />

        <Box position="absolute" top="0.75rem" right="0.75rem" cursor="pointer">
          <Icon className="close" color="primary" variant="small" onClick={onClose}>
            close
          </Icon>
        </Box>
      </Card>
    </Modal>
  );
};

export default ProductQuickView;
