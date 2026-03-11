'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Crop, RotateCcw, ZoomIn, ZoomOut, Check, X, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ImageCropUploadProps {
  onImageUpload: (file: File, croppedBlob: Blob) => Promise<string | null>;
  currentImageUrl?: string;
  aspectRatio?: number; // width/height ratio (e.g., 16/9 = 1.78)
  maxWidth?: number;
  maxHeight?: number;
}

export function ImageCropUpload({ 
  onImageUpload, 
  currentImageUrl, 
  aspectRatio = 16/9, // Default to 16:9 for best sellers
  maxWidth = 800,
  maxHeight = 450
}: ImageCropUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  const constrainPan = useCallback((newPanX: number, newPanY: number) => {
    const container = previewContainerRef.current;
    const image = imageRef.current;
    
    if (!container || !image) return { x: newPanX, y: newPanY };
    
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Calculate image dimensions at current zoom
    const imageAspectRatio = image.naturalWidth / image.naturalHeight;
    const containerAspectRatio = containerWidth / containerHeight;
    
    let scaledWidth, scaledHeight;
    
    // Calculate how the image is scaled to cover the container
    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider - scaled by height
      scaledHeight = containerHeight * zoom;
      scaledWidth = scaledHeight * imageAspectRatio;
    } else {
      // Image is taller - scaled by width  
      scaledWidth = containerWidth * zoom;
      scaledHeight = scaledWidth / imageAspectRatio;
    }
    
    // Calculate maximum pan limits to prevent white space
    const maxPanX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (scaledHeight - containerHeight) / 2);
    
    // Constrain pan values with some buffer for better UX
    const constrainedX = Math.max(-maxPanX - 50, Math.min(maxPanX + 50, newPanX));
    const constrainedY = Math.max(-maxPanY - 50, Math.min(maxPanY + 50, newPanY));
    
    return { x: constrainedX, y: constrainedY };
  }, [zoom]);

  // Add wheel event listener with useEffect
  useEffect(() => {
    const container = previewContainerRef.current;
    if (container && cropMode) {
      const handleWheelEvent = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
        setZoom(newZoom);
        
        // Re-constrain pan after zoom change
        const constrained = constrainPan(panX, panY);
        setPanX(constrained.x);
        setPanY(constrained.y);
      };

      container.addEventListener('wheel', handleWheelEvent, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheelEvent);
      };
    }
  }, [cropMode, zoom, panX, panY, constrainPan]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, etc.)',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCropMode(true);
    setZoom(1);
    setRotation(0);
    setPanX(0);
    setPanY(0);
  }, [toast]);

  // Mouse/touch handlers for panning with boundary constraints
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  }, [panX, panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const newPanX = e.clientX - dragStart.x;
    const newPanY = e.clientY - dragStart.y;
    
    const constrained = constrainPan(newPanX, newPanY);
    setPanX(constrained.x);
    setPanY(constrained.y);
  }, [isDragging, dragStart, constrainPan]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for better dragging experience
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const newPanX = e.clientX - dragStart.x;
        const newPanY = e.clientY - dragStart.y;
        
        const constrained = constrainPan(newPanX, newPanY);
        setPanX(constrained.x);
        setPanY(constrained.y);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, constrainPan]);

  const resetPosition = useCallback(() => {
    setPanX(0);
    setPanY(0);
    setZoom(1);
    setRotation(0);
  }, []);

  const getCroppedImage = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      
      if (!canvas || !image) {
        resolve(null);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      // Set canvas size based on aspect ratio
      canvas.width = maxWidth;
      canvas.height = maxWidth / aspectRatio;

      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save context
      ctx.save();

      // Calculate image dimensions to cover the entire canvas
      const imageAspectRatio = image.naturalWidth / image.naturalHeight;
      const canvasAspectRatio = aspectRatio;
      
      let drawWidth, drawHeight;
      
      // Scale image to cover the entire canvas (no white space)
      if (imageAspectRatio > canvasAspectRatio) {
        // Image is wider - fit by height
        drawHeight = canvas.height * zoom;
        drawWidth = drawHeight * imageAspectRatio;
      } else {
        // Image is taller - fit by width
        drawWidth = canvas.width * zoom;
        drawHeight = drawWidth / imageAspectRatio;
      }

      // Apply transformations from center
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(panX, panY);

      // Draw image centered
      ctx.drawImage(
        image,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      // Restore context
      ctx.restore();

      // Convert to blob
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  }, [aspectRatio, maxWidth, zoom, rotation, panX, panY]);

  const handleCropConfirm = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      
      const croppedBlob = await getCroppedImage();
      if (!croppedBlob) {
        throw new Error('Failed to crop image');
      }

      const uploadedUrl = await onImageUpload(selectedFile, croppedBlob);
      
      if (uploadedUrl) {
        toast({
          title: 'Success',
          description: 'Image uploaded successfully!',
        });
        
        // Reset state
        setCropMode(false);
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  }, [selectedFile, getCroppedImage, onImageUpload, previewUrl, toast]);

  const handleCropCancel = useCallback(() => {
    setCropMode(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setZoom(1);
    setRotation(0);
    setPanX(0);
    setPanY(0);
  }, [previewUrl]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crop className="h-5 w-5" />
          Best Seller Image Upload
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Recommended size: {maxWidth}x{maxHeight}px (16:9 ratio)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Image Display */}
        {currentImageUrl && !cropMode && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Image:</label>
            <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
              <Image
                src={currentImageUrl}
                alt="Current image"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* File Input */}
        {!cropMode && (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {currentImageUrl ? 'Change Image' : 'Upload Image'}
            </Button>
          </div>
        )}

        {/* Crop Interface */}
        {cropMode && previewUrl && (
          <div className="space-y-4">
            <div className="text-sm font-medium">Crop & Adjust Image:</div>
            
            {/* Preview Area */}
            <div className="relative">
              <div 
                ref={previewContainerRef}
                className="relative mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 cursor-move select-none"
                style={{ 
                  width: '100%', 
                  maxWidth: '400px',
                  aspectRatio: aspectRatio 
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Preview"
                  className="absolute pointer-events-none"
                  style={{
                    width: '100%',
                    height: 'auto',
                    minHeight: '100%',
                    objectFit: 'cover',
                    transform: `scale(${zoom}) rotate(${rotation}deg) translate(${panX}px, ${panY}px)`,
                    transformOrigin: 'center center',
                  }}
                  draggable={false}
                />
                
                {/* Overlay instructions */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Drag to move • Scroll to zoom
                </div>
              </div>
              
              {/* Hidden canvas for cropping */}
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Position Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Position:</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetPosition}
                    className="text-xs"
                  >
                    <Move className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Horizontal</label>
                    <Slider
                      value={[panX]}
                      onValueChange={(value) => {
                        const constrained = constrainPan(value[0], panY);
                        setPanX(constrained.x);
                      }}
                      min={-400}
                      max={400}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Vertical</label>
                    <Slider
                      value={[panY]}
                      onValueChange={(value) => {
                        const constrained = constrainPan(panX, value[0]);
                        setPanY(constrained.y);
                      }}
                      min={-400}
                      max={400}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Zoom:</label>
                  <span className="text-sm text-muted-foreground">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4" />
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => {
                      setZoom(value[0]);
                      // Re-constrain pan after zoom change
                      const constrained = constrainPan(panX, panY);
                      setPanX(constrained.x);
                      setPanY(constrained.y);
                    }}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>

              {/* Rotation Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Rotation:</label>
                  <span className="text-sm text-muted-foreground">{rotation}°</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation(r => r - 90)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[rotation]}
                    onValueChange={(value) => setRotation(value[0])}
                    min={-180}
                    max={180}
                    step={15}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation(r => r + 90)}
                  >
                    <RotateCcw className="h-4 w-4 scale-x-[-1]" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleCropConfirm}
                disabled={uploading}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Confirm & Upload'}
              </Button>
              <Button
                onClick={handleCropCancel}
                variant="outline"
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}