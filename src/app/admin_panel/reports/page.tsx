"use client";

import { Suspense } from "react";
import ReportsPage from "./ReportsPage";

export default function AuthPageSuspense() {
    return (
        <Suspense>
            <ReportsPage />
        </Suspense>
    );
}
