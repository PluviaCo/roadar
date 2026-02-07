import React, { createContext, useCallback, useContext, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import type { AlertColor } from '@mui/material'

interface SnackbarContextType {
  showSnack: (message: string, severity?: AlertColor) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
)

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext)
  if (!ctx)
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  return ctx
}

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('success')

  const showSnack = useCallback((msg: string, sev: AlertColor = 'success') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }, [])

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <SnackbarContext.Provider value={{ showSnack }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
