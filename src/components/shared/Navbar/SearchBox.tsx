"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
// import { useSession } from "next-auth/react"

interface User {
  _id: string
  firstName: string
  lastName: string
  email?: string
  profileImage?: string
}

interface SearchBoxProps {
  baseUrl: string
}

const SearchBox = ({ baseUrl }: SearchBoxProps) => {
  // const { data: session } = useSession()

  // const token = (session?.user as { accessToken?: string })?.accessToken

  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)

  /* ----------------------------------
     Fetch users (PUBLIC)
  -----------------------------------*/
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${baseUrl}/user/all-user`, {
          headers: {
            "Content-Type": "application/json",
            // ...(token && { Authorization: `Bearer ${token}` }),
          },
        })

        if (!res.ok) throw new Error("Failed to fetch users")

        const data = await res.json()
        setUsers(data?.data || [])
      } catch {
        setError("Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [baseUrl])

  /* ----------------------------------
     Search users (PUBLIC + Debounced)
  -----------------------------------*/
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setFilteredUsers([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `${baseUrl}/user/all-user?searchTerm=${encodeURIComponent(searchTerm)}`,
          {
            headers: {
              "Content-Type": "application/json",
              // ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        )

        if (!res.ok) throw new Error("Search failed")

        const data = await res.json()
        setFilteredUsers(data?.data || [])
      } catch {
        setError("Search failed")
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, baseUrl])

  /* ----------------------------------
     Close dropdown on outside click
  -----------------------------------*/
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ----------------------------------
     Handlers
  -----------------------------------*/
  const handleFocus = () => {
    setIsOpen(true)
  }

  const handleClear = () => {
    setSearchTerm("")
    setFilteredUsers([])
  }

  const displayUsers = searchTerm.trim()
    ? filteredUsers
    : users.slice(0, 5)

  /* ----------------------------------
     UI
  -----------------------------------*/
  return (
    <div ref={searchRef} className="relative w-full max-w-sm">
      <div className="relative border-2 border-[#929292] rounded-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <Input
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          className="pl-10 pr-10 h-10 rounded-full border-2 border-gray-200 focus:border-primary placeholder:text-[#616161]"
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-gray-600">Loading...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-500">{error}</div>
          ) : displayUsers.length > 0 ? (
            displayUsers.map((user) => (
              <Link
                key={user._id}
                href={`/player-profile/${user._id}`}
                onClick={() => {
                  setIsOpen(false)
                  setSearchTerm("")
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <Image
                  src={user.profileImage || "/assets/images/no-user.jpg"}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-700">{user.email}</p>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-gray-500">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBox



