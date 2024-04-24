// BufferStallChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js from 'chart.js/auto'

import { registerables } from 'chart.js'; // Import necessary Chart.js modules
import 'chartjs-adapter-date-fns'; // Import the date adapter

Chart.register(...registerables); // Register necessary modules

const BufferStallChart = ({ bufferStalls }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Extract timestamps from the buffer stalls array
        const timestamps = bufferStalls.map(timestamp => new Date(timestamp).getTime());

        // Initialize chart
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Buffer Stalls',
                    data: timestamps.map(timestamp => ({ x: timestamp, y: 0 })), // Set y-value to 0 for scatter plot
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 6,
                }],
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute' // Adjust time display format as needed
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        display: false // Hide y-axis
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        return () => {
            // Cleanup chart
            chart.destroy();
        };
    }, [bufferStalls]);

    return (
        <canvas ref={chartRef} style={{ maxWidth: '300px', maxHeight: '300px' }}></canvas>
    );
};

export default BufferStallChart;
