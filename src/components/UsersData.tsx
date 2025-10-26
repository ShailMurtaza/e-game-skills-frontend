// Users Data context provider to share users data with layout and page of admin panel
"use client";
import { createContext, useContext } from "react";

type UsersData = {
    admins: number;
    players: number;
    teams: number;
    banned: number;
};

const usersData: UsersData = {
    admins: 100,
    players: 20,
    teams: 30,
    banned: 40,
};
const UsersDataContext = createContext<UsersData>(usersData);

export function UsersDataProvider({ children }: { children: React.ReactNode }) {
    return (
        <UsersDataContext.Provider value={usersData}>
            {children}
        </UsersDataContext.Provider>
    );
}

export function useUsersData() {
    return useContext(UsersDataContext);
}
