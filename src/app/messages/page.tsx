"use client";

import { Suspense } from "react";
import MessagesPage from "./MessagesPage";

export default function ConversationPageSuspense() {
    return (
        <Suspense>
            <MessagesPage />
        </Suspense>
    );
}
