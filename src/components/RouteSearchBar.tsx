import { useState } from 'react'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import { LocationOn, Search } from '@mui/icons-material'
import { useNavigate } from '@tanstack/react-router'
import type { Route } from '@/db/routes'

export function RouteSearchBar({
  routes,
  sx,
}: {
  routes: Array<any>
  sx?: any
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  return (
    <Box sx={{ ...sx, minWidth: 0 }}>
      <Autocomplete
        freeSolo
        options={routes}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.name
        }
        filterOptions={(options, state) => {
          if (!state.inputValue.trim()) return []
          const query = state.inputValue.toLowerCase()
          return options.filter(
            (option) =>
              option.name.toLowerCase().includes(query) ||
              option.description?.toLowerCase().includes(query),
          )
        }}
        onChange={(_, value) => {
          if (value && typeof value !== 'string') {
            navigate({ to: `/routes/${value.id}` })
            setSearchQuery('')
          }
        }}
        inputValue={searchQuery}
        onInputChange={(_, newValue) => setSearchQuery(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for routes..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <Search sx={{ mr: 1, color: 'action.active' }} />
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
            sx={{ width: '100%', borderRadius: 999 }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} sx={{ gap: 2 }}>
            {/* Image or Icon */}
            {option.photos && option.photos.length > 0 ? (
              <Box
                component="img"
                src={option.photos[0]}
                alt={option.name}
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: 'cover',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              >
                <LocationOn sx={{ fontSize: 24, color: 'grey.500' }} />
              </Box>
            )}
            {/* Text Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" fontWeight="medium">
                {option.name}
              </Typography>
              {option.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {option.description}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        sx={{
          backgroundColor: 'white',
          width: '100%',
          borderRadius: 999,
          '& .MuiOutlinedInput-root': {
            borderRadius: 999,
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
        ListboxProps={{
          sx: {
            maxHeight: 400,
          },
        }}
      />
    </Box>
  )
}
