"use client";

import { Suspense } from "react";
import AIReportsPage from "./AIReportsPage";

export default function AuthPageSuspense() {
    return (
        <Suspense>
            <AIReportsPage />
        </Suspense>
    );
}
