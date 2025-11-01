import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Auth helpers
 */
export const auth = {
  /**
   * Sign up new user
   */
  async signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
  },

  /**
   * Sign in user
   */
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  },

  /**
   * Sign out current user
   */
  async signOut() {
    return supabase.auth.signOut()
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  /**
   * Get current user
   */
  async getUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
  },
}

/**
 * Database helpers
 */
export const db = {
  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    return supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, data: any) {
    return supabase
      .from('user_profiles')
      .update(data)
      .eq('id', userId)
  },

  /**
   * Create order
   */
  async createOrder(orderId: string, data: any) {
    return supabase
      .from('orders')
      .insert([{ stripe_session_id: orderId, ...data }])
  },

  /**
   * Get comments for scene
   */
  async getComments(sceneId: string) {
    return supabase
      .from('comments')
      .select('*')
      .eq('scene_id', sceneId)
      .order('created_at', { ascending: false })
  },

  /**
   * Add comment
   */
  async addComment(sceneId: string, userId: string, text: string) {
    return supabase
      .from('comments')
      .insert([{ scene_id: sceneId, user_id: userId, text }])
  },
}

export default supabase
