import React, { useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";
import Box from "./Box";
import Divider from "./Divider";
import { Button } from "./buttons";
import Typography, { H5, Small } from "./Typography";

export interface DropZoneProps {
  onChange?: (files: []) => void;
  label?: string;
  sublable?: string;
  errorText?: any;
  id?: any;
  maxFiles?: number;
  multiple?: boolean;
  accept?: Accept;

}

const DropZone: React.FC<DropZoneProps> = ({ onChange, maxFiles = 10, multiple = true,
  accept = { "image": ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'] }, label = "Drag & drop Image here", sublable = "Upload 280*280 image" }) => {

  const onDrop = useCallback((acceptedFiles) => {
    if (onChange) onChange(acceptedFiles);
    console.log(acceptedFiles);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    multiple,
    accept,
  });

  return (
    <Box
      display="flex"
      minHeight="200px"
      alignItems="center"
      border="1px dashed"
      borderRadius="10px"
      flexDirection="column"
      borderColor="gray.400"
      justifyContent="center"
      bg={isDragActive && "gray.200"}
      transition="all 250ms ease-in-out"
      style={{ outline: "none" }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <H5 mb="18px" color="text.muted">
        {label}
      </H5>

      <Divider width="200px" mx="auto" />
      <Typography
        px="1rem"
        mb="18px"
        mt="-10px"
        lineHeight="1"
        color="text.muted"
        bg={isDragActive ? "gray.200" : "body.paper"}
      >
        or
      </Typography>

      <Button color="primary" bg="primary.light" px="2rem" mb="22px" type="button">
        Select files
      </Button>

      <Small color="text.muted">{sublable}</Small>
    </Box>
  );
};

export default DropZone;
