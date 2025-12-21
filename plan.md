# Job Resume Matcher - Implementation Plan

## Project Overview
A React-based web application that allows users to upload resumes, store job descriptions, and match resumes with job opportunities using AI-powered parsing and matching algorithms.

### Key Decisions
- **Framework**: React with TypeScript + Vite
- **UI Library**: Material-UI (MUI) for professional components
- **State Management**: Zustand (client) + TanStack Query (server)
- **Authentication**: Bearer token-based
- **Architecture**: Multi-page application with React Router
- **Features**: Multiple resume support, Job CRUD operations, Search & filtering

## API Endpoints Summary

### 1. Resume Upload API
- **Endpoint**: `POST /api/jobrole/resume-upload-1/`
- **Purpose**: Parse uploaded resume PDF and extract structured data
- **Input**: Multipart form data with PDF file
- **Output**: 
  - `years_of_experience`: Number
  - `skills`: Array of strings
  - `technical_experience`: String
  - `summary`: String

### 2. Job Description Store API
- **Endpoint**: `POST /api/jobrole/store-jd-1`
- **Purpose**: Store and parse job description
- **Input**: JSON with `title` and `description`
- **Output**: Parsed job data with same structure as resume (skills, experience, etc.)

### 3. Resume-Job Matching API
- **Endpoint**: `POST /api/jobrole/search-job-by-resume-1/`
- **Purpose**: Match resume data against stored jobs
- **Input**: JSON with `resume_data` object
- **Output**: Matching jobs with scores
  - **Note**: Need actual API response structure to implement UI properly
  - Expected: Array of matched jobs with match scores, matched skills, etc.

---

## Technical Stack

### Frontend Framework
- **React** (with TypeScript recommended)
- **Build Tool**: Vite or Create React App
- **Package Manager**: npm/yarn/pnpm

### UI/UX Libraries
- **Material-UI (MUI)** - Professional, comprehensive component library
- **MUI Icons** - Icon set
- **Emotion** - CSS-in-JS (comes with MUI)

### State Management
- **TanStack Query (React Query)** - For server state and API calls
- **Zustand** - For client state management (lightweight, simple)
- **React Hook Form** - For form handling and validation

### HTTP Client
- **Axios** - With interceptors for Bearer token authentication

### File Handling
- **react-dropzone** - For drag-and-drop file uploads
- **PDF.js** - For client-side PDF preview (optional)

### Authentication
- **Bearer Token** - JWT token-based authentication
- Token stored in localStorage/sessionStorage
- Axios interceptors for automatic token injection

---

## Project Structure

