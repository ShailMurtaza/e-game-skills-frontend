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

export default function Chart() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
    );
    const options = {};
    const lineChartData = {
        labels: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
        datasets: [
            {
                label: "Steps",
                data: [3000, 5000, 4500, 6000, 8000, 7000, 9000],
                borderColor: "rgb(75, 192, 192)",
            },
        ],
    };

    return (
        <div className="grid grid-cols-2 w-96 pt-[150px]">
            <Line options={options} data={lineChartData} />
            <Line options={options} data={lineChartData} />
        </div>
    );
}
