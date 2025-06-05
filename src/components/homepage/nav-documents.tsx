import { useState } from "react"
import {
  MessageSquare,
  UserMinus,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/@/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/@/ui/sidebar"
import { Button } from "@/components/@/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/@/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  username: string
  avatar?: string
  isFollowing: boolean
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    username: "@sarahw",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    isFollowing: true
  },
  {
    id: "2",
    name: "Mike Johnson",
    username: "@mikej",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    isFollowing: true
  },
  {
    id: "3",
    name: "Emily Davis",
    username: "@emilyd",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
    isFollowing: true
  }
]

export function NavDocuments() {
  const { isMobile } = useSidebar()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const { toast } = useToast()

  const handleFollow = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: true }
        : user
    ))
    toast({
      title: "Success",
      description: "User followed successfully"
    })
  }

  const handleUnfollow = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: false }
        : user
    ))
    toast({
      title: "Success",
      description: "User unfollowed successfully"
    })
  }

  const handleMessage = (username: string) => {
    toast({
      title: "Opening chat",
      description: `Starting conversation with ${username}`
    })
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Following</SidebarGroupLabel>
      <SidebarMenu>
        {users.map((user) => (
          <SidebarMenuItem key={user.id}>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2 w-full">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.username}
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleMessage(user.username)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                  >
                    {user.isFollowing ? (
                      <UserMinus className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-40"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  {user.isFollowing ? (
                    <DropdownMenuItem onClick={() => handleUnfollow(user.id)}>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Unfollow
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleFollow(user.id)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}