```
talent-screen-web/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Loading/
│   │   │   └── ErrorBoundary/
│   │   ├── ResumeUpload/
│   │   │   ├── ResumeUploadForm.tsx
│   │   │   ├── ResumePreview.tsx
│   │   │   └── ResumeDataDisplay.tsx
│   │   ├── JobDescription/
│   │   │   ├── JobForm.tsx
│   │   │   ├── JobList.tsx
│   │   │   └── JobCard.tsx
│   │   ├── Matching/
│   │   │   ├── MatchResults.tsx
│   │   │   ├── MatchScore.tsx
│   │   │   └── MatchDetails.tsx
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx (if authentication required)
│   │   ├── ResumeUploadPage.tsx
│   │   ├── ResumeListPage.tsx (manage multiple resumes)
│   │   ├── JobPostingPage.tsx
│   │   ├── JobListPage.tsx (browse all jobs)
│   │   ├── MatchingPage.tsx
│   │   └── ResultsPage.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts (axios instance with auth)
│   │   │   ├── authApi.ts (login, token refresh)
│   │   │   ├── resumeApi.ts
│   │   │   ├── jobApi.ts (CRUD operations)
│   │   │   └── matchingApi.ts
│   │   └── utils/
│   │       ├── fileUtils.ts
│   │       └── formatters.ts
│   ├── hooks/
│   │   ├── useResumeUpload.ts
│   │   ├── useResumeList.ts
│   │   ├── useJobStore.ts
│   │   ├── useJobList.ts
│   │   ├── useResumeMatching.ts
│   │   └── useAuth.ts
│   ├── types/
│   │   ├── resume.types.ts
│   │   ├── job.types.ts
│   │   ├── auth.types.ts
│   │   └── api.types.ts
│   ├── store/
│   │   ├── resumeStore.ts (Zustand)
│   │   ├── jobStore.ts (Zustand)
│   │   └── authStore.ts (Zustand)
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Implementation Phases

### Phase 1: Project Setup & Configuration (Day 1)
**Tasks:**
- [ ] Initialize React project with Vite + TypeScript
- [ ] Set up TypeScript configuration
- [ ] Install core dependencies:
  - [ ] React Router DOM
  - [ ] Axios
  - [ ] TanStack Query
  - [ ] Zustand
  - [ ] Material-UI (MUI) + Icons
  - [ ] React Hook Form
  - [ ] react-dropzone
- [ ] Set up project folder structure
- [ ] Configure environment variables (.env)
- [ ] Set up API client with Bearer token authentication
- [ ] Configure Axios interceptors
- [ ] Set up routing structure (React Router)
- [ ] Configure Material-UI theme
- [ ] Set up Zustand store structure
- [ ] Create authentication store

**Deliverables:**
- Working React app with routing
- API client configured
- Environment setup complete

---

### Phase 2: Core API Integration (Day 2-3)
**Tasks:**
- [ ] Create TypeScript interfaces for API responses
- [ ] Implement Authentication API service
  - [ ] Login endpoint
  - [ ] Token storage
  - [ ] Token refresh (if available)
  - [ ] Logout handler
- [ ] Implement Resume Upload API service
  - [ ] File upload handler
  - [ ] FormData preparation
  - [ ] Error handling
  - [ ] Response parsing
  - [ ] Store resume with ID (if returned)
- [ ] Implement Job Description Store API service
  - [ ] Create job (POST)
  - [ ] Update job (PUT/PATCH) - if API supports
  - [ ] Delete job (DELETE) - if API supports
  - [ ] Get job list (GET) - if API supports
  - [ ] Error handling
- [ ] Implement Resume Matching API service
  - [ ] Request payload preparation
  - [ ] API call handler
  - [ ] Response handling
  - [ ] Parse match results
- [ ] Create custom hooks for each API
- [ ] Add loading and error states

**Deliverables:**
- All three APIs integrated
- Custom hooks for API calls
- Error handling implemented

---

### Phase 3: Resume Upload Feature (Day 4-5)
**Tasks:**
- [ ] Create ResumeUploadForm component
  - [ ] File input with drag-and-drop
  - [ ] File validation (PDF only, size limits)
  - [ ] Upload progress indicator
- [ ] Create ResumePreview component
  - [ ] Display parsed resume data
  - [ ] Show skills, experience, summary
  - [ ] Edit/update functionality (if needed)
- [ ] Create ResumeUploadPage
  - [ ] Integrate form and preview
  - [ ] Handle success/error states
  - [ ] Store resume data in state/store
  - [ ] Support multiple resume uploads
  - [ ] Resume list/management view
- [ ] Add file preview (optional PDF viewer)
- [ ] Create ResumeList component
  - [ ] Display all uploaded resumes
  - [ ] Select resume for matching
  - [ ] Delete resume functionality

**Deliverables:**
- Resume upload page functional
- Resume data displayed after upload
- Error handling and validation

---

### Phase 4: Job Description Management (Day 6-7)
**Tasks:**
- [ ] Create JobForm component
  - [ ] Title input
  - [ ] Description textarea
  - [ ] Form validation (React Hook Form)
  - [ ] Submit handler
  - [ ] Edit mode support
- [ ] Create JobCard component
  - [ ] Display job title
  - [ ] Display parsed skills and requirements
  - [ ] Action buttons (edit, delete, match)
  - [ ] Confirmation dialog for delete
- [ ] Create JobList component
  - [ ] Display list of stored jobs
  - [ ] Search functionality
  - [ ] Filtering by skills, experience
  - [ ] Sorting options
  - [ ] Empty state
  - [ ] Loading skeleton
- [ ] Create JobPostingPage
  - [ ] Form to add new jobs
  - [ ] List of existing jobs
  - [ ] Job management (CRUD operations)
  - [ ] Edit job functionality (modal or separate page)
  - [ ] Delete job functionality with confirmation
  - [ ] Search and filter jobs
- [ ] Create JobListPage (if separate from posting)
  - [ ] Browse all jobs
  - [ ] Search and filter
  - [ ] Click to view details

**Deliverables:**
- Job posting page functional
- Jobs can be stored and displayed
- Job list with parsed data

---

### Phase 5: Resume-Job Matching Feature (Day 8-9)
**Tasks:**
- [ ] Create MatchResults component
  - [ ] Display list of matched jobs
  - [ ] Match score visualization
  - [ ] Sorting by match score
- [ ] Create MatchScore component
  - [ ] Visual score indicator (progress bar, stars, percentage)
  - [ ] Score breakdown (skills match, experience match, etc.)
- [ ] Create MatchDetails component
  - [ ] Show matched skills
  - [ ] Show missing skills
  - [ ] Experience comparison
  - [ ] Recommendations
- [ ] Create MatchingPage
  - [ ] Select resume from multiple resumes
  - [ ] Trigger matching
  - [ ] Display results
  - [ ] Export functionality (PDF/CSV)
  - [ ] Save match history

**Deliverables:**
- Matching page functional
- Match results displayed with scores
- Detailed match analysis

---

### Phase 6: UI/UX Enhancement (Day 10-11)
**Tasks:**
- [ ] Design and implement layout components
  - [ ] Header with navigation
  - [ ] Sidebar (if needed)
  - [ ] Footer
- [ ] Apply consistent styling
  - [ ] Color scheme
  - [ ] Typography
  - [ ] Spacing and layout
- [ ] Add loading states and skeletons
- [ ] Add empty states
- [ ] Improve error messages
- [ ] Add success notifications/toasts
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

**Deliverables:**
- Polished UI with consistent design
- Responsive layout
- Better UX with loading/error states

---

### Phase 7: Advanced Features (Day 12-13)
**Tasks:**
- [ ] Resume management (already partially done)
  - [ ] View all uploaded resumes (ResumeListPage)
  - [ ] Delete resumes with confirmation
  - [ ] Edit parsed data (if API supports)
  - [ ] Resume selection for matching
- [ ] Job search and filtering (already partially done)
  - [ ] Search by title/keywords
  - [ ] Filter by skills, experience
  - [ ] Sort options
- [ ] Match history
  - [ ] Save match results to localStorage/backend
  - [ ] View previous matches
  - [ ] Compare different match sessions
- [ ] Export functionality
  - [ ] Export match results as PDF
  - [ ] Export as CSV
  - [ ] Print-friendly view
- [ ] User preferences
  - [ ] Theme selection (light/dark) - MUI theme toggle
  - [ ] Settings page
  - [ ] Profile management (if authentication includes profile)

**Deliverables:**
- Advanced features implemented
- Enhanced user experience

---

### Phase 8: Testing & Optimization (Day 14)
**Tasks:**
- [ ] Unit tests for components
- [ ] Integration tests for API calls
- [ ] E2E tests for critical flows
- [ ] Performance optimization
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Image optimization
- [ ] Error boundary implementation
- [ ] API error handling improvements
- [ ] Loading state optimization

**Deliverables:**
- Test coverage
- Optimized performance
- Robust error handling

---

### Phase 9: Documentation & Deployment Prep (Day 15)
**Tasks:**
- [ ] Update README.md
  - [ ] Installation instructions
  - [ ] Environment variables setup
  - [ ] API configuration
  - [ ] Usage guide
- [ ] Code documentation (JSDoc comments)
- [ ] Create deployment configuration
  - [ ] Build scripts
  - [ ] Environment variables for production
- [ ] Prepare for deployment (Vercel, Netlify, etc.)

**Deliverables:**
- Complete documentation
- Deployment-ready application

---

## Key Components Details

### 1. ResumeUploadForm
**Props:**
- `onUploadSuccess: (data: ResumeData) => void`
- `onUploadError: (error: Error) => void`

**Features:**
- Drag and drop file upload
- PDF file validation
- File size validation (max 10MB recommended)
- Upload progress indicator
- Error handling

### 2. ResumeDataDisplay
**Props:**
- `resumeData: ResumeData`

**Features:**
- Display years of experience
- Skills list with tags/badges
- Technical experience section
- Summary section
- Edit button (if editing is allowed)

### 3. JobForm
**Props:**
- `onSubmit: (jobData: JobInput) => void`
- `initialData?: JobInput` (for editing)

**Features:**
- Title input field
- Description textarea
- Form validation
- Submit button with loading state

### 4. MatchResults
**Props:**
- `matches: MatchResult[]`
- `resumeData: ResumeData`

**Features:**
- List of matched jobs
- Match score display
- Sort by score
- Filter options
- Click to view details

### 5. MatchScore
**Props:**
- `score: number` (0-100)
- `breakdown?: ScoreBreakdown`

**Features:**
- Visual score indicator
- Percentage display
- Color coding (red/yellow/green)
- Breakdown visualization (if available)

---

## API Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### API Client Setup
- Base URL configuration
- Bearer token authentication
- Request interceptors (add Authorization header)
- Response interceptors (handle 401, refresh token)
- Error handling
- Timeout configuration

### Authentication Flow
- User logs in and receives Bearer token
- Token stored in localStorage
- Axios interceptor adds `Authorization: Bearer <token>` to all requests
- Handle token expiration and refresh (if applicable)

---

## Data Types

### ResumeData
```typescript
interface ResumeData {
  years_of_experience: number;
  skills: string[];
  technical_experience: string;
  summary: string | null;
}
```

### JobInput
```typescript
interface JobInput {
  title: string;
  description: string;
}
```

### JobData
```typescript
interface JobData {
  id?: string;
  title: string;
  description: string;
  parsed_data: ResumeData;
  created_at?: string;
  updated_at?: string;
}
```

### ResumeWithId
```typescript
interface ResumeWithId extends ResumeData {
  id: string;
  filename: string;
  uploaded_at: string;
}
```

### AuthData
```typescript
interface AuthData {
  token: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}
