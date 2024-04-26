// MtpChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MtpChart = ({ mtps }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Initialize chart
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: mtps.map((_, index) => index + 1),
                datasets: [{
                    label: 'Measured Throughput (mtp)',
                    data: mtps,
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
    }, [mtps]);

    return (
        <canvas ref={chartRef} style={{ maxWidth: '80%' , height: '400px'}}></canvas>
    );
};

export default MtpChart;
