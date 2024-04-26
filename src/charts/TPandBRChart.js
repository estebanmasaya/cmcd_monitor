import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const CombinedChart = ({ bitrates, topBandwidths }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Initialize chart
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: bitrates.map((_, index) => index + 1),
                datasets: [
                    {
                        label: 'Bitrate (br)',
                        data: bitrates,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                    {
                        label: 'Top Bandwidth (tp)',
                        data: topBandwidths,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    },
                ],
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
    }, [bitrates, topBandwidths]);

    return (
        <canvas ref={chartRef} style={{ maxWidth: '75%', height: '400px' }}></canvas>
    );
};

export default CombinedChart;
