import { Bot, Brush, Gamepad2, Library, Music, Users, LucideIcon } from 'lucide-react';

export type EcosystemItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  comingSoon: boolean;
  imageId: string;
  modalContent?: {
    description?: string;
    features?: string[];
  };
};

export const ecosystemItems: EcosystemItem[] = [
  {
    icon: Bot,
    title: 'Emberlyn Bot',
    description:
      'A versatile Discord bot to manage your community and enhance engagement.',
    comingSoon: false,
    imageId: 'community-cosplay-2',
    modalContent: {
      description:
        'Emberlyn is the official bot of D\'Last Sanctuary, packed with features for moderation, engagement, and utility. She is an integral part of our community, helping to keep the realm safe and vibrant.',
      features: [
        'Advanced Moderation Tools',
        'Role & Permission Management',
        'Custom Engagement Commands',
        'Event & Announcement Integration',
        'AI-Powered Q&A',
      ],
    },
  },
  {
    icon: Brush,
    title: 'Artist Hub',
    description:
      'A dedicated space for artists to showcase their work, find inspiration, and collaborate.',
    comingSoon: true,
    imageId: 'hub-artist-bg',
  },
  {
    icon: Gamepad2,
    title: 'Gaming Hub',
    description:
      'Organize tournaments, track stats, and connect with fellow gamers.',
    comingSoon: true,
    imageId: 'hub-gaming-bg',
  },
  {
    icon: Music,
    title: 'Music Hub',
    description:
      'Share your compositions, discover new music, and collaborate on projects.',
    comingSoon: true,
    imageId: 'hub-music-bg',
  },
  {
    icon: Library,
    title: 'Anime/Fandom Hub',
    description:
      'A central place for all things anime and fandom, from discussions to fan art.',
    comingSoon: true,
    imageId: 'community-art-1',
  },
  {
    icon: Users,
    title: 'Creator Hub',
    description:
      'Tools and resources for creators to manage their content and grow their audience.',
    comingSoon: true,
    imageId: 'hub-creator-bg',
  },
];

export const galleryItems = [
  { id: 'community-art-1', tag: 'Art', hint: 'fantasy art' },
  { id: 'community-cosplay-1', tag: 'Cosplay', hint: 'fantasy cosplay' },
  { id: 'community-art-2', tag: 'Art', hint: 'fantasy character' },
  { id: 'community-music-1', tag: 'Music', hint: 'fantasy album' },
  { id: 'community-rp-1', tag: 'Roleplay', hint: 'fantasy scene' },
  { id: 'community-art-3', tag: 'Art', hint: 'fantasy creature' },
  { id: 'community-writing-1', tag: 'Writing', hint: 'fantasy story' },
  { id: 'community-cosplay-2', tag: 'Cosplay', hint: 'elf cosplay' },
  { id: 'community-art-4', tag: 'Art', hint: 'dragon art' },
  { id: 'community-video-1', tag: 'Video', hint: 'gameplay video' },
];

export const loreEntries = [
  {
    title: 'The Eternal Flame',
    content:
      'At the heart of Sanctyr burns the Eternal Flame, an ancient source of inspiration and unity. It feeds on devotion, creativity, and purpose. Every act of creation—be it song, art, battle, or story—strengthens the Flame. Every act of apathy dims it. Members of Sanctyr are not mere wanderers; they are Flamebearers, bound to protect and nourish the light through their craft and loyalty.',
  },
  {
    title: 'The Eternal Queen & Her Council',
    content:
      "The D’Eternal Queen reigns not by conquest but by grace. She is the living vessel of the Flame, her light both tempers and commands. Her voice is law; her will, sanctuary. By her side stands the High Council, chosen not by birthright but by brilliance. They are architects of the Flame’s order—masters of wisdom, art, and war—trusted to guard the balance between creation and chaos.",
  },
  {
    title: 'The Exalted & The Citizens',
    content:
      "Those who prove themselves in devotion and craft ascend as the Exalted—noble patrons of the Flame whose names are etched into the annals of Sanctyr’s history. Beneath them live the Citizens—the artisans, gamers, writers, and dreamers who make the kingdom breathe. They are the heart of the Flame, each contributing sparks that sustain the Eternal Fire.",
  },
  {
    title: 'The Guilds of Creation',
    content:
      'Each Citizen finds belonging within one of the Seven Guilds, each devoted to an ancient aspect of the lost realms: Artisan, Gamer, Writer & Reader, Musician, Anime & Manga, and Creators. Each Guild is guided by the Flame’s will and the bots who serve as its unseen spirits, forged to record deeds and grant Embers.',
  },
];
