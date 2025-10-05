
import { getGuildMember, getGuildRoles, type DiscordMember, type GuildRole } from '@/lib/discord-service';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSession, type SessionUser } from '@/lib/auth';
import { getEconomyProfile, type EconomyProfile } from '@/lib/economy-service';
import { cookies }s from 'next/headers';
import { ProfileContent } from '@/components/profile-content';

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


export default async function ProfilePage({ params }: { params: { userId: string } }) {
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