```

### MatchResult
```typescript
interface MatchResult {
  job: JobData;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  experience_match: boolean;
}
```

---

## User Flow

### Flow 1: Upload Resume → Match Jobs
1. User lands on homepage
2. User clicks "Upload Resume"
3. User uploads PDF resume
4. Resume is parsed and displayed
5. User clicks "Find Matching Jobs"
6. System matches resume against stored jobs
7. Results displayed with scores

### Flow 2: Post Job → Match Resumes
1. User navigates to "Post Job"
2. User enters job title and description
3. Job is stored and parsed
4. User can view stored job
5. User can match resumes against this job

### Flow 3: Browse & Match
1. User views list of stored jobs
2. User selects a job
3. User uploads/selects resume
4. System matches and shows results

---

## Technical Considerations

### Bearer Token Authentication
- Token obtained from login/authentication endpoint
- Token stored in localStorage or sessionStorage
- Axios interceptor automatically adds token to Authorization header
- Handle 401 responses (unauthorized) - redirect to login
- Token refresh mechanism (if refresh token endpoint available)

### File Upload
- Use FormData for multipart/form-data
- Handle large files (progress tracking)
- Client-side validation before upload
- Error handling for upload failures

### State Management
- **TanStack Query** for server state (API calls, caching, refetching)
- **Zustand** for client state (selected resume, UI state, filters)
- Persist resume data in localStorage (for resume list)
- Persist authentication token in localStorage

### Error Handling
- Network errors
- API errors (400, 401, 403, 404, 500)
- File upload errors
- Validation errors
- User-friendly error messages

### Performance
- Lazy load routes
- Code splitting
- Optimize re-renders
- Debounce search inputs
- Cache API responses

---

## Decisions Made

1. ✅ **UI Library**: Material-UI (MUI) - Professional and comprehensive
2. ✅ **Authentication**: Bearer token-based authentication
3. ✅ **Multiple Resumes**: Yes - Users can upload and manage multiple resumes
4. ✅ **Job CRUD**: Yes - Users can create, edit, and delete jobs
5. ✅ **Search**: Yes - Job search and filtering functionality
6. ✅ **State Management**: Zustand for client state, TanStack Query for server state
7. ✅ **Multi-page**: Yes - Multi-page application with React Router

## Questions to Resolve

1. **Match Results Format**: What does the matching API response look like? (Need to see actual response structure)
2. **Base URL**: What will be the production API base URL?
3. **Export Format**: What format for exporting match results? (PDF, CSV, or both?)
4. **Pagination**: Are job lists paginated? (API support needed)
5. **Login Endpoint**: What is the authentication/login API endpoint?
6. **Token Refresh**: Is there a token refresh endpoint?
7. **Resume Storage**: Should resumes be stored with IDs? (API returns resume ID?)
8. **Job IDs**: Do stored jobs have IDs? (For edit/delete operations)

---

## Success Criteria

- [ ] Users can upload resumes and see parsed data
- [ ] Users can post job descriptions and see parsed data
- [ ] Users can match resumes against jobs
- [ ] Match results are displayed clearly with scores
- [ ] Application is responsive and works on mobile
- [ ] Error handling is robust and user-friendly
- [ ] Application is performant and loads quickly
- [ ] Code is well-structured and maintainable
- [ ] Documentation is complete

---

## Timeline Estimate

**Total Duration**: 15 days (3 weeks)

- **Week 1**: Setup, API Integration, Resume Upload, Job Posting
- **Week 2**: Matching Feature, UI Enhancement
- **Week 3**: Advanced Features, Testing, Documentation

**Note**: Timeline can be adjusted based on team size and complexity requirements.

---

## Next Steps

1. **Answer the questions** listed above
2. **Choose UI library** and set up project
3. **Set up API client** with proper configuration
4. **Start with Phase 1** (Project Setup)
5. **Iterate** through phases sequentially

---

## Notes

- API endpoints use versioning (`-1` suffix) - consider future API versioning strategy
- Response format for matching API needs to be confirmed (need actual response structure)
- Bearer token authentication - ensure secure token storage
- Multiple resume support - implement resume selection UI
- Job CRUD operations - confirm API endpoints for edit/delete
- Consider adding loading states for better UX
- Consider adding analytics/tracking for user interactions
- Consider adding unit tests from the beginning
- Material-UI provides excellent theming - customize brand colors
- Zustand stores should be lightweight - use React Query for server state

## Additional Features to Consider

- **Resume Comparison**: Compare multiple resumes side-by-side
- **Job Recommendations**: AI-powered job recommendations based on resume
- **Skill Gap Analysis**: Show what skills are missing for a job
- **Resume Templates**: Provide resume templates for users
- **Application Tracking**: Track job applications
- **Notifications**: Notify users of new matching jobs
- **Dashboard**: Overview of resumes, jobs, and matches

