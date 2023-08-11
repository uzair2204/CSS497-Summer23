import { FC } from "react";
import Box from "@component/Box";
import Card from "@component/Card";
import Modal from "@component/Modal";
import Icon from "@component/icon/Icon";

// ===================================================
type Props = {
  open: boolean;
  onClose: () => void;
};
// ===================================================

const ServiceQuickView: FC<Props> = (props) => {
  const { open, onClose } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <Card p="1rem" position="relative" maxWidth="800px" width="100%">
      
        <Box position="absolute" top="0.75rem" right="0.75rem" cursor="pointer">
          <Icon className="close" color="primary" variant="small" onClick={onClose}>
            close
          </Icon>
        </Box>
      </Card>
    </Modal>
  );
};

export default ServiceQuickView;
