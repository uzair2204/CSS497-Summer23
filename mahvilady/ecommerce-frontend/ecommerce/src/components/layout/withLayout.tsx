import React from "react";
import DashboardLayout from "@component/layout/customer-dashboard";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import { UserRole } from "@models/user.model";

function withLayout(Component, user) {
  if (user && user.role === UserRole.ADMIN) {
    return () => (
      <AdminDashboardLayout>
        <Component />
      </AdminDashboardLayout>
    );
  }

  return () => (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

export default withLayout;
