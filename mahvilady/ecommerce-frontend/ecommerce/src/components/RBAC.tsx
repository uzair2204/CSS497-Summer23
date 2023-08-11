// withProtectedPage.tsx
import { UserRole } from '@models/user.model';

import { useEffect } from 'react';
import { useAppContext } from '@context/AppContext';
import { loginUser } from "@utils/common-utils";

export function useRBAC(allowedRoles: UserRole[], userRole: UserRole): boolean {
    return allowedRoles.includes(userRole);
}


import { useRouter } from "next/router";


export const useUserRoleValidation = (allowedRoles: UserRole[]) => {
  const { state } = useAppContext();
  const router = useRouter();
  console.log("logged");
  useEffect(() => {
    const userRole = state?.user?.role || UserRole.USER;
    if (!state?.user) {
        router.push("/"); // Redirect to the desired route
        return; // Return to avoid further execution
      }
    if (!allowedRoles.includes(userRole)) {
        console.log("not allowed");
      router.push("/"); // Redirect to dashboard or another route
    }
  }, [allowedRoles, router, state?.user?.role]);
};




export function useLoadUserData() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // If user data is already in state, no need to load
    if (state.user) {
      return;
    }

    // Load user data from localStorage if available
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      loginUser(dispatch,parsedUserData);
      // You can dispatch any other actions or data loading logic here
    }
  }, [state.user, dispatch]);
}