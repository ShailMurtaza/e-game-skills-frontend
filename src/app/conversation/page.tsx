"use client";

import { Suspense } from "react";
import ConversationPage from "./ConversationPage";

export default function ConversationPageSuspense() {
    return (
        <Suspense>
            <ConversationPage />
        </Suspense>
    );
}
