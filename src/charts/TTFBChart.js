import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TTFBChart = ({ ttfbValues }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Initialize chart
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ttfbValues.map((_, index) => index + 1),
                datasets: [{
                    label: 'Time to First Byte (ms)',
                    data: ttfbValues,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false,
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
    }, [ttfbValues]);

    return (
        <canvas ref={chartRef} style={{ maxWidth: '75%', height: '400px' }}></canvas>
    );
};

export default TTFBChart;
