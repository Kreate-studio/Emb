
import { getGuildMember, getGuildRoles, type DiscordMember, type GuildRole } from '@/lib/discord-service';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSession, type SessionUser } from '@/lib/auth';
import { getEconomyProfile, type EconomyProfile } from '@/lib/economy-service';
import { cookies } from 'next/headers';
import { ProfileContent } from '@/components/profile-content';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { userId: string }
}

async function getProfileData(userId: string) {
    const sessionCookie = cookies();
    const [session, memberResult, rolesResult, economyResult] = await Promise.all([
        getSession(sessionCookie),
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
            economyProfile: null,
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
        economyProfile: economyResult.profile,
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
    const data = await getProfileData(params.userId);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header session={data.session} />
            <main className="flex-1">
                <ProfileContent 
                    session={data.session}
                    member={data.member}
                    userRoles={data.userRoles}
                    economyProfile={data.economyProfile}
                    economyError={data.economyError}
                    pageError={data.error}
                />
            </main>
            <Footer />
        </div>
    );
}
