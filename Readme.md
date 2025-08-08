# Taqanal Energy Service Technician Dashboard Dashboard

A modern, responsive administrative dashboard for Taqanal Energy management system built with React, TypeScript, and Vite. This application provides comprehensive tools for monitoring, managing, and analyzing energy data and operations.

## 🚀 Features

- **Authentication System** - Secure login and user management
- **Dashboard Overview** - Real-time energy data visualization and analytics
- **Ticket Management** - Create, track, and manage support tickets
- **Device Management** - Monitor and control energy devices
- **Search Functionality** - Advanced search across all system data
- **Settings Management** - Configure system preferences and user settings
- **Responsive Design** - Optimized for desktop and mobile devices
- **Real-time Charts** - Interactive data visualization with Chart.js

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript
- **Build Tool**: Vite 6.0.3
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI
- **Icons**: Lucide React & React Icons
- **Charts**: Chart.js with React-ChartJS-2
- **Routing**: React Router DOM 7.1.0
- **HTTP Client**: Axios 1.7.9
- **Animations**: Tailwind CSS Animate

## 📁 Project Structure
```
├── public/                     # Static assets
│   └── vite.svg               # Vite logo
├── src/
│   ├── api/                   # API integration and services
│   ├── assets/                # Images, fonts, and static files
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (shadcn/ui)
│   │   ├── Chart/            # Chart components
│   │   ├── Form/             # Form components
│   │   ├── Table/            # Table components
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── constant/              # Application constants
│   ├── context/              # React context providers
│   │   └── AuthContext.tsx   # Authentication context
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries and configurations
│   ├── pages/                # Application pages/routes
│   │   ├── Auth/             # Authentication pages
│   │   ├── Dashboard/        # Dashboard pages and layout
│   │   ├── Settings/         # Settings pages
│   │   ├── Tickets/          # Ticket management pages
│   │   └── Search/           # Search functionality
│   ├── styles/               # Global styles and CSS modules
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Main application component
│   ├── AppRouter.tsx         # Application routing configuration
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global CSS styles
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # Project documentation
```

## 🚦 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taqanal.energy.admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (if needed)
   ```bash
   # Create .env file in root directory and add necessary environment variables
   # Example:
   VITE_API_BASE_URL= https://api.example.com
   VITE_SESSION_COOKIE_NAME= af7d393f56f33b39
   ```

### 🏃‍♂️ Local Development

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

### 📦 Build for Production

1. **Create production build**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview production build locally**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

### 🧪 Code Quality

- **Run ESLint**
  ```bash
  npm run lint
  # or
  yarn lint
  ```

## 🔐 Authentication

The application includes a complete authentication system:

- Login page with secure authentication
- Protected routes that require authentication
- User context management throughout the application
- Automatic redirect to login for unauthorized users

## 📊 Key Features

### Dashboard
- Real-time energy monitoring
- Interactive charts and analytics
- System overview and statistics

### Ticket Management
- Create and track support tickets
- View ticket details and history
- Manage ticket status and assignments

### Device Management
- Monitor connected energy devices
- View device details and status
- Control device operations

### Search
- Advanced search functionality
- Filter and sort results
- Quick access to relevant data

## 🎨 UI/UX

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works seamlessly on all device sizes
- **Dark/Light Theme**: Consistent theming throughout
- **Accessibility**: Built with accessibility best practices
- **Performance**: Optimized for fast loading and smooth interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved by Taqanal Energy.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 5173
   npx kill-port 5173
   # Or use a different port
   npm run dev -- --port 3000
   ```

2. **Node modules issues**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

## 📞 Support

For technical support or questions, please contact the development team or create an issue in the repository.

---

**Taqanal Energy Admin Dashboard** - Empowering energy management through technology.
```

This comprehensive README includes:

1. **Clear project description** and purpose
2. **Complete tech stack** information
3. **Detailed file structure** explanation
4. **Step-by-step setup instructions** for local development
5. **Development and build commands**
6. **Feature overview** based on the routing structure
7. **Troubleshooting section** for common issues
8. **Professional formatting** with emojis and clear sections

The instructions are tailored specifically to your Taqanal Energy Admin Dashboard application and include all the necessary information for developers to get started with local development.