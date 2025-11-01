'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Comment {
  id: string
  content: string
  nickname: string
  emotion?: string | null
  ai_response?: string | null
  created_at: string
}

interface CommentsFeedProps {
  sceneSlug: string
  onCommentAdded?: () => void
}

export default function CommentsFeed({ sceneSlug, onCommentAdded }: CommentsFeedProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadComments = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('scene_comments')
          .select('*')
          .eq('scene_slug', sceneSlug)
          .order('created_at', { ascending: false })
          .limit(50)

        if (fetchError) throw fetchError
        setComments((data as Comment[]) || [])
      } catch (err) {
        console.error('Failed to load comments:', err)
        setError('Unable to load comments')
      } finally {
        setLoading(false)
      }
    }

    loadComments()

    // Subscribe to new comments
    const subscription = supabase
      .channel(`scene_comments:${sceneSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scene_comments',
          filter: `scene_slug=eq.${sceneSlug}`,
        },
        (payload) => {
          const newComment = payload.new as Comment
          setComments((prev) => [newComment, ...prev])
          onCommentAdded?.()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [sceneSlug, onCommentAdded])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Comments</h3>
        <div className="text-white/60 text-sm">Loading comments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Comments</h3>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className="text-white/60 text-sm">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white">{comment.nickname || 'Anonymous'}</span>
                {comment.emotion && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                    {comment.emotion}
                  </span>
                )}
                <span className="text-xs text-white/40">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-white/80 text-sm mb-2">{comment.content}</p>
              {comment.ai_response && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-1">AI Response:</p>
                  <p className="text-white/70 text-sm italic">{comment.ai_response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

