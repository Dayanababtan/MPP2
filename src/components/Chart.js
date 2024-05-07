import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Dogs from './Doga';

export default function PieChart() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const ranges = {
            '1-4': { min: 1, max: 4, dog: [], color: 'rgb(255, 99, 132)' },
            '5-7': { min: 5, max:7, dog: [], color: 'rgb(54, 162, 235)' },
            '8-10': { min: 8, max: 10, dog: [], color: 'rgb(255, 205, 86)' },
            '12-15': { min: 12, max: 15, dog: [], color: 'rgb(75, 192, 192)' }
        };

        Dogs.forEach(dog => {
            for (const range in ranges) {
                if (dog.Age >= ranges[range].min && dog.Age < ranges[range].max) {
                    ranges[range].dog.push(dog.Name);
                }
            }
        });

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const myChartRef = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(myChartRef, {
            type: "bar",
            data: {
                labels: Object.keys(ranges),
                datasets: [{
                    label: 'Age Ranges',
                    data: Object.values(ranges).map(range => range.dog.length),
                    backgroundColor: Object.values(ranges).map(range => range.color),
                    hoverOffset: 4
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: { 
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                let range = context.label;
                                let dogNames = ranges[range].dog.join(', ');
                                return dogNames;
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="d-flex justify-content-center" style={{ height: '100vh' }}>
            <div style={{ width: '300px', height: '300px' }}>
                <canvas ref={chartRef} />
            </div>
        </div>
    );
}