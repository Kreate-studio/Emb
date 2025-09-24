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
    imageId: 'hub-bot-bg',
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
imageId: 'hub-anime-bg',
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

export const partners = [
  {
    name: 'Mythic Realms',
    joinLink: '#',
    imageId: 'partner-mythic-realms',
  },
  {
    name: 'Cyber Scape',
    joinLink: '#',
    imageId: 'partner-cyber-scape',
  },
  {
    name: 'Pixel Perfect',
    joinLink: '#',
imageId: 'partner-pixel-perfect',
  },
  {
    name: 'Bardic Tales',
    joinLink: '#',
    imageId: 'partner-bardic-tales',
  },
  {
    name: 'Aesthetic Valley',
    joinLink: '#',
    imageId: 'partner-aesthetic-valley',
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

export const events = [
  {
    title: 'Nexus Clash Tournament',
    category: 'Gaming',
    description: 'The seasonal tournament begins. Sharpen your blades!',
    imageId: 'event-tournament',
  },
  {
    title: 'Chiaroscuro Art Contest',
    category: 'Art',
    description: 'Showcase your mastery of light and shadow. Grand prizes await.',
    imageId: 'event-contest',
  },
  {
    title: 'The Ashen Masquerade',
    category: 'Roleplay',
    description: 'A realm-wide roleplaying event of intrigue and mystery.',
    imageId: 'event-rp',
  },
  {
    title: 'Artist Hub Launch',
    category: 'Update',
    description: 'The new Artist Hub is coming soon! Prepare your portfolios.',
    imageId: 'event-update',
  },
];

export const loreEntries = [
  {
    title: 'The Eternal Queen & King',
    content:
      'At the heart of the realm stand the Eternal Queen and King, immortal sovereigns who have witnessed ages turn to dust. Their wisdom is as boundless as their power, guiding the sanctuary through eons of turmoil and peace. They are the twin flames from which the sanctuary was born.',
  },
  {
    title: 'The High Council',
    content:
      'Comprised of the most esteemed and sagacious individuals from across the realms, the High Council advises the Eternal monarchs. Each member is a master of their craft—be it arcane arts, statecraft, or ancient warfare—ensuring the kingdom’s stability and prosperity.',
  },
  {
    title: 'The Wardens',
    content:
      'The silent protectors and enforcers of the sanctuary’s laws. Clad in moonlit silver armor, the Wardens patrol the seen and unseen paths of the realm. They are chosen for their unwavering loyalty and formidable skills, embodying justice and order.',
  },
  {
    title: 'Citizens of the Realm',
    content:
      'From the most talented artists to the bravest gamers, the citizens are the lifeblood of D’Last Sanctuary. They are the creators, the dreamers, and the adventurers whose passions and stories weave the very fabric of the kingdom, shaping its destiny with every creation and quest.',
  },
];
