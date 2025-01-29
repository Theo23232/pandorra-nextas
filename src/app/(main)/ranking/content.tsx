"use client"

import { Crown, Trophy } from "lucide-react"
import { useEffect, useState } from "react"

import {
  getPastRankings,
  getPopularUsers,
  PopularUser,
} from "@/actions/ranking.actions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tremor/inputs/select"
import { Card } from "@/components/tremor/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/tremor/ui/table"

export default function RankingList() {
  const [users, setUsers] = useState<PopularUser[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isCurrentMonth, setIsCurrentMonth] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      const currentDate = new Date()
      const isCurrentMonth =
        selectedMonth === currentDate.getMonth() + 1 &&
        selectedYear === currentDate.getFullYear()
      setIsCurrentMonth(isCurrentMonth)

      if (isCurrentMonth) {
        const popularUsers = await getPopularUsers(
          currentDate.getMonth() + 1,
          currentDate.getFullYear(),
        )
        setUsers(popularUsers)
      } else {
        const pastRankings = await getPastRankings(selectedMonth, selectedYear)
        setUsers(pastRankings)
      }
    }
    fetchUsers()
  }, [selectedMonth, selectedYear])

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const handleMonthChange = (value: string) => {
    const [month, year] = value.split("-")
    setSelectedMonth(Number.parseInt(month))
    setSelectedYear(Number.parseInt(year))
  }

  const generateOptions = () => {
    const options: string[] = []
    let currentMonth = new Date().getMonth()
    let currentYear = new Date().getFullYear()

    for (let i = 0; i < 12; i++) {
      options.push(`${currentMonth + 1}-${currentYear}`)
      currentMonth--
      if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
      }
    }

    return options
  }

  const getCrownColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-400"
      case 1:
        return "text-gray-400"
      case 2:
        return "text-amber-600"
      default:
        return "hidden"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Ranking for {months[selectedMonth - 1]} {selectedYear}
        </h2>
        <Select
          onValueChange={handleMonthChange}
          defaultValue={`${selectedMonth}-${selectedYear}`}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner un mois" />
          </SelectTrigger>
          <SelectContent>
            {generateOptions().map((option) => {
              const [month, year] = option.split("-")
              return (
                <SelectItem key={option} value={option}>
                  {months[Number.parseInt(month) - 1]} {year}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      {users.length > 0 ? (
        <TableRoot>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-[100px]">Rank</TableHeaderCell>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell className="text-right">Points</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{index + 1}</span>
                      <Crown className={`h-5 w-5 ${getCrownColor(index)}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <span>{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{user.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      ) : (
        <Card className="flex flex-col items-center justify-center space-y-4 bg-muted py-12 text-center">
          <Trophy className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-muted-foreground">
            No rankings available
          </h3>
          <p className="max-w-sm text-muted-foreground">
            There are no rankings for this period yet. Check back later or
            select a different month!
          </p>
        </Card>
      )}
    </div>
  )
}
