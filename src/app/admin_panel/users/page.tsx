"use client";

import { Suspense } from "react";
import Users from "./UsersPage";

export default function AuthPageSuspense() {
    return (
        <Suspense>
            <Users />
        </Suspense>
    );
}
