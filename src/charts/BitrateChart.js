// BitrateChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BitrateChart = ({ bitrates }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Initialize chart
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: bitrates.map((_, index) => index + 1),
                datasets: [{
                    label: 'Bitrate (br)',
                    data: bitrates,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
    }, [bitrates]);

    return (
        <canvas ref={chartRef} style={{ maxWidth: '600px', maxHeight: '400px' }}></canvas>
    );
};

export default BitrateChart;
