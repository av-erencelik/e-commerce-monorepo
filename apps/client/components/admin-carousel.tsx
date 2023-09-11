'use client';
import useEmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
} from 'embla-carousel-react';
import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import { Button, cn } from '@e-commerce-monorepo/ui';
import Image from 'next/image';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { HomeIcon } from '@radix-ui/react-icons';
import { UseFieldArrayRemove, UseFieldArrayUpdate } from 'react-hook-form';

interface AdminCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: {
    url: string;
    key: string;
    isFeatured: boolean;
  }[];
  options?: EmblaOptionsType;
  removeImage?: UseFieldArrayRemove;
  updateImage?: UseFieldArrayUpdate<
    {
      name: string;
      description: string;
      stock: string;
      subCategoryId: string;
      price: string;
      images: {
        key: string;
        isFeatured: boolean;
        url: string;
        type?: string | undefined;
        file?: any;
      }[];
      weight?: string | undefined;
    },
    'images'
  >;
}

const AdminCarousel = ({
  images,
  className,
  options,
  removeImage,
  updateImage,
  ...props
}: AdminCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  if (images.length === 0) {
    return (
      <div className="flex">
        <div
          aria-label="Product Placeholder"
          role="img"
          aria-roledescription="placeholder"
          className="flex aspect-square h-full w-full items-center justify-center bg-secondary md:flex-fourth flex-full sm:flex-half"
        >
          <ImageIcon
            className="h-9 w-9 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="Product image carousel"
      className={cn('flex flex-col gap-2 relative', className)}
      {...props}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div
          className="-ml-4 flex touch-pan-y"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {images.map((image, index) => (
            <div
              className="relative min-w-0 flex-full sm:flex-half md:flex-fourth pl-4"
              key={index}
            >
              <AspectRatio ratio={1}>
                <Image
                  aria-label={`Slide ${index + 1} of ${images.length}`}
                  role="group"
                  key={index}
                  aria-roledescription="slide"
                  src={image.url}
                  alt={image.key}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center border rounded-md"
                  priority={index === 0}
                />
                {image.isFeatured && !removeImage && !updateImage && (
                  <span className="p-1 bg-gold-100/70 absolute right-3 top-3 rounded-sm">
                    <HomeIcon
                      className="h-6 w-6 text-gold-500"
                      strokeWidth={2}
                    />
                    <span className="sr-only">Featured</span>
                  </span>
                )}
                {removeImage && updateImage && (
                  <div className="p-1 bg-gold-100/70 absolute right-10 top-3 rounded-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1 aspect-square h-4 w-4 rounded-full sm:h-7 sm:w-7 absolute top-1/2 left-2 z-10 bg-gold-100/70 hover:bg-gold-100/70 hover:text-destructive"
                      onClick={() => {
                        removeImage(index);
                      }}
                    >
                      <X className="h-3 w-3 sm:h-6 sm:w-6" aria-hidden="true" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'p-1 aspect-square h-4 w-4 rounded-full sm:h-7 sm:w-7 absolute top-1/2 right-2 z-10 bg-gold-100/70 hover:bg-gold-100/70',
                        {
                          'text-gold-500 hover:text-foreground':
                            image.isFeatured,
                        }
                      )}
                      onClick={() => {
                        updateImage(index, {
                          ...image,
                          isFeatured: !image.isFeatured,
                        });
                      }}
                    >
                      <HomeIcon
                        className="h-3 w-3 sm:h-6 sm:w-6"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Feature image</span>
                    </Button>
                  </div>
                )}
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="mr-0.5 aspect-square h-7 w-7 rounded-full sm:mr-2 sm:h-8 sm:w-8 absolute top-1/2 left-2 z-10 bg-gold-100/50 hover:bg-gold-100/70"
        disabled={prevBtnDisabled}
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-3 w-3 sm:h-6 sm:w-6" aria-hidden="true" />
        <span className="sr-only">Previous slide</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="ml-0.5 aspect-square h-7 w-7 sm:ml-2 sm:h-8 sm:w-8 rounded-full absolute top-1/2 right-2 z-10 bg-gold-100/50 hover:bg-gold-100/70"
        disabled={nextBtnDisabled}
        onClick={scrollNext}
      >
        <ChevronRight className="h-3 w-3 sm:h-6 sm:w-6" aria-hidden="true" />
        <span className="sr-only">Next slide</span>
      </Button>
    </div>
  );
};

export default AdminCarousel;
