import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'
import type { UserProfile, Customer, UserRole } from '../types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  customer: Customer | null
  role: UserRole
  loading: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null; user?: User | null }>
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; user?: User | null; role?: UserRole }>
  signOut: () => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfileAndCustomer = useCallback(async (authUser: User): Promise<UserProfile | null> => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      let currentProfile: UserProfile
      if (userData) {
        currentProfile = userData as UserProfile
        setProfile(currentProfile)
      } else {
        const newProfile: UserProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Customer',
          role: 'customer',
        }
        await supabase.from('users').upsert(newProfile)
        currentProfile = newProfile
        setProfile(newProfile)
      }

      // Fetch or create customer record
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle()

      if (customerData) {
        setCustomer(customerData as Customer)
      } else {
        const newCustomer: Partial<Customer> = {
          user_id: authUser.id,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Customer',
          email: authUser.email || '',
          phone: '+91 98765 43210',
        }
        const { data: createdCust } = await supabase
          .from('customers')
          .insert(newCustomer)
          .select()
          .single()

        if (createdCust) {
          setCustomer(createdCust as Customer)
        }
      }

      return currentProfile
    } catch (err) {
      console.warn('Profile sync:', err)
      const fallback: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || 'Customer User',
        role: 'customer',
      }
      setProfile(fallback)
      return fallback
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfileAndCustomer(user)
    }
  }, [user, fetchProfileAndCustomer])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        await fetchProfileAndCustomer(currentUser)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        await fetchProfileAndCustomer(currentUser)
      } else {
        setProfile(null)
        setCustomer(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfileAndCustomer])

  async function signUp(
    email: string,
    password: string,
    fullName: string
  ) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })

      if (error) return { error }

      if (data.user) {
        if (data.session) {
          // Email confirmation is OFF — user is immediately active
          setUser(data.user)
          await fetchProfileAndCustomer(data.user)
        } else {
          // data.session is null — email confirmation is still ON in Supabase.
          // Inform the developer; do NOT try to fake a login.
          return {
            error: new Error(
              'Account created but email confirmation is required. ' +
              'Please disable "Confirm email" in your Supabase Dashboard → ' +
              'Authentication → Providers → Email, then delete this user and sign up again.'
            ),
          }
        }
      }

      return { error: null, user: data.user }
    } catch (err) {
      return { error: err as Error }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Supabase returns "Email not confirmed" when the user was created
        // while email confirmation was enabled and was never confirmed.
        // Replace the raw Supabase error with a clear, actionable message.
        if (
          error.message.toLowerCase().includes('email not confirmed') ||
          error.message.toLowerCase().includes('not confirmed')
        ) {
          return {
            error: new Error(
              'This account was created before email confirmation was disabled. ' +
              'Please delete this user in the Supabase Dashboard → Authentication → Users, ' +
              'then create a fresh account on the Sign Up page.'
            ),
          }
        }
        return { error }
      }

      let userRole: UserRole = 'customer'
      if (data.user) {
        setUser(data.user)
        const p = await fetchProfileAndCustomer(data.user)
        if (p?.role) userRole = p.role
      }

      return { error: null, user: data.user, role: userRole }
    } catch (err) {
      return { error: err as Error }
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setCustomer(null)
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const effectiveRole: UserRole = profile?.role || 'customer'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        customer,
        role: effectiveRole,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}