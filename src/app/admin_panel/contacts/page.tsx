"use client";

import { Suspense } from "react";
import ContactsPage from "./ContactsPage";

export default function ConversationPageSuspense() {
    return (
        <Suspense>
            <ContactsPage />
        </Suspense>
    );
}
