"use client"

import type React from "react"

import { ChevronLeft, ChevronRight, Eye, MoreHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ExportUsersEmailsButton } from '@/app/dashboard/profile/ExportUsersEmail';
import { ResetToken } from '@/app/dashboard/profile/ResetToken';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { useShowZeroPayement } from '@/hooks/use-show-zero-payement';
import { useUser } from '@/hooks/use-user';

import { UserDetailsDialog } from './UserDetailsDialog';

type User = {
  id: string
  firstname: string | null
  lastname: string | null
  fullname: string | null
  image: string
  username: string
  email: string
  language: string
  description: string | null
  theme: string
  permissions: string[]
  plan: string
  jeton: number
  createdAt: string
  amountAccumulated: string
  currentAmount: string
  isEmailVerified: boolean
  _count: {
    Generation: number
    Publication: number
    Conversation: number
    Video: number
  }
}

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("")
  const [theme, setTheme] = useState("")
  const [plan, setPlan] = useState("")
  const [minJeton, setMinJeton] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  const { user } = useUser()
  const { show } = useShowZeroPayement()

  useEffect(() => {
    if (user && user.plan == "Free") {
      show()
      return
    }
  }, [])
  useEffect(() => {
    fetchUsers()
  }, [currentPage, search, language, theme, plan, minJeton, sortBy, sortOrder])

  const fetchUsers = async () => {
    setIsLoading(true) // Set loading to true before fetching
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "10",
      search,
      language,
      theme,
      plan,
      minJeton: minJeton || "0",
      sortBy,
      sortOrder,
    })

    const response = await fetch(`/api/user/adminSearch?${params}`)
    if (!response.ok) {
      console.error("Failed to fetch users")
      setIsLoading(false) // Set loading to false after error
      return
    }
    const data = await response.json()
    setUsers(data.users)
    setTotalPages(data.totalPages)
    setIsLoading(false) // Set loading to false after successful fetch
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setCurrentPage(1)
  }

  const handleThemeChange = (value: string) => {
    setTheme(value)
    setCurrentPage(1)
  }

  const handlePlanChange = (value: string) => {
    setPlan(value)
    setCurrentPage(1)
  }

  const handleMinJetonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinJeton(e.target.value)
    setCurrentPage(1)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleViewUser = async (userId: string) => {
    const response = await fetch(`/api/user/adminInfo?userId=${userId}`)
    if (!response.ok) {
      console.error("Failed to fetch user details")
      return
    }
    const userData: User = await response.json()
    setSelectedUser(userData)
    setIsDialogOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage =
          errorData.message || `Failed to delete user: ${response.status}`
        throw new Error(errorMessage)
      }

      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex w-full items-start justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <ResetToken />
          <ExportUsersEmailsButton />
        </div>
      </div>
      <div className="mb-4 flex space-x-4">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="en">Anglais</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="it">Italien</SelectItem>
            <SelectItem value="es">Espagnol</SelectItem>
          </SelectContent>
        </Select>
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
        <Select value={plan} onValueChange={handlePlanChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Free">Free</SelectItem>
            <SelectItem value="FreePaid">Free avec carte</SelectItem>
            <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
            <SelectItem value="CreatorPack">Creator Pack</SelectItem>
            <SelectItem value="VisionPro">Vision Pro</SelectItem>
            <SelectItem value="PandorraInfini">Pandorra Infini</SelectItem>
            <SelectItem value="CreatorPackYear">Creator Pack Year</SelectItem>
            <SelectItem value="VisionProYear">Vision Pro Year</SelectItem>
            <SelectItem value="PandorraInfiniYear">
              Pandorra Infini Year
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Min Jeton"
          value={minJeton}
          onChange={handleMinJetonChange}
          className="max-w-[120px]"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead
              onClick={() => handleSort("jeton")}
              className="cursor-pointer"
            >
              Jeton {sortBy === "jeton" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("createdAt")}
              className="cursor-pointer"
            >
              Created At{" "}
              {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? ( // Add loading indicator
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? ( // Add empty state
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.language}</TableCell>
                <TableCell>{user.permissions.join(", ")}</TableCell>
                <TableCell>{user.plan}</TableCell>
                <TableCell>{user.jeton}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewUser(user.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        Visit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/users/${user.id}/edit`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <UserDetailsDialog
        user={selectedUser}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
