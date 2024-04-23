// BufferStallChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BufferStallChart = ({ bufferStalls }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Extract timestamps from the buffer stalls array
        const timestamps = bufferStalls.map(timestamp => new Date(timestamp).toLocaleTimeString());

        // Initialize chart
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Buffer Stalls',
                    data: bufferStalls.map((_, index) => index + 1),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
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
