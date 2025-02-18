import {
  CalendarIcon,
  CreditCard,
  Mail,
  MessageSquare,
  User,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type UserDetailsProps = {
  user: {
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
    createdAt: string
    permissions: string[]
    isEmailVerified: boolean
    jeton: number
    plan: string
    amountAccumulated: string
    currentAmount: string
    _count: {
      Generation: number
      Publication: number
      Conversation: number
      Video: number
    }
  } | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailsDialog({ user, isOpen, onClose }: UserDetailsProps) {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about {user.username}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} alt={user.username} />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {user.fullname || user.username}
              </h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">{user.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">{user.plan}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Description</h4>
            <p className="text-sm">
              {user.description || "No description provided."}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Stats</h4>
            <div className="flex gap-4">
              <Badge variant="secondary" className="text-xs">
                Jeton: {user.jeton}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Accumulated: {user.amountAccumulated}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Current: {user.currentAmount}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Activity</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 opacity-70" />
                <span className="text-sm">
                  Generations: {user._count.Generation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 opacity-70" />
                <span className="text-sm">
                  Publications: {user._count.Publication}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 opacity-70" />
                <span className="text-sm">
                  Conversations: {user._count.Conversation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 opacity-70" />
                <span className="text-sm">Videos: {user._count.Video}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
