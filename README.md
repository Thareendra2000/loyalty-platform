# Loyalty Platform - React Frontend

A React-based frontend application for a loyalty program system that integrates with a Go backend and Square Loyalty API.

## Features

- **User Authentication** - Secure login/logout functionality
- **Dashboard** - Overview of user's loyalty points and account status
- **Earn Points** - Interface to earn points through various activities
- **Redeem Points** - Redeem points for rewards and benefits
- **Transaction History** - Complete history of all point transactions
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **React 18+** - Modern React with functional components and hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

## Project Structure

```
src/
├── api/                    # API configuration and calls
│   └── loyaltyApi.ts      # Axios setup and API functions
├── components/            # Reusable UI components
│   └── Navbar.tsx        # Navigation component
├── context/              # React Context for state management
│   └── AuthContext.tsx   # Authentication context
├── pages/                # Page-level components
│   ├── Login.tsx         # Login page
│   ├── Dashboard.tsx     # Dashboard page
│   ├── EarnPoints.tsx    # Earn points page
│   ├── RedeemPoints.tsx  # Redeem points page
│   └── History.tsx       # Transaction history page
├── App.tsx               # Main app component with routing
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Go backend server running (see backend repository)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd loyalty-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Loyalty Platform
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |
| `VITE_APP_NAME` | Application name | `Loyalty Platform` |

## Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Integration

The frontend communicates with the Go backend through the following endpoints:

- `POST /api/login` - User authentication
- `POST /api/earn` - Earn loyalty points
- `POST /api/redeem` - Redeem loyalty points
- `GET /api/balance` - Get current point balance
- `GET /api/history` - Get transaction history

## Authentication

The application uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token refresh on API calls
- Redirect to login on token expiration

## Features Overview

### 1. Login Page
- Email/password authentication
- Form validation
- Error handling
- Automatic redirect after login

### 2. Dashboard
- Current point balance
- Account status (Bronze/Silver/Gold)
- Quick action buttons
- Summary statistics

### 3. Earn Points
- Predefined activities with point values
- Custom point entry form
- Activity descriptions
- Success feedback

### 4. Redeem Points
- Available reward options
- Point requirement validation
- Custom redemption form
- Balance checking

### 5. Transaction History
- Complete transaction log
- Filter by type (earn/redeem)
- Transaction details
- Summary statistics

## Development

### Code Style
- ESLint configuration for code quality
- TypeScript for type safety
- Consistent component patterns
- Proper error handling

### Best Practices
- Functional components with hooks
- Custom hooks for reusable logic
- Context for global state management
- Responsive design with Tailwind CSS
- Proper TypeScript types

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Deploy to AWS S3
```bash
# Build the project
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete
```

## Backend Integration

This frontend is designed to work with the Go backend server. Make sure to:

1. Start the Go backend server first
2. Ensure the backend is running on the correct port (default: 8080)
3. Update the API base URL in the environment variables if needed

For backend setup instructions, see the backend repository README.
