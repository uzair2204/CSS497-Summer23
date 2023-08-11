// utils/showAlert.js

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showAlert = (message, type = "info",position = "top-right") => {
  toast[type](message, {
    position: position,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  console.log("alert");
};

export default showAlert;
