import Grid from "@component/grid/Grid";
import CheckoutForm from "@sections/checkout/CheckoutForm";
import CheckoutSummary from "@sections/checkout/CheckoutSummary";
import CheckoutNavLayout from "@component/layout/CheckoutNavLayout";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";

const Checkout = () => {
  useUserRoleValidation([UserRole.USER]);

  return (
    <Grid container flexWrap="wrap-reverse" spacing={6}>
      <Grid item lg={8} md={8} xs={12}>
        <CheckoutForm />
      </Grid>

      <Grid item lg={4} md={4} xs={12}>
        <CheckoutSummary />
      </Grid>
    </Grid>
  );
};

Checkout.layout = CheckoutNavLayout;

export default Checkout;
