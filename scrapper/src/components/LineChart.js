import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip
);

const LineChart = ({ data }) => {
    if (!Array.isArray(data)) {
        return <div>No data available</div>;
    }

    const validData = data.filter(product => product.entries && product.entries.length > 0);

    if (validData.length === 0) {
        return <div></div>;
    }

    const firstProduct = validData[0];
    const commonLabels = firstProduct.entries.map(entry => formatDate(entry.createdAt));
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        return new Intl.DateTimeFormat("en-US", options).format(date);
      }
    const datasets = validData.map((product, index) => {
        const ratings = product.entries.map(entry => parseFloat(entry.rating));

        // Define an array of colors to choose from
        const colors = ['aqua', 'blue', 'green', 'red', 'orange', 'purple', 'pink', 'yellow'];
        const backgroundColor = colors[index % colors.length]; // Choose a color based on the index

        return {
            label: product.name,
            data: ratings,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            pointBorderColor: backgroundColor,
            fill: true,
            tension: 0.4,
        };
    });

    const chartData = {
        labels: commonLabels,
        datasets: datasets,
    };

    const options = {
        plugins: {
            legend: true,
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Rating',
                },
            },
        },
    };

    return (
        <div >
            <h2 className="pt-4 font-bold pb-4">Product Ratings Over Time</h2>
     
            <Line data={chartData} options={options} />
           
            
        </div>
    );
};

export default LineChart;
