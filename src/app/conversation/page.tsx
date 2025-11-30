"use client";

import { Suspense } from "react";
import AuthPage from "./ConversationPage";

export default function ConversationPageSuspense() {
    return (
        <Suspense>
            <AuthPage />
        </Suspense>
    );
}
