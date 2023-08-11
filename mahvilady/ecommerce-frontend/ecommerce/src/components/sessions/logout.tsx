import { FC, useEffect } from "react";
import Link from "next/link";
import { H3, H6, SemiSpan } from "@component/Typography";
import { StyledSessionCard } from "./styles";


import { loginUser } from "@utils/common-utils";
import { useAppContext } from "@context/AppContext";
import FlexBox from "@component/FlexBox";

const Logout: FC = () => {

  const { dispatch } = useAppContext();
  
  // Call loginUser with null user on page load
  useEffect(() => {
    loginUser(dispatch, null);
  }, [dispatch]);
   



  

  return (
    <StyledSessionCard mx="auto" my="2rem" boxShadow="large">
        <form className="content">
        <H3 textAlign="center" mb="0.5rem">
            Thank you for visiting Mehvi Cosmetics. We appreciate your interest and look forward to your next visit!
        </H3>
        <FlexBox justifyContent="center" mb="1.25rem">
          <SemiSpan>Wnat to login again</SemiSpan>
          <Link href="/login">
            <a>
              <H6 ml="0.5rem" borderBottom="1px solid" borderColor="primary.main">
                Login
              </H6>
            </a>
          </Link>
        </FlexBox>

        <FlexBox justifyContent="center" mb="1.25rem" >
          <SemiSpan>Don’t have account?</SemiSpan>
          <Link href="/signup">
            <a>
              <H6 ml="0.5rem" borderBottom="1px solid" borderColor="primary.main">
                Sign Up
              </H6>
            </a>
          </Link>
        </FlexBox>
        </form>
    </StyledSessionCard>
  );
};

export default Logout;
