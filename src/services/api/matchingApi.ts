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

// Actual API response structure from vector search
export interface VectorSearchChunk {
  score: number
  metadata: {
    type: string
    chunk_index: number
    chunk_total: number
    [key: string]: any // Allow additional metadata fields
  }
  content: string
}

export interface MatchResponse {
  message: string
  status: number
  results: VectorSearchChunk[]
}

/**
 * Extract skills from chunk content text
 */
function extractSkillsFromContent(content: string): string[] {
  const skills: string[] = []
  
  // Look for skills sections with various formats
  // Pattern 1: "Skills / Technologies" followed by bullet points or dashes
  const skillsSectionMatch = content.match(/(?:Skills|Technologies)[\s\S]*?(?:\n|$)/i)
  if (skillsSectionMatch) {
    const skillsSection = skillsSectionMatch[0]
    // Extract lines that start with - or • or are comma-separated
    const skillLines = skillsSection
      .split('\n')
      .filter(line => line.trim().length > 0)
      .filter(line => !line.match(/^(?:Skills|Technologies)/i))
    
    skillLines.forEach(line => {
      // Remove markdown formatting
      let cleanLine = line.replace(/^\*\*.*?\*\*\s*/, '')
        .replace(/^[-•]\s*/, '')
        .trim()
      
      // Split by comma if present
      if (cleanLine.includes(',')) {
        const commaSkills = cleanLine.split(',').map(s => s.trim())
        skills.push(...commaSkills)
      } else if (cleanLine.length > 0) {
        skills.push(cleanLine)
      }
    })
  }
  
  // Pattern 2: Look for common tech stack keywords in the entire content
  const commonTechStack = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'Node.js',
    'Django', 'Flask', 'FastAPI', 'DRF', 'Spring',
    'React', 'Vue', 'Angular', 'Next.js',
    'TensorFlow', 'PyTorch', 'scikit-learn', 'Keras',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'AWS', 'SageMaker', 'S3', 'EC2', 'Lambda',
    'Docker', 'Kubernetes', 'CI/CD',
    'LLMs', 'LLM', 'RAG', 'LangChain', 'Hugging Face',
    'Pandas', 'NumPy', 'Matplotlib',
    'Git', 'REST', 'GraphQL', 'gRPC',
    'MLOps', 'Data Pipeline', 'Vector Database', 'pgvector', 'Chroma',
    'Supabase', 'Groq', 'Llama', 'SentenceTransformers', 'MCP'
  ]
  
  commonTechStack.forEach(tech => {
    const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    if (regex.test(content)) {
      // Check if we already have this skill (case-insensitive)
      const techLower = tech.toLowerCase()
      if (!skills.some(s => s.toLowerCase() === techLower)) {
        skills.push(tech)
      }
    }
  })
  
  // Clean up skills - remove empty strings and normalize
  return skills
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter((s, idx, arr) => arr.findIndex(t => t.toLowerCase() === s.toLowerCase()) === idx) // Remove duplicates (case-insensitive)
}

/**
 * Extract years of experience requirement from content
 */
function extractExperienceRequirement(content: string): number | null {
  const experienceMatch = content.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/gi)
  if (experienceMatch) {
    const years = experienceMatch.map(m => {
      const numMatch = m.match(/(\d+)/)
      return numMatch ? parseInt(numMatch[1], 10) : null
    }).filter((y): y is number => y !== null)
    return years.length > 0 ? Math.max(...years) : null
  }
  return null
}

/**
 * Extract job title from content (if available)
 */
function extractJobTitle(content: string): string {
  // Look for "Summary / Role Overview" section
  const summaryMatch = content.match(/(?:Summary|Role Overview|Position|Title)[\s\S]*?\n([^\n]+)/i)
  if (summaryMatch && summaryMatch[1]) {
    let title = summaryMatch[1].trim()
    // Remove markdown formatting
    title = title.replace(/^\*\*.*?\*\*\s*/, '').replace(/\*\*/g, '')
    // Extract first sentence or first 80 characters
    title = title.split('.')[0].trim()
    if (title.length > 0 && title.length < 100) {
      return title
    }
  }
  
  // Look for common job title patterns in the content
  const titlePatterns = [
    /(?:Machine Learning|ML|Data Science|Software|Backend|Frontend|Full Stack|DevOps)\s+(?:Engineer|Developer|Specialist|Analyst)/i,
    /(?:Senior|Junior|Lead)?\s*(?:Engineer|Developer|Manager|Architect)/i,
  ]
  
  for (const pattern of titlePatterns) {
    const match = content.match(pattern)
    if (match) {
      return match[0].trim()
    }
  }
  
  // Fallback: extract from first meaningful line
  const lines = content.split('\n').filter(l => l.trim().length > 0)
  for (const line of lines) {
    const cleanLine = line.replace(/^\*\*.*?\*\*\s*/, '').trim()
    if (cleanLine.length > 10 && cleanLine.length < 100 && 
        (cleanLine.match(/(?:Engineer|Developer|Manager|Analyst|Specialist|Architect)/i))) {
      return cleanLine
    }
  }
  
  return 'Job Opportunity'
}

/**
 * Group chunks by job (using metadata if available, otherwise by similarity)
 */
