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

const BatteryVoltageTimeChart: React.FC = () => {
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
            return `${context.parsed.y}V`
          }
        }
      }
    },
    scales: {
      y: {
        min: 9,
        max: 15,
        ticks: {
          stepSize: 1,
          callback: (value: number) => `${value}V`
        },
        title: {
          display: true,
          text: 'Voltage'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  }

  const labels = ['11:30am', '1:30pm', '3:30pm', '5:30pm', '7:30pm', '9:30pm']

  const data = {
    labels,
    datasets: [
      {
        data: [14, 13.2, 13.2, 13.32, 13.1, 12.8],
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6
      }
    ]
  }

  return (
    <div className="w-full h-full">
      <CardHeader>
        <CardTitle>Battery Voltage Time Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden p-4">
          <Line options={options} data={data} />
        </div>
      </CardContent>
    </div>
  )
}

export default BatteryVoltageTimeChart