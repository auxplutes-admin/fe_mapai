import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const BatteryChargeStatusAnalysis: React.FC = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`
        },
        title: {
          display: true,
          text: 'Battery Charge %'
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

  const labels = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '13 PM', '14 PM', '15 PM']

  const data = {
    labels,
    datasets: [
      {
        data: [95, 80, 70, 65, 50, 60, 40, 90],
        backgroundColor: '#22c55e',
        barThickness: 12,
      }
    ]
  }

  return (
    <div className="w-full h-full">
      <Bar 
        options={options} 
        data={data} 
      />
    </div>
  )
}

export default BatteryChargeStatusAnalysis