function groupChunksByJob(chunks: VectorSearchChunk[]): Map<string, VectorSearchChunk[]> {
  const grouped = new Map<string, VectorSearchChunk[]>()
  
  // Try to group by job ID if available in metadata
  const hasJobId = chunks.some(c => c.metadata?.job_id || c.metadata?.id)
  
  if (hasJobId) {
    chunks.forEach(chunk => {
      const jobId = chunk.metadata?.job_id || chunk.metadata?.id || 'unknown'
      if (!grouped.has(jobId)) {
        grouped.set(jobId, [])
      }
      grouped.get(jobId)!.push(chunk)
    })
    return grouped
  }
  
  // If no job IDs, try to group by chunk_total and content similarity
  // Chunks with the same chunk_total and sequential chunk_index likely belong to same job
  const byChunkTotal = new Map<number, VectorSearchChunk[]>()
  
  chunks.forEach(chunk => {
    const total = chunk.metadata?.chunk_total || 1
    if (!byChunkTotal.has(total)) {
      byChunkTotal.set(total, [])
    }
    byChunkTotal.get(total)!.push(chunk)
  })
  
  // Group chunks that have the same chunk_total
  // This assumes chunks from the same job have the same chunk_total
  let jobIndex = 0
  byChunkTotal.forEach((chunkGroup) => {
    // Sort by chunk_index to maintain order
    chunkGroup.sort((a, b) => (a.metadata?.chunk_index || 0) - (b.metadata?.chunk_index || 0))
    grouped.set(`job-${jobIndex++}`, chunkGroup)
  })
  
  // If grouping didn't help (all chunks have different chunk_total), treat each as separate
  if (grouped.size === chunks.length) {
    // This means each chunk is likely from a different job
    grouped.clear()
    chunks.forEach((chunk, index) => {
      grouped.set(`job-${index}`, [chunk])
    })
  }
  
  return grouped
}

/**
 * Transform vector search chunks into MatchResult objects
 */
function transformChunksToMatchResults(
  chunks: VectorSearchChunk[],
  resumeData: ResumeData
): MatchResult[] {
  const groupedChunks = groupChunksByJob(chunks)
  const matchResults: MatchResult[] = []
  
  groupedChunks.forEach((chunkGroup, jobId) => {
    // Combine all chunks for this job
    const combinedContent = chunkGroup.map(c => c.content).join('\n\n')
    const avgScore = chunkGroup.reduce((sum, c) => sum + c.score, 0) / chunkGroup.length
    
    // Extract information from combined content
    const extractedSkills = extractSkillsFromContent(combinedContent)
    const experienceReq = extractExperienceRequirement(combinedContent)
    const jobTitle = extractJobTitle(combinedContent)
    
    // Calculate matched and missing skills
    const resumeSkillsLower = resumeData.skills.map(s => s.toLowerCase())
    const extractedSkillsLower = extractedSkills.map(s => s.toLowerCase())
    
    const matchedSkills = extractedSkills.filter((skill, idx) => {
      const skillLower = skill.toLowerCase()
      return resumeSkillsLower.some(rs => 
        rs.includes(skillLower) || skillLower.includes(rs) ||
        skillLower === rs
      )
    })
    
    const missingSkills = extractedSkills.filter((skill, idx) => {
      const skillLower = skill.toLowerCase()
      return !resumeSkillsLower.some(rs => 
        rs.includes(skillLower) || skillLower.includes(rs) ||
        skillLower === rs
      )
    })
    
    // Check experience match
    const experienceMatch = experienceReq === null || 
      resumeData.years_of_experience >= experienceReq
    
    // Create job data
    const jobData: JobData = {
      id: jobId,
      title: jobTitle,
      description: combinedContent,
      parsed_data: {
        years_of_experience: experienceReq || 0,
        skills: extractedSkills,
        technical_experience: combinedContent,
        summary: chunkGroup.find(c => c.content.includes('Summary') || c.content.includes('Overview'))?.content || null,
      },
    }
    
    // Convert score from 0-1 range to 0-100 percentage
    const matchScore = Math.round(avgScore * 100)
    
    matchResults.push({
      job: jobData,
      match_score: matchScore,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      experience_match: experienceMatch,
    })
  })
  
  // Sort by match score (highest first)
  return matchResults.sort((a, b) => b.match_score - a.match_score)
}

export const matchResumeToJobs = async (resumeData: ResumeData): Promise<MatchResult[]> => {
  const response = await apiClient.post<MatchResponse>(
    API_ENDPOINTS.RESUME_MATCH,
    { resume_data: resumeData }
  )

  // Check if results is already in MatchResult format (backward compatibility)
  if (response.data.results && response.data.results.length > 0) {
    const firstResult = response.data.results[0]
    
    // Check if it's already a MatchResult (has 'job' property)
    if ('job' in firstResult && 'match_score' in firstResult) {
      return Array.isArray(response.data.results)
        ? (response.data.results as MatchResult[])
        : [response.data.results as MatchResult]
    }
    
    // Otherwise, it's vector search chunks - transform them
    if ('score' in firstResult && 'content' in firstResult) {
      return transformChunksToMatchResults(
        response.data.results as VectorSearchChunk[],
        resumeData
      )
    }
  }

  return []
}

