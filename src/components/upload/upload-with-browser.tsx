import { useState, useCallback, useRef } from 'react';
import { 
  Music, 
  Plus,
  Search,
  Upload,
  FolderPlus
} from 'lucide-react';
import { Button } from '../@/ui/button';
import { Input } from '../@/ui/input';
import { Separator } from '../@/ui/separator';
import { cn } from '../@/lib/utils';
import { useToast } from '../../hooks/use-toast';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../@/ui/dialog';
import { FileItem } from '@/lib/types';

interface UnifiedFileBrowserProps {
  initialFiles: FileItem[];
}

const demoFiles: FileItem[] = [
  {
    id: '1',
    name: 'Track1.wav',
    type: 'audio',
    size: '24.5 MB',
    modified: '2025-05-05'
  },
  {
    id: '2',
    name: 'Track2.wav',
    type: 'audio',
    size: '25.1 MB',
    modified: '2025-05-05'
  },
  {
    id: '3',
    name: 'Mix1.mp3',
    type: 'audio',
    size: '8.2 MB',
    modified: '2025-05-04'
  },
  {
    id: '4',
    name: 'Master1.flac',
    type: 'audio',
    size: '56.7 MB',
    modified: '2025-05-03'
  },
  {
    id: '5',
    name: 'Kick.wav',
    type: 'audio',
    size: '1.8 MB',
    modified: '2025-05-02'
  },
  {
    id: '6',
    name: 'Snare.wav',
    type: 'audio',
    size: '2.1 MB',
    modified: '2025-05-02'
  },
  {
    id: '7',
    name: 'Chorus.aiff',
    type: 'audio',
    size: '18.3 MB',
    modified: '2025-05-01'
  },
  {
    id: '8',
    name: 'Verse.ogg',
    type: 'audio',
    size: '12.4 MB',
    modified: '2025-05-01'
  }
];

export function UnifiedFileBrowser({ initialFiles = demoFiles }: UnifiedFileBrowserProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleNewFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement actual folder creation logic
    toast({
      title: "Folder created",
      description: `Folder "${newFolderName}" was created successfully`
    });
    setNewFolderName('');
    setShowNewFolderDialog(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          toast({
            title: "Upload complete",
            description: "Your file has been uploaded successfully!",
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 400);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload();
  };

  // Draggable item component
  const DraggableItem = ({ item, index, columnIndex, moveItem, children }: {
    item: FileItem
    index: number
    columnIndex: number
    moveItem: (dragIndex: number, hoverIndex: number, columnIndex: number) => void
    children: React.ReactNode
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag({
      type: 'ITEM',
      item: { index, columnIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'ITEM',
      hover: (draggedItem: { index: number; columnIndex: number }) => {
        if (draggedItem.index !== index || draggedItem.columnIndex !== columnIndex) {
          moveItem(draggedItem.index, index, columnIndex);
          draggedItem.index = index;
        }
      },
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="draggable-item"
      >
        {children}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-1 h-full">
        {/* Sidebar with filters */}
        <div className="w-64 space-y-4 p-4 border-r">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8"
            />
          </div>

          <div>
            <Button
              className="w-full justify-start gap-2"
              onClick={handleUploadClick}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                multiple
                accept="audio/*,.mp3,.wav,.aiff,.flac,.ogg,.aac"
              />
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-2 mt-2"
              onClick={() => setShowNewFolderDialog(true)}
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </Button>
          </div>

          <Separator />

          <div className="space-y-1">
            <Button 
              variant="secondary"
              className="w-full justify-start gap-2"
            >
              <Music className="h-4 w-4" />
              <span>Audio Files</span>
            </Button>
          </div>
          
          <Separator />
        </div>

        {/* Main file browser area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Audio Files</h1>
          </div>

          <div
            className={cn(
              "border-2 border-dashed rounded-lg m-4 p-4 text-center",
              "transition-all hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">Uploading...</p>
                <div className="relative h-2 max-w-md mx-auto rounded-full bg-gray-200 overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full" 
                    style={{ width: `${uploadProgress}%`, backgroundColor: '#3b82f6' }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop audio files here or{" "}
                <Button variant="link" className="p-0 h-auto" onClick={handleUploadClick}>
                  browse
                </Button>
              </p>
              </div>
            )}
          </div>

          <div className="flex-1 p-4">
          </div>
        </div>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNewFolderDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleNewFolder}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DndProvider>
  );
}
