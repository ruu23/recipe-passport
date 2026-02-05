// hooks/useRole.ts
import { useEffect, useState } from "react"
import { auth } from "@/lib/supabase/auth"
import { userAPI } from "@/lib/supabase/api"
import type { Database } from "@/lib/supabase/database.types"

export type UserRole = Database["public"]["Tables"]["profiles"]["Row"]["role"]

export function useRole() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRole() {
      try {
        const { user, error } = await auth.getUser()
        if (error) throw error
        
        if (user) {
          const profile = await userAPI.getProfile(user.id)
          setRole(profile.role)
        } else {
          setRole(null)
        }
      } catch (error) {
        console.error("Error loading role:", error)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    loadRole()
  }, [])

  return { role, loading }
}

export function useIsEditorOrAdmin() {
  const { role, loading } = useRole()
  return {
    isEditorOrAdmin: role === "editor" || role === "admin",
    loading,
  }
}

export function useIsAdmin() {
  const { role, loading } = useRole()
  return {
    isAdmin: role === "admin",
    loading,
  }
}

export function useHasRole(requiredRole: UserRole | UserRole[]) {
  const { role, loading } = useRole()

  const hasRole = Array.isArray(requiredRole)
    ? !!role && requiredRole.includes(role)
    : role === requiredRole

  return { hasRole, loading }
}