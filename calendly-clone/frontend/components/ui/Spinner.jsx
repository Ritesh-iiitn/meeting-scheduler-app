import { Loader2 } from "lucide-react"

export function Spinner({ className, ...props }) {
  return (
    <Loader2 className={\`h-4 w-4 animate-spin \${className}\`} {...props} />
  )
}
