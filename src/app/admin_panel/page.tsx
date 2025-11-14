"use client";
import { useUsersData } from "@/context/UsersData";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function AdminPanel() {
    const usersData = useUsersData();
    const data = {
        labels: Object.keys(usersData?.by_role || {}).map((key) =>
            key.toUpperCase(),
        ),
        datasets: [
            {
                label: "# of Users",
                data: Object.values(usersData?.by_role || {}),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Users",
            },
        },
    };
    return (
        <main>
            <h4>Summary</h4>
            <div className="flex justify-center">
                <div className="w-xl">
                    <Pie options={options} data={data} />
                </div>
            </div>
        </main>
    );
}
