import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import { ResumeData } from '@/types/resume.types'
import { JobData } from '@/types/job.types'

export interface MatchResult {
  job: JobData
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  experience_match: boolean
}

interface ApiSearchResult {
  score: number
  metadata: {
    type: string
    chunk_index: number
    chunk_total: number
  }
  content: string
}

interface ApiMatchResponse {
  message: string
  status: number
  results: ApiSearchResult[]
}

// Helper function to extract skills from content text
const extractSkillsFromContent = (content: string): string[] => {
  const skills: string[] = []
  const skillSet = new Set<string>()
  
  // Look for skills sections with various formats
  const skillsPatterns = [
    /\*\*Skills[^*]*\*\*\s*([\s\S]*?)(?=\n\n|\*\*|$)/i,
    /Skills[:\s]*\n([\s\S]*?)(?=\n\n|\*\*|$)/i,
  ]
  
  for (const pattern of skillsPatterns) {
    const skillsMatch = content.match(pattern)
    if (skillsMatch) {
      const skillsText = skillsMatch[1]
      // Extract skills from bullet points, dashes, or comma-separated lists
      const lines = skillsText.split(/\n/)
      lines.forEach(line => {
        // Remove markdown formatting and bullet points
        let cleanLine = line.replace(/^[\s*\-•]\s*/, '').replace(/\*\*/g, '').trim()
        
        // Skip lines that are too long (likely descriptions, not skills)
        if (cleanLine.length > 100) return
        
        // Extract skills separated by commas
        if (cleanLine.includes(',')) {
          const commaSkills = cleanLine.split(',').map(s => s.trim()).filter(Boolean)
          commaSkills.forEach(skill => {
            if (skill.length > 1 && skill.length < 50) {
              skillSet.add(skill)
            }
          })
        } else if (cleanLine.length > 1 && cleanLine.length < 50) {
          // Single skill on a line
          skillSet.add(cleanLine)
        }
      })
    }
  }
  
  // Also look for common skill patterns in the entire content
  const commonTechSkills = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'Django', 'DRF', 'FastAPI', 'Flask',
    'Node.js', 'React', 'Vue', 'Angular', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas',
    'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'MLOps', 'SageMaker',
    'LangChain', 'LLMs', 'RAG', 'Hugging Face', 'Supabase', 'Streamlit', 'Groq',
    'Llama3', 'pgvector', 'Chroma', 'SentenceTransformers', 'MCP', 'Spring AOP',
    'Resend API', 'APScheduler', 'RBAC', 'AWS S3'
  ]
  
  commonTechSkills.forEach(skill => {
    // Check if skill appears in content (case-insensitive, whole word or as part of a phrase)
    const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (skillRegex.test(content) && !Array.from(skillSet).some(s => 
      s.toLowerCase() === skill.toLowerCase() || 
      s.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(s.toLowerCase())
    )) {
      skillSet.add(skill)
    }
  })
  
  return Array.from(skillSet)
}

// Helper function to extract experience requirement from content
const extractExperienceRequirement = (content: string): number | null => {
  const experienceMatch = content.match(/(\d+)\+?\s*years?\s*(?:of\s*)?(?:hands[- ]?on\s*)?experience/i)
  if (experienceMatch) {
    return parseInt(experienceMatch[1], 10)
  }
  return null
}

// Helper function to extract job title from content
const extractJobTitle = (content: string, index: number): string => {
  // Look for common job title patterns at the start
  const titlePatterns = [
    /(Machine Learning Engineer|ML Engineer|Data Scientist|Software Engineer|Backend Developer|Frontend Developer|Full Stack Developer|DevOps Engineer)[^\n]*/i,
    /Role Overview[:\s]+([^\n]+)/i,
    /\*\*([^*]+)\*\*/,
  ]
  
  for (const pattern of titlePatterns) {
    const match = content.match(pattern)
    if (match) {
      const title = match[1] || match[0]
      const cleanTitle = title.trim()
      if (cleanTitle.length > 3 && 
          !cleanTitle.toLowerCase().includes('skills') && 
          !cleanTitle.toLowerCase().includes('requirements') &&
          !cleanTitle.toLowerCase().includes('summary') &&
          !cleanTitle.toLowerCase().includes('technologies')) {
        // Extract just the job title part (before "with" or "for")
        const titlePart = cleanTitle.split(/\s+(?:with|for|at|in)\s+/i)[0]
        return titlePart.trim()
      }
    }
  }
  
  // Look for job title in the first line if it contains common job title keywords
  const firstLine = content.split('\n')[0]?.trim() || ''
  const jobTitleKeywords = ['Engineer', 'Developer', 'Scientist', 'Analyst', 'Manager', 'Specialist', 'Architect']
  if (jobTitleKeywords.some(keyword => firstLine.includes(keyword)) && firstLine.length < 100) {
    const titlePart = firstLine.split(/\s+(?:with|for|at|in)\s+/i)[0]
    return titlePart.trim()
  }
  
  // Default fallback
  return `Job Match ${index + 1}`
}

