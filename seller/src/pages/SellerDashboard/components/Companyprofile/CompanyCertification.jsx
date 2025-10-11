import {
  FileTextIcon,
  CheckCircleIcon,
  GlobeIcon,
  ReceiptIcon,
  BarChart3Icon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function CertificateToolbar() {
  return (
    <div className="flex flex-wrap justify-end items-center gap-2">
    
    
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FileTextIcon className="mr-2 h-4 w-4" />
              Business Registration
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Tax Compliance
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <GlobeIcon className="mr-2 h-4 w-4" />
              Import Export Code (IEC)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ReceiptIcon className="mr-2 h-4 w-4" />
              GST Certificate
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon className="mr-2 h-4 w-4" />
              Trash
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
