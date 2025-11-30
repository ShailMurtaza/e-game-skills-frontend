"use client";

import { Suspense } from "react";
import AuthPage from "./AuthPage";

export default function AuthPageSuspense() {
    return (
        <Suspense>
            <AuthPage />
        </Suspense>
    );
}
