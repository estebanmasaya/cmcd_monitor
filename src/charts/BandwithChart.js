import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BandwidthChart = ({ bandwidthValues }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Initialize chart
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: bandwidthValues.map((_, index) => index + 1),
                datasets: [{
                    label: 'Bandwidth (kbps)',
                    data: bandwidthValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
    }, [bandwidthValues]);

    return (
        <canvas ref={chartRef} style={{ maxWidth: '75%', height: '400px' }}></canvas>
    );
};

export default BandwidthChart;
