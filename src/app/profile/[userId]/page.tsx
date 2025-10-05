
import { getGuildMember, getGuildRoles, type DiscordMember, type GuildRole } from '@/lib/discord-service';
import { Header } from '@/components/header';
import { getSession } from '@/lib/auth-actions';
import { getEconomyProfile, type EconomyProfile } from '@/lib/economy-service';
import { ProfileContent } from '@/components/profile-content';
import type { Metadata, ResolvingMetadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

type Props = {
  params: { userId: string }
}

async function getProfileData(userId: string) {
    const [session, memberResult, rolesResult, economyResult] = await Promise.all([
        getSession(),
        getGuildMember(userId),
        getGuildRoles(),
        getEconomyProfile(userId),
    ]);

    if (memberResult.error || !memberResult.member) {
        return {
            error: memberResult.error || 'This member could not be found in the realm.',
            session,
            member: null,
            userRoles: null,
            initialEconomyProfile: null,
            economyError: null,
        };
    }
    
    const { member } = memberResult;
    const { roles } = rolesResult;

    const userRoles = roles
        ? roles.filter(r => member.roles.includes(r.id)).sort((a, b) => b.position - a.position)
        : [];

    return {
        session,
        member,
        userRoles,
        initialEconomyProfile: economyResult.profile,
        economyError: economyResult.error,
        error: null,
    };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const { member } = await getGuildMember(params.userId);
 
  if (!member) {
     return {
        title: 'Profile Not Found | Sanctyr',
        description: 'The requested member could not be found in the realm.',
     }
  }
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: `${member.displayName}'s Profile | Sanctyr`,
    description: `View the profile, stats, and inventory of ${member.displayName} in the D'Last Sanctuary.`,
    openGraph: {
      title: `${member.displayName}'s Profile`,
      description: `View the profile of ${member.displayName}.`,
      images: [member.avatarUrl, ...previousImages],
    },
    twitter: {
       card: 'summary_large_image',
       title: `${member.displayName}'s Profile | Sanctyr`,
       description: `View the profile of ${member.displayName}.`,
       images: [member.avatarUrl],
    }
  }
}


export default async function ProfilePage({ params }: Props) {
    noStore();
    const data = await getProfileData(params.userId);
    
    async function handleRefresh() {
        'use server';
        // This is a bit of a workaround to trigger a re-render of the server component
        // A more robust solution might involve revalidating paths/tags
        redirect(`/profile/${params.userId}?t=${Date.now()}`);
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header session={data.session} />
            <main className="flex-1 pb-20 md:pb-0">
                <ProfileContent 
                    session={data.session}
                    member={data.member}
                    userRoles={data.userRoles}
                    initialEconomyProfile={data.initialEconomyProfile}
                    economyError={data.economyError}
                    pageError={data.error}
                    onRefresh={handleRefresh}
                />
            </main>
        </div>
    );
}

    
