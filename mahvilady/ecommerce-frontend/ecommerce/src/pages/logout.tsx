import FlexBox from "@component/FlexBox";
import Logout from "@component/sessions/logout";

const LoginPage = () => {
  return (
    <FlexBox minHeight="100vh" alignItems="center" flexDirection="column" justifyContent="center">
      <Logout />
    </FlexBox>
  );
};

export default LoginPage;
