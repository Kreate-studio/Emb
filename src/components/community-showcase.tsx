import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SectionWrapper from './section-wrapper';
import { Badge } from './ui/badge';
import { galleryItems } from '@/lib/site-data';

export function CommunityShowcase() {
  const images = galleryItems.map((item) => ({
    ...item,
    ...PlaceHolderImages.find((img) => img.id === item.id),
  }));

  return (
    <SectionWrapper id="community" className="bg-secondary/20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-headline font-bold">
          Creations of the Realm
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
          A glimpse into the incredible talent thriving within our community.
        </p>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map(
          (item, index) =>
            item.imageUrl && (
              <div
                key={index}
                className="overflow-hidden rounded-lg break-inside-avoid group relative"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.description || 'Community content'}
                  data-ai-hint={item.hint}
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {item.tag}
                </Badge>
              </div>
            )
        )}
      </div>
    </SectionWrapper>
  );
}
