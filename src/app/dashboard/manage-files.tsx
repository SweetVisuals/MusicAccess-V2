import { AppSidebar } from "@/components/dashboard/layout/app-sidebar"
import { SiteHeader } from "@/components/dashboard/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/@/ui/sidebar"
import { 
  Folder, 
  File, 
  MoreVertical, 
  Grid, 
  List,
  Search,
  Filter,
  Plus,
  Star,
  Clock,
  Share2,
  Download,
  Trash2,
  Edit,
  Music,
  Image,
  Video,
  FileText,
  Upload,
  FolderPlus,
  ChevronRight,
  Info,
  Heart,
  Calendar,
  Users,
  Settings,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GripVertical
} from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/@/ui/button"
import { Input } from "@/components/@/ui/input"
import { Badge } from "@/components/@/ui/badge"
import { Progress } from "@/components/@/ui/progress"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/@/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/@/ui/dialog"
import { Label } from "@/components/@/ui/label"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/@/ui/tabs"

interface FileItem {
  id: string
  name: string
  type: string
  size?: string
  modified: string
  starred?: boolean
  shared?: boolean
  thumbnail?: string
  color?: string
  collaborators?: number
  description?: string
  tags?: string[]
}

export default function ManageFilesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('modified')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [showFileInfoDialog, setShowFileInfoDialog] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const files: FileItem[] = [
    {
      id: '1',
      name: 'Summer Project',
      type: 'folder',
      modified: '2024-03-15',
      color: 'bg-blue-500',
      collaborators: 3,
      description: 'Summer album project files and assets',
      tags: ['album', 'summer', 'project']
    },
    {
      id: '2',
      name: 'Vocals.wav',
      type: 'audio',
      size: '24.5 MB',
      modified: '2024-03-14',
      starred: true,
      shared: true,
      description: 'Main vocal track for chorus',
      tags: ['vocals', 'chorus']
    },
    {
      id: '3',
      name: 'Album Cover.jpg',
      type: 'image',
      size: '3.2 MB',
      modified: '2024-03-13',
      thumbnail: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg',
      description: 'Album artwork final version',
      tags: ['artwork', 'final']
    },
    {
      id: '4',
      name: 'Studio Session.mp4',
      type: 'video',
      size: '1.2 GB',
      modified: '2024-03-12',
      shared: true,
      description: 'Recording session highlights',
      tags: ['session', 'recording']
    }
  ]

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast({
            title: "Upload complete",
            description: "Your files have been uploaded successfully"
          })
          return 0
        }
        return prev + 10
      })
    }, 300)
  }

  const handleRename = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "File name cannot be empty",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "File renamed",
      description: `File renamed to "${newFileName}"`
    })
    setNewFileName('')
    setShowRenameDialog(false)
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Folder created",
      description: `Folder "${newFolderName}" created successfully`
    })
    setNewFolderName('')
    setShowNewFolderDialog(false)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="h-6 w-6" />
      case 'audio':
        return <Music className="h-6 w-6" />
      case 'image':
        return <Image className="h-6 w-6" />
      case 'video':
        return <Video className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  const filteredFiles = files.filter(file => {
    if (filterType !== 'all' && file.type !== filterType) return false
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'modified':
        return new Date(b.modified).getTime() - new Date(a.modified).getTime()
      case 'size':
        return (b.size?.length || 0) - (a.size?.length || 0)
      default:
        return 0
    }
  })

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Files</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowNewFolderDialog(true)}
                  >
                    <FolderPlus className="h-4 w-4" />
                    New Folder
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={handleUpload}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Files
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                    />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
                      <DropdownMenuRadioItem value="all">All Files</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="folder">Folders</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="audio">Audio</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="image">Images</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="video">Videos</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="modified">Last Modified</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="border-l h-6" />

                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isUploading && (
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4 animate-bounce" />
                  <span className="text-sm">Uploading files...</span>
                </div>
                <Progress value={uploadProgress} className="h-1" />
              </div>
            )}

            <div className="border-t">
              <Tabs defaultValue="all" className="p-1">
                <TabsList>
                  <TabsTrigger value="all" className="text-xs">All Files</TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
                  <TabsTrigger value="starred" className="text-xs">Starred</TabsTrigger>
                  <TabsTrigger value="shared" className="text-xs">Shared</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={cn(
                      "group relative rounded-lg border bg-card transition-all hover:shadow-md",
                      file.type === 'folder' && file.color
                    )}
                  >
                    <div className="aspect-square p-4">
                      {file.type === 'image' && file.thumbnail ? (
                        <img
                          src={file.thumbnail}
                          alt={file.name}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>

                    <div className="p-4 pt-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size && `${file.size} • `}
                            {new Date(file.modified).toLocaleDateString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedFile(file)
                              setShowFileInfoDialog(true)
                            }}>
                              <Info className="mr-2 h-4 w-4" />
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedFile(file)
                              setNewFileName(file.name)
                              setShowRenameDialog(true)
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {(file.starred || file.shared || file.collaborators) && (
                        <div className="mt-2 flex items-center gap-2">
                          {file.starred && (
                            <Badge variant="secondary" className="h-5">
                              <Star className="mr-1 h-3 w-3" />
                              Starred
                            </Badge>
                          )}
                          {file.shared && (
                            <Badge variant="secondary" className="h-5">
                              <Share2 className="mr-1 h-3 w-3" />
                              Shared
                            </Badge>
                          )}
                          {file.collaborators && (
                            <Badge variant="secondary" className="h-5">
                              <Users className="mr-1 h-3 w-3" />
                              {file.collaborators}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    {getFileIcon(file.type)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{file.name}</p>
                        {file.starred && <Star className="h-4 w-4 text-yellow-400" />}
                        {file.shared && <Share2 className="h-4 w-4 text-blue-400" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {file.size && `${file.size} • `}
                        Modified {new Date(file.modified).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedFile(file)
                          setShowFileInfoDialog(true)
                        }}>
                          <Info className="mr-2 h-4 w-4" />
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedFile(file)
                          setNewFileName(file.name)
                          setShowRenameDialog(true)
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {selectedFile?.type}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Enter new name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Folder Name</Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Info Dialog */}
      <Dialog open={showFileInfoDialog} onOpenChange={setShowFileInfoDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedFile && (
              <>
                <div className="flex items-center gap-4">
                  {getFileIcon(selectedFile.type)}
                  <div>
                    <h3 className="font-medium">{selectedFile.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedFile.size && `${selectedFile.size} • `}
                      {selectedFile.type}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Modified {new Date(selectedFile.modified).toLocaleDateString()}</span>
                  </div>
                  
                  {selectedFile.collaborators && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFile.collaborators} collaborators</span>
                    </div>
                  )}

                  {selectedFile.description && (
                    <div className="pt-2">
                      <Label className="text-sm">Description</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedFile.description}
                      </p>
                    </div>
                  )}

                  {selectedFile.tags && selectedFile.tags.length > 0 && (
                    <div className="pt-2">
                      <Label className="text-sm">Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedFile.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}