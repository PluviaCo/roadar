import { Box, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

interface PhotoCarouselProps {
  photos: Array<string>
  alt: string
}

export function PhotoCarousel({ photos, alt }: PhotoCarouselProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const hasMultiplePhotos = photos.length > 1
  const minSwipeDistance = 50

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const handlePhotoClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swiped left - show next photo
      setCurrentPhotoIndex((prev) =>
        prev === photos.length - 1 ? 0 : prev + 1,
      )
    }
    if (isRightSwipe) {
      // Swiped right - show previous photo
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? photos.length - 1 : prev - 1,
      )
    }
  }

  return (
    <Box
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        position: 'relative',
        width: { xs: '100%', md: 300 },
        height: { xs: 200, md: 'auto' },
      }}
    >
      <img
        src={photos[currentPhotoIndex]}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          touchAction: 'none',
        }}
      />
      {hasMultiplePhotos && isHovering && (
        <>
          <IconButton
            onClick={handlePrevPhoto}
            onMouseDown={handlePhotoClick}
            onTouchStart={handlePhotoClick}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              color: 'black',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNextPhoto}
            onMouseDown={handlePhotoClick}
            onTouchStart={handlePhotoClick}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              color: 'black',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}
      {hasMultiplePhotos && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {photos.map((_, index) => (
            <Box
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentPhotoIndex(index)
              }}
              onMouseDown={handlePhotoClick}
              onTouchStart={handlePhotoClick}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor:
                  index === currentPhotoIndex
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
