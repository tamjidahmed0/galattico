'use client'

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

type DrawerSheetProps = {
  trigger: React.ReactNode
  title ?: string
  description?: string
  children?: React.ReactNode
}

export default function MobileMenu({
  trigger,
  title ,
  description,
  children,
}: DrawerSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className='bg-gray-900 border-0'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
