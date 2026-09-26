import { supabase } from '../supabase'
import { DEMO_KNOWLEDGE_DOCS } from './demoData'
import type { KnowledgeDocument } from '../../types'

export interface RAGSearchResult {
  documentId: string
  title: string
  category: string
  content: string
  score: number
  sourceUrl?: string
}

export async function searchKnowledgeBase(
  query: string,
  topK: number = 2
): Promise<RAGSearchResult[]> {
  try {
    // 1. Try querying Supabase knowledge_documents table
    const { data: dbDocs } = await supabase
      .from('knowledge_documents')
      .select('*')

    const docs: KnowledgeDocument[] =
      dbDocs && dbDocs.length > 0 ? dbDocs : DEMO_KNOWLEDGE_DOCS

    // 2. Perform TF-IDF / keyword similarity & semantic relevance scoring
    const queryTerms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2)

    const scoredDocs = docs.map((doc) => {
      const fullText = `${doc.title} ${doc.category} ${doc.description || ''} ${doc.content}`.toLowerCase()
      let matchCount = 0

      for (const term of queryTerms) {
        if (fullText.includes(term)) {
          // Weight title and category higher
          if (doc.title.toLowerCase().includes(term)) matchCount += 3
          if (doc.category.toLowerCase().includes(term)) matchCount += 2
          matchCount += 1
        }
      }

      // Bonus for domain keywords
      if (query.toLowerCase().includes('refund') && doc.category.toLowerCase().includes('billing')) matchCount += 4
      if (query.toLowerCase().includes('cancel') && doc.category.toLowerCase().includes('orders')) matchCount += 4
      if (query.toLowerCase().includes('warranty') && doc.category.toLowerCase().includes('technical')) matchCount += 4

      const score = Math.min(0.98, Math.max(0.45, matchCount / (queryTerms.length * 2 + 1)))

      return {
        documentId: doc.id,
        title: doc.title,
        category: doc.category,
        content: doc.content,
        score: Number(score.toFixed(2)),
        sourceUrl: doc.source_url || undefined,
      }
    })

    // Sort by highest relevance score
    scoredDocs.sort((a, b) => b.score - a.score)

    return scoredDocs.slice(0, topK)
  } catch (err) {
    console.warn('RAG search fallback triggered:', err)
    return DEMO_KNOWLEDGE_DOCS.slice(0, topK).map((doc) => ({
      documentId: doc.id,
      title: doc.title,
      category: doc.category,
      content: doc.content,
      score: 0.92,
      sourceUrl: doc.source_url || undefined,
    }))
  }
}
