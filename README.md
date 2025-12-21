# Talent Screen - Job Resume Matcher

A React-based web application that allows users to upload resumes, store job descriptions, and match resumes with job opportunities using AI-powered parsing and matching algorithms.

## Features

- 📄 **Resume Upload**: Upload PDF resumes and get AI-parsed structured data
- 💼 **Job Posting**: Post job descriptions and get parsed requirements
- 🔍 **Resume Matching**: Match resumes against job postings with compatibility scores
- 📊 **Multiple Resume Management**: Upload and manage multiple resumes
- 🎯 **Job Search**: Search and filter through job postings
- 📈 **Match Analysis**: View detailed match results with skill gaps and recommendations

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** - Build tool
- **Material-UI (MUI)** - UI component library
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Dropzone** - File uploads

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd talent-screen-web
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_MAX_FILE_SIZE=10485760
```

4. Start the development server:
```bash
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/       # React components
│   ├── common/     # Reusable components
│   ├── Layout/     # Layout components
│   ├── ResumeUpload/
│   ├── JobDescription/
│   └── Matching/
├── pages/          # Page components
├── services/       # API services
│   └── api/        # API client and endpoints
├── hooks/          # Custom React hooks
├── store/          # Zustand stores
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── styles/         # Global styles and theme
```

## API Endpoints

The application integrates with the following backend APIs:

1. **Resume Upload**: `POST /api/jobrole/resume-upload-1/`
2. **Job Store**: `POST /api/jobrole/store-jd-1`
3. **Resume Matching**: `POST /api/jobrole/search-job-by-resume-1/`

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:8000)
- `VITE_MAX_FILE_SIZE` - Maximum file size for resume uploads in bytes (default: 10485760 = 10MB)

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## Features in Detail

### Resume Upload
- Drag and drop PDF file upload
- File validation (PDF only, size limits)
- Automatic parsing of resume data
- Display parsed skills, experience, and summary

### Job Posting
- Create new job postings
- Automatic parsing of job requirements
- View all posted jobs
- Edit and delete jobs

### Resume Matching
- Select a resume to match
- Match against all available jobs
- View match scores and analysis
- See matched and missing skills
- Experience compatibility check

## Authentication

The application uses Bearer token authentication. Tokens are stored in localStorage and automatically added to API requests via Axios interceptors.

## State Management

- **TanStack Query**: Manages server state (API calls, caching, refetching)
- **Zustand**: Manages client state (resumes, jobs, UI state)
- **LocalStorage**: Persists resume and job data

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

