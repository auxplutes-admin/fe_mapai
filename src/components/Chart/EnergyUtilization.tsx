import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CardContent, CardHeader, CardTitle } from '../ui/card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const EnergyUtilization: React.FC = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#22c55e',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} kWh`
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 2.5,
        ticks: {
          stepSize: 0.5,
          callback: (value: number) => `${value} kWh`
        },
        grid: {
          color: '#e5e7eb'
        }
      },
      x: {
        grid: {
          color: '#e5e7eb'  
        }
      }
    }
  }

  const labels = ['11 Feb', '16 Feb', '23 Feb', '27 Feb', '3 Mar', '7 Mar', '11 Mar']

  const data = {
    labels,
    datasets: [
      {
        data: [1.3, 1.4, 1.5, 1.5, 1.4, 1.3, 1.2],
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#22c55e',
        pointHoverBorderWidth: 4
      }
    ]
  }

  return (
    <div className="w-full h-full">
      <CardHeader>
        <CardTitle>Energy Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden p-4">
          <Line options={options} data={data} />
        </div>
      </CardContent>
    </div>
  )
}

export default EnergyUtilization