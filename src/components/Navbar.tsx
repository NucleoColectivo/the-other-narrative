"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Palette, Check } from 'lucide-react';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: 'Mirada', href: '/conciencia' },
  { name: 'Áreas', href: '/experiencia' },
  { name: 'Proyectos', href: '/proyectos' },
  { name: 'Insights', href: '/blog' },
  { name: 'Multimedia', href: '/multimedia' },
  { name: 'Contacto', href: '/contacto' },
];

const themes: { name: string; value: Theme; color: string }[] = [
  { name: 'Editorial', value: 'editorial', color: 'bg-[#C05A3B]' },
  { name: 'Digital', value: 'digital', color: 'bg-[#B7DA2D]' },
  { name: 'Celeste', value: 'ocean', color: 'bg-[#00BFFF]' },
  { name: 'Aurea', value: 'gold', color: 'bg-[#D4AF37]' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out px-4 sm:px-6 md:px-12",
        scrolled 
          ? "bg-background/95 backdrop-blur-md border-b py-3 shadow-sm" 
          : "bg-transparent py-4 sm:py-6"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className={cn(
              "text-base sm:text-lg font-bold font-headline tracking-tighter lowercase z-[70] transition-colors duration-500",
              scrolled || isOpen ? "text-foreground" : "text-white"
            )}
          >
            the other narrative.
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-8">
            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-10">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[9px] font-bold tracking-[0.25em] uppercase transition-all duration-500 hover:text-primary",
                        scrolled ? "text-foreground/60" : "text-white/80"
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "p-2 rounded-full transition-all duration-500 hover:bg-primary/10 group focus:outline-none",
                    scrolled || isOpen ? "text-foreground/60" : "text-white/80"
                  )}
                  title="Cambiar paleta cromática"
                >
                  <Palette className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border-border rounded-sm p-2 shadow-2xl">
                <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-widest opacity-40 px-3 py-2">
                  Paletas Editoriales
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                {themes.map((t) => (
                  <DropdownMenuItem
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className="flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-sm hover:bg-muted/50 transition-colors focus:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("h-3 w-3 rounded-full border border-black/10", t.color)} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t.name}</span>
                    </div>
                    {theme === t.value && <Check className="h-3 w-3 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 z-[70] group focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between items-end">
                <span className={cn(
                  "h-[1.5px] transition-all duration-500 ease-in-out",
                  isOpen ? "w-5 absolute top-1/2 -rotate-45 bg-foreground" : cn("w-5", scrolled ? "bg-foreground" : "bg-white")
                )} />
                <span className={cn(
                  "h-[1.5px] transition-all duration-300 ease-in-out",
                  isOpen ? "opacity-0 w-0 bg-foreground" : cn("w-3", scrolled ? "bg-foreground" : "bg-white")
                )} />
                <span className={cn(
                  "h-[1.5px] transition-all duration-500 ease-in-out",
                  isOpen ? "w-5 absolute top-1/2 rotate-45 bg-foreground" : cn("w-1", scrolled ? "bg-foreground" : "bg-white")
                )} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-[55] bg-background transition-all duration-700 ease-in-out flex flex-col items-center justify-center overflow-y-auto px-6 py-20",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <nav className="w-full max-w-2xl text-center">
          <ul className="flex flex-col items-center gap-6 md:gap-8">
            {navLinks.map((link, i) => (
              <li 
                key={link.href}
                className={cn(
                  "transition-all duration-700",
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter hover:text-primary transition-all duration-500 block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
