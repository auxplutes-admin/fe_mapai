import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const PowerUtilization: React.FC = () => {
  const data = {
    labels: ['11Feb', '16Feb', '23Feb', '27Feb', '3Mar', '7Mar', '11Mar'],
    datasets: [
      {
        label: 'Peak Power',
        data: [750, 740, 760, 780, 740, 720, 780],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: (ctx: any) => {
          return ctx.dataIndex === 3 ? 7 : 4 // Larger point for peak value
        },
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Average Power',
        data: [720, 710, 715, 710, 680, 700, 720],
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#eab308',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}W`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: '#f3f4f6',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      y: {
        min: 200,
        max: 1000,
        grid: {
          display: true,
          color: '#f3f4f6',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
          callback: (value: any) => `${value}W`,
          stepSize: 100,
        },
      },
    },
  }

  return (
    <div className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Power Utilization</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-600">Peak Power</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-medium text-gray-600">Average Power</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </div>
  )
}

export default PowerUtilization