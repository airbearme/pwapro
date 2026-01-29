import { memo } from 'react'
import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

const Spinner = memo(({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
})

Spinner.displayName = 'Spinner'

// ⚡ Bolt: Memoized Spinner component to prevent unnecessary re-renders.
// This is a pure, presentational component, making it an ideal candidate for memoization.
export { Spinner }
