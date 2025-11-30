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

type ChartDataPoint = {
    date: string;
    value: number;
};

type ChartProps = {
    dataPoints: ChartDataPoint[];
    title?: string;
};

export default function Chart({ dataPoints, title = "Chart" }: ChartProps) {
    const chartData = {
        labels: dataPoints.map((d) => d.date),
        datasets: [
            {
                label: title,
                data: dataPoints.map((d) => d.value),
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
