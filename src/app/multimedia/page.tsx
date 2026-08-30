
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Play, 
  Mic2, 
  Loader2, 
  ChevronRight,
  Video as VideoIcon,
  X,
  Maximize2,
  CalendarDays,
} from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function MultimediaPage() {
  const firestore = useFirestore();
  const bannerImage = PlaceHolderImages.find(img => img.id === 'resonancia-bg');

  const [activePodcast, setActivePodcast] = useState<any>(null);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);

  const podcastsQuery = useMemoFirebase(() => query(collection(firestore, 'podcasts'), orderBy('createdAt', 'desc')), [firestore]);
  const videosQuery = useMemoFirebase(() => query(collection(firestore, 'featuredVideos'), orderBy('createdAt', 'desc')), [firestore]);

  const { data: podcasts, isLoading: isPodLoading } = useCollection(podcastsQuery);
  const { data: videos, isLoading: isVidLoading } = useCollection(videosQuery);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getSpotifyEmbedUrl = (url: string) => {
    if (url.includes('spotify.com')) {
      return url.replace('spotify.com/', 'spotify.com/embed/');
    }
    return url;
  };

  const defaultPodcastImage = 'https://images.pexels.com/photos/631909/pexels-photo-631909.jpeg';

  return (
    <main className="bg-background min-h-screen relative">
      <section className="relative h-[60vh] sm:h-[70vh] w-full flex items-end pb-16 sm:pb-24 overflow-hidden border-b bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage?.imageUrl || 'https://images.pexels.com/photos/1190906/pexels-photo-1190906.jpeg'}
            alt="Multimedia"
            fill
            className="object-cover opacity-75 transition-all duration-[5000ms] animate-in fade-in zoom-in-110"
            priority
          />
        </div>
        <div className="section-container relative z-10 w-full text-white">
          <span className="text-primary font-bold tracking-[0.6em] uppercase text-[9px] sm:text-[10px] mb-6 sm:mb-8 block animate-in slide-in-from-bottom-4 duration-700">
            Laboratorio Editorial
          </span>
          <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.9] mb-6 sm:mb-8 tracking-tighter text-white">
              Multimedia <br />
              <span className="italic font-normal text-primary">& Diálogo.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="section-container py-24 sm:py-32 space-y-32">
        {/* PODCAST SECTION */}
        <section className="space-y-16">
          <div className="flex items-center justify-between border-b pb-8">
            <div className="space-y-4">
              <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase flex items-center gap-3">
                <Mic2 className="h-4 w-4" /> Planeta Sostenible
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tighter">Podcast</h2>
            </div>
          </div>

          {isPodLoading ? (
            <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts?.map((pod) => (
                <div 
                  key={pod.id}
                  onClick={() => {
                    setActivePodcast(pod);
                    setIsPlayerMinimized(false);
                  }}
                  className="group flex flex-col bg-white border border-border/40 hover:border-primary/40 transition-all duration-700 rounded-sm overflow-hidden shadow-sm hover:shadow-2xl h-full cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={pod.image || defaultPodcastImage}
                      alt={pod.title}
                      fill
                      className="object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-primary text-white text-[8px] font-bold px-3 py-1.5 uppercase tracking-[0.2em]">
                        PODCAST
                      </span>
                    </div>
                  </div>

                  <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                        <CalendarDays className="h-3 w-3" /> {new Date(pod.createdAt?.toDate()).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </div>
                      <h3 className="text-xl font-bold font-headline tracking-tighter group-hover:text-primary transition-colors duration-500 leading-tight line-clamp-2">
                        {pod.title}
                      </h3>
                    </div>
                    <div className="pt-4 border-t border-border/10">
                       <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary group-hover:gap-4 transition-all flex items-center gap-2">
                        REPRODUCIR EPISODIO <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VIDEOS SECTION */}
        <section className="space-y-16">
          <div className="flex items-center justify-between border-b pb-8">
            <div className="space-y-4">
              <span className="text-primary font-bold text-[10px] tracking-[0.6em] uppercase flex items-center gap-3">
                <VideoIcon className="h-4 w-4" /> Diálogos de Cambio
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tighter">Videos</h2>
            </div>
          </div>

          {isVidLoading ? (
            <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos?.map((video) => {
                const ytId = getYouTubeId(video.url);
                return (
                  <Dialog key={video.id}>
                    <DialogTrigger asChild>
                      <div className="group flex flex-col bg-white border border-border/40 hover:border-primary/40 transition-all duration-700 rounded-sm overflow-hidden shadow-sm hover:shadow-2xl h-full cursor-pointer">
                        <div className="relative aspect-video overflow-hidden bg-black">
                          {ytId && (
                            <Image
                              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                              alt={video.title}
                              fill
                              className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000"
                            />
                          )}
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-primary text-white text-[8px] font-bold px-3 py-1.5 uppercase tracking-[0.2em]">
                              VIDEO
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
                              <Play className="h-5 w-5 fill-white text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="p-8">
                          <h3 className="text-xl font-bold font-headline tracking-tighter group-hover:text-primary transition-colors duration-500 leading-tight">
                            {video.title}
                          </h3>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl p-0 bg-black aspect-video border-0 shadow-2xl overflow-hidden rounded-sm">
                      <DialogHeader className="sr-only">
                        <DialogTitle>{video.title}</DialogTitle>
                        <DialogDescription>Reproductor de video</DialogDescription>
                      </DialogHeader>
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} 
                        frameBorder="0" 
                        allow="autoplay; encrypted-media" 
                        allowFullScreen 
                        title={video.title}
                      />
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* REPRODUCTOR PERSISTENTE COMPACTO (ESTILO SPOTIFY WHITE) */}
      <div 
        className={cn(
          "fixed z-[120] transition-all duration-500 ease-in-out bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-border/10 overflow-hidden",
          !activePodcast && "pointer-events-none opacity-0 translate-y-20",
          activePodcast && !isPlayerMinimized && "bottom-8 right-8 w-[95%] sm:w-[380px] rounded-sm flex flex-col p-6 sm:p-8 h-fit max-h-[90vh]",
          activePodcast && isPlayerMinimized && "bottom-8 right-8 w-72 h-20 rounded-sm"
        )}
      >
        {activePodcast && (
          <div className="w-full h-full flex flex-col">
            
            {/* Header: Controles y Tag (Solo visible en FULL) */}
            <div className={cn("flex justify-between items-center mb-6", isPlayerMinimized && "hidden")}>
               <span className="text-primary font-bold text-[9px] tracking-[0.4em] uppercase">LABORATORIO SONORO</span>
               <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/40 hover:text-primary" onClick={() => setIsPlayerMinimized(true)}>
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/40 hover:text-destructive" onClick={() => setActivePodcast(null)}>
                    <X className="h-4 w-4" />
                  </Button>
               </div>
            </div>

            {/* Contenedor de Contenido (Full / Mini) */}
            <div className={cn(
              "flex transition-all duration-500",
              !isPlayerMinimized ? "flex-col" : "flex-row items-center gap-4 p-3 h-full"
            )}>
              
              {/* VISTA FULL: Compacta y Vertical */}
              <div className={cn("w-full flex flex-col", isPlayerMinimized && "hidden")}>
                
                {/* Banner: Imagen + Título Blanco Superpuesto (Eleva el reproductor) */}
                <div className="relative w-full aspect-square sm:max-h-[220px] overflow-hidden rounded-sm shadow-md mb-6 group">
                  <Image 
                    src={activePodcast.image || defaultPodcastImage} 
                    alt={activePodcast.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Título sobre la imagen en blanco */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-bold font-headline tracking-tighter leading-[1.1] text-white text-base sm:text-lg animate-in fade-in slide-in-from-bottom-2 duration-700">
                      {activePodcast.title}
                    </h3>
                  </div>
                </div>

                {/* Crédito del Invitado - Compacto */}
                {activePodcast.guest && (
                  <div className="w-full border-l-2 border-primary/40 pl-4 py-1 mb-4">
                    <p className="text-primary font-bold text-[8px] sm:text-[9px] tracking-[0.4em] uppercase italic opacity-90 leading-relaxed">
                      CON {activePodcast.guest}
                    </p>
                  </div>
                )}
              </div>

              {/* VISTA MINIMIZADA: Según Referencia (Thumb + Icons Visibles) */}
              <div className={cn("flex items-center justify-between w-full flex-1", !isPlayerMinimized && "hidden")}>
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-sm border flex-shrink-0 shadow-sm">
                    <Image src={activePodcast.image || defaultPodcastImage} alt={activePodcast.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col max-w-[120px]">
                    <span className="text-[8px] font-bold text-primary uppercase tracking-widest truncate">{activePodcast.title}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 items-center">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:text-primary transition-colors" onClick={() => setIsPlayerMinimized(false)}>
                    <Maximize2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:text-destructive transition-colors" onClick={() => setActivePodcast(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* EL REPRODUCTOR: PERSISTENTE (No se detiene al minimizar) */}
              <div className={cn(
                "w-full transition-all duration-500",
                isPlayerMinimized ? "h-0 opacity-0 overflow-hidden pointer-events-none" : "h-[152px] mt-2 opacity-100"
              )}>
                <iframe 
                  src={getSpotifyEmbedUrl(activePodcast.url)} 
                  width="100%" 
                  height="152"
                  frameBorder="0" 
                  allow="encrypted-media; autoplay"
                  className="rounded-sm"
                />
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}

