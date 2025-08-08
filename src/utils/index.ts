export const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Active':
            return 'inline-block px-2 py-1 rounded-md bg-green-500 text-white font-medium text-sm'
        case 'In-Progress':
            return 'inline-block px-2 py-1 rounded-md bg-yellow-500 text-white font-medium text-sm'
        case 'Resolved':
            return 'inline-block px-2 py-1 rounded-md bg-green-500 text-white font-medium text-sm'
        case 'Pending':
            return 'inline-block px-2 py-1 rounded-md bg-red-500 text-white font-medium text-sm'
        case 'Cancelled':
            return 'inline-block px-2 py-1 rounded-md bg-red-500 text-white font-medium text-sm'
        case 'Escalated':
            return 'inline-block px-2 py-1 rounded-md bg-orange-500 text-white font-medium text-sm'
        case 'Acknowledged':
            return 'inline-block px-2 py-1 rounded-md bg-blue-500 text-white font-medium text-sm'
        default:
            return 'inline-block px-2 py-1 rounded-md bg-red-500 text-white font-medium text-sm'
    }
}

export const getSeverityBadge = (severity: string) => {
    switch (severity) {
        case 'High':
            return 'inline-block px-2 py-1 rounded-md bg-red-500 text-white font-medium text-sm'
        case 'Medium':
            return 'inline-block px-2 py-1 rounded-md bg-yellow-500 text-white font-medium text-sm'
        case 'Low':
            return 'inline-block px-2 py-1 rounded-md bg-green-500 text-white font-medium text-sm'
        default:
            return 'inline-block px-2 py-1 rounded-md bg-red-500 text-white font-medium text-sm'
    }
}

export const getJobStatusColor = (status: string) => {
    switch (status) {
        case 'not-started':
            return 'inline-block px-2 py-2 rounded-md bg-green-500 text-white font-medium text-sm'
        case 'in-progress':
            return 'inline-block px-2 py-2 rounded-md bg-yellow-500 text-white font-medium text-sm'
        case 'paused':
            return 'inline-block px-2 py-2 rounded-md bg-blue-500 text-white font-medium text-sm'
        case 'completed':
            return 'inline-block px-2 py-2 rounded-md bg-green-500 text-white font-medium text-sm'
        case 'cancelled':
            return 'inline-block px-2 py-2 rounded-md bg-red-500 text-white font-medium text-sm'
        case 'escalated':
            return 'inline-block px-2 py-2 rounded-md bg-orange-500 text-white font-medium text-sm'
        case 'acknowledged':
            return 'inline-block px-2 py-2 rounded-md bg-blue-500 text-white font-medium text-sm'
    }
}