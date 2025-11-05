"use client";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

interface ChartDataPoint {
    date: string;
    value: string; // or number if you parse it
}

interface ChartProps {
    data: ChartDataPoint[];
    title?: string;
}

export default function Chart({ data, title = "Chart" }: ChartProps) {
    const sortedData = [...data]
        .map((item) => ({
            ...item,
            value: parseFloat(item.value) || 0,
        }))
        .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
    const chartData = {
        labels: sortedData.map((d) => d.date),
        datasets: [
            {
                label: title,
                data: sortedData.map((d) => d.value),
                borderColor: "rgb(59, 130, 246)", // blue-500
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                tension: 0.4, // smooth lines
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={chartData} options={options} />;
}
