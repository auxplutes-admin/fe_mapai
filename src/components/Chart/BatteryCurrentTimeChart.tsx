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

const BatteryCurrentTimeChart: React.FC = () => {
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
            return `${context.parsed.y}amp`
          }
        }
      }
    },
    scales: {
      y: {
        min: 2,
        max: 10,
        ticks: {
          stepSize: 2,
          callback: (value: number) => `${value}amp`
        }
      },
      x: {
        grid: {
          display: true
        }
      }
    }
  }

  const data = {
    labels: ['11:30am', '1:30pm', '3:30pm', '5:30pm', '7:30pm', '9:30pm'],
    datasets: [
      {
        data: [4.5, 5, 5.5, 6, 6.5, 7],
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        tension: 0.4
      }
    ]
  }

  return (
    <div className="w-full h-full">
      <CardHeader>
        <CardTitle>Battery Current Time Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden p-4">
          <Line options={options} data={data} />
        </div>
      </CardContent>
    </div>
  )
}

export default BatteryCurrentTimeChart