// Helper function to normalize skill names for comparison
const normalizeSkill = (skill: string): string => {
  return skill.trim().toLowerCase().replace(/[^\w\s]/g, '')
}

// Helper function to compare skills
const compareSkills = (resumeSkills: string[], jobSkills: string[]): {
  matched: string[]
  missing: string[]
} => {
  const normalizedResumeSkills = resumeSkills.map(normalizeSkill)
  const matched: string[] = []
  const missing: string[] = []
  
  jobSkills.forEach(jobSkill => {
    const normalizedJobSkill = normalizeSkill(jobSkill)
    const found = normalizedResumeSkills.some(normalizedResumeSkill => 
      normalizedResumeSkill === normalizedJobSkill ||
      normalizedResumeSkill.includes(normalizedJobSkill) ||
      normalizedJobSkill.includes(normalizedResumeSkill)
    )
    
    if (found) {
      matched.push(jobSkill)
    } else {
      missing.push(jobSkill)
    }
  })
  
  return { matched, missing }
}

// Helper function to create a content signature for grouping
const createContentSignature = (content: string): string => {
  // Extract key phrases that are likely to be unique to a job
  const lines = content.split('\n').filter(line => line.trim().length > 10)
  const firstLine = lines[0]?.substring(0, 60).replace(/\s+/g, ' ').trim() || ''
  const skillsLine = content.match(/Skills[^\n]*\n([^\n]+)/i)?.[1]?.substring(0, 40) || ''
  return `${firstLine}-${skillsLine}`.toLowerCase()
}

// Transform API response chunks into MatchResult objects
const transformApiResponse = (
  apiResults: ApiSearchResult[],
  resumeData: ResumeData
): MatchResult[] => {
  // Group chunks by job
  // Strategy: Group chunks with same chunk_total and similar content signatures
  const jobGroups = new Map<string, ApiSearchResult[]>()
  
  apiResults.forEach((result, index) => {
    let key: string
    
    if (result.metadata?.chunk_total && result.metadata.chunk_total > 1) {
      // For multi-chunk jobs, create a signature from chunk_total and content
      const signature = createContentSignature(result.content)
      key = `job-${result.metadata.chunk_total}-${signature.substring(0, 40)}`
    } else {
      // Single chunk jobs - use content signature to deduplicate
      const signature = createContentSignature(result.content)
      key = `job-single-${signature.substring(0, 40)}`
    }
    
    if (!jobGroups.has(key)) {
      jobGroups.set(key, [])
    }
    jobGroups.get(key)!.push(result)
  })
  
  // Sort chunks within each group by chunk_index
  jobGroups.forEach((chunks) => {
    chunks.sort((a, b) => {
      const indexA = a.metadata?.chunk_index ?? 0
      const indexB = b.metadata?.chunk_index ?? 0
      return indexA - indexB
    })
  })
  
  // Transform each group into a MatchResult
  const matchResults: MatchResult[] = []
  
  jobGroups.forEach((chunks, groupKey) => {
    // Combine all chunks for this job
    const combinedContent = chunks.map(c => c.content).join('\n\n')
    
    // Get the highest score from chunks
    const maxScore = Math.max(...chunks.map(c => c.score))
    
    // Extract job information
    const jobSkills = extractSkillsFromContent(combinedContent)
    const experienceReq = extractExperienceRequirement(combinedContent)
    const jobTitle = extractJobTitle(combinedContent, matchResults.length)
    
    // Compare skills
    const { matched, missing } = compareSkills(resumeData.skills, jobSkills)
    
    // Check experience match
    const experienceMatch = experienceReq === null || 
      resumeData.years_of_experience >= experienceReq
    
    // Calculate match score (convert 0-1 to 0-100 and factor in skill match)
    const skillMatchRatio = jobSkills.length > 0 
      ? matched.length / jobSkills.length 
      : 0
    const baseScore = maxScore * 100
    const skillBonus = skillMatchRatio * 20 // Up to 20 points for skill matching
    const experienceBonus = experienceMatch ? 10 : 0 // 10 points for experience match
    const matchScore = Math.min(100, Math.round(baseScore + skillBonus + experienceBonus))
    
    // Create JobData
    const jobData: JobData = {
      title: jobTitle,
      description: combinedContent,
      parsed_data: {
        years_of_experience: experienceReq || 0,
        skills: jobSkills,
        technical_experience: combinedContent,
        summary: combinedContent.substring(0, 200) + '...'
      }
    }
    
    matchResults.push({
      job: jobData,
      match_score: matchScore,
      matched_skills: matched,
      missing_skills: missing,
      experience_match: experienceMatch
    })
  })
  
  // Sort by match score descending
  return matchResults.sort((a, b) => b.match_score - a.match_score)
}

export const matchResumeToJobs = async (resumeData: ResumeData): Promise<MatchResult[]> => {
  const response = await apiClient.post<ApiMatchResponse>(
    API_ENDPOINTS.RESUME_MATCH,
    { resume_data: resumeData }
  )

  // Transform the API response into MatchResult format
  if (!response.data.results || response.data.results.length === 0) {
    return []
  }

  return transformApiResponse(response.data.results, resumeData)
}

