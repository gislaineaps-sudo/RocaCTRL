"use client"

import React from "react"
import { Type, Contrast, Accessibility, MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/accessibility-context"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function AccessibilityPopover() {
  const { isHighContrast, toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
          <Accessibility className="h-4 w-4" />
          <span className="hidden md:inline">Acessibilidade</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Configurações Rápidas</h4>
            <p className="text-sm text-muted-foreground">
              Ajuste para melhor leitura.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Tamanho da Fonte</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={decreaseFontSize} title="Diminuir Letra">
                  <Type className="h-3 w-3" />-
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={increaseFontSize} title="Aumentar Letra">
                  <Type className="h-4 w-4" />+
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Alto Contraste</span>
              <Button 
                variant={isHighContrast ? "default" : "outline"} 
                size="sm" 
                onClick={toggleHighContrast}
              >
                <Contrast className="h-4 w-4 mr-2" />
                {isHighContrast ? "Desativar" : "Ativar"}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
