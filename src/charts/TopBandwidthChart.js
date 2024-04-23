// TopBandwidthChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TopBandwidthChart = ({ topBandwidths }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Initialize chart
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: topBandwidths.map((_, index) => index + 1),
                datasets: [{
                    label: 'Top Bandwidth (tp)',
                    data: topBandwidths,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
    }, [topBandwidths]);

    return (
        <canvas ref={chartRef} style={{ maxWidth: '300px', maxHeight: '200px' }}></canvas>
    );
};

export default TopBandwidthChart;
