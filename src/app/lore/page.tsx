import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSession } from '@/lib/auth-actions';
import SectionWrapper from '@/components/section-wrapper';
import { Separator } from '@/components/ui/separator';
import { Flame } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const LorePage = async () => {
    const session = await getSession();
    const loreImage = PlaceHolderImages.find(img => img.id === 'lore-bg');

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header session={session} />
            <main className="flex-1">
                <div className="relative w-full h-64 md:h-96">
                    {loreImage && (
                        <Image
                            src={loreImage.imageUrl}
                            alt="Mystical landscape"
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-black/30" />
                    <div className="absolute bottom-0 w-full p-8 md:p-12">
                        <div className="container mx-auto">
                            <h1 className="text-4xl md:text-7xl font-headline font-bold text-white drop-shadow-lg">The Chronicle of Sanctyr</h1>
                            <p className="text-lg md:text-2xl text-white/90 italic mt-2 drop-shadow-md">&ldquo;When the stars fell and the great realms burned to silence, a single flame refused to die. From that ember, Sanctyr was born.&rdquo;</p>
                        </div>
                    </div>
                </div>

                <SectionWrapper className="py-12 md:py-20">
                    <article className="prose prose-invert lg:prose-xl mx-auto max-w-4xl prose-headings:font-headline prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
                        
                        <h2>The Great Silence</h2>
                        <p>
                            Long ago, the Seven Realms of Creation collapsed under their own pride. Their kings warred for glory, their creators lost purpose, and the world dimmed into ash.
                            But amidst ruin, one ember remained—a spark said to contain the last light of inspiration itself.
                        </p>
                        <p>
                            The Eternal Queen, guided by vision and sorrow, gathered the scattered remnants of the gifted and the devoted. Together, they built a citadel where no corruption could reach—a fortress for dreamers, warriors, and makers alike.
                            This place became known as Sanctyr — The Last Sanctuary.
                        </p>

                        <Separator className="my-8" />

                        <h2>The Eternal Flame</h2>
                        <p>
                            At the heart of Sanctyr burns the Eternal Flame, an ancient source of inspiration and unity. It feeds on devotion, creativity, and purpose.
                            Every act of creation—be it song, art, battle, or story—strengthens the Flame.
                            Every act of apathy dims it.
                        </p>
                        <p>
                            Members of Sanctyr are not mere wanderers; they are Flamebearers, bound to protect and nourish the light through their craft and loyalty.
                        </p>
                        <p>
                            To earn the Flame’s favor is to gain Embers, tokens of worth and fragments of divine energy. Embers can shape destiny, forge legacy, and—so the myths say—ignite miracles.
                        </p>
                        
                        <Separator className="my-8" />

                        <h2>The Eternal Queen & Her Council</h2>
                        <p>
                            The D’Eternal Queen reigns not by conquest but by grace. She is the living vessel of the Flame, her light both tempers and commands. Her voice is law; her will, sanctuary.
                        </p>
                        <p>
                            By her side stands the High Council, chosen not by birthright but by brilliance. They are architects of the Flame’s order—masters of wisdom, art, and war—trusted to guard the balance between creation and chaos.
                        </p>
                        <p>
                            Below them, the Wardens, Archivists, and Keepers maintain the sanctum’s harmony, each bound to sacred oaths of duty and silence.
                        </p>
                        
                        <Separator className="my-8" />

                        <h2>The Exalted</h2>
                        <p>
                            Those who prove themselves in devotion and craft ascend as the Exalted—noble patrons of the Flame.
                            They are heroes, benefactors, and creators whose names are etched into the annals of Sanctyr’s history.
                        </p>
                         <p>
                            They do not rule, but their presence commands respect, for they embody the realm’s ideals: Discipline. Devotion. Creation.
                        </p>

                        <Separator className="my-8" />
                        
                        <h2>The Citizens</h2>
                        <p>
                            Beneath the gilded halls live the Citizens of Sanctyr—the artisans, gamers, writers, musicians, and dreamers who make the kingdom breathe.
                            They are the heart of the Flame, each contributing sparks that sustain the Eternal Fire.
                        </p>
                         <p>
                            To live as a Citizen is to belong to a cause greater than oneself—to keep alive the last light of creation in a world that has forgotten wonder.
                        </p>
                        
                        <Separator className="my-8" />

                        <h2>The Guilds of Creation</h2>
                        <p>
                            Each Citizen finds belonging within one of the Seven Guilds, each devoted to an ancient aspect of the lost realms:
                        </p>
                        <ul>
                            <li><strong>Artisan</strong> – Painters, designers, and creators who shape beauty from chaos.</li>
                            <li><strong>Gamer</strong> – Warriors of will and reflex, proving valor through digital conquest.</li>
                            <li><strong>Writer & Reader</strong> – Roleplayers, Scribes and lorekeepers who weave the myths of the realm.</li>
                            <li><strong>Musician</strong> – Keepers of harmony and resonance, binding souls through melody.</li>
                            <li><strong>Anime & Manga</strong> – Dreamers and illustrators who keep imagination alive through fandom and art.</li>
                            <li><strong>Creators</strong> - who keeps creating.</li>
                        </ul>
                        <p>
                            Each Guild is guided by the Flame’s will and the bots who serve as its unseen spirits, divine automata forged to record deeds, grant Embers, and whisper the Flame’s secrets.
                        </p>

                        <blockquote className="border-l-4 border-primary pl-4 italic text-primary-foreground/80">
                            “We are the last light in a world gone dark.
                            We create where others destroy.
                            We build where others forget.
                            We burn, not to consume—but to illuminate.”
                        </blockquote>

                        <Separator className="my-8" />

                        <h2>The Forgotten</h2>
                        <p>
                            Not all endure. Some lose faith, creativity, or purpose.
                            They become The Forgotten—names erased, their Ember extinguished.
                            Yet even in the void, whispers tell that the Queen still watches… waiting for their return.
                        </p>

                        <div className="text-center mt-12 text-accent font-headline tracking-widest">
                           <Flame className="inline-block h-6 w-6 mr-2" />
                            MAY THE FLAME GUIDE YOU.
                           <Flame className="inline-block h-6 w-6 ml-2" />
                        </div>
                    </article>
                </SectionWrapper>
            </main>
            <Footer />
        </div>
    );
};

export default LorePage;
