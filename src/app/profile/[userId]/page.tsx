
'use client';
import { getGuildMember, getGuildRoles, type DiscordMember, type GuildRole } from '@/lib/discord-service';
import { Header } from '@/components/header';
import { getSession } from '@/lib/auth-actions';
import { getEconomyProfile, type EconomyProfile } from '@/lib/economy-service';
import { ProfileContent } from '@/components/profile-content';
import type { Metadata, ResolvingMetadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { handleRefresh } from '@/app/actions';
import React, { useState, useEffect } from 'react';

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

// This function is still useful for server-side metadata generation, but we can't call it directly in a client component.
// We'll call getProfileData and handle metadata in a useEffect hook or by passing props.

export default function ProfilePage({ params }: { params: { userId: string } }) {
    noStore();
    const [data, setData] = useState<Awaited<ReturnType<typeof getProfileData>> | null>(null);
    const [loading, setLoading] = useState(true);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const profileData = await getProfileData(params.userId);
            setData(profileData);
            setLoading(false);
            
            // Set metadata
            if (profileData.member) {
                document.title = `${profileData.member.displayName}'s Profile | Sanctyr`;
            } else {
                 document.title = 'Profile Not Found | Sanctyr';
            }
        };
        fetchData();
    }, [params.userId]);
    
    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > 100 && window.scrollY > lastScrollY) {
                    setShowHeader(false);
                } else {
                    setShowHeader(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlHeader);
            return () => {
                window.removeEventListener('scroll', controlHeader);
            };
        }
    }, [lastScrollY]);

    // We're moving to a client-side rendering model for this page, so generateMetadata is not directly used.
    // Metadata is handled in the useEffect hook.
    
    if (loading || !data) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                 {/* Render a static or loading header */}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                 <Header session={data.session} />
            </div>
            <main className="flex-1 pb-20 md:pb-0 pt-20 md:pt-0">
                <ProfileContent 
                    session={data.session}
                    member={data.member}
                    userRoles={data.userRoles}
                    initialEconomyProfile={data.initialEconomyProfile}
                    economyError={data.economyError}
                    pageError={data.error}
                    onRefresh={() => handleRefresh(params.userId)}
                />
            </main>
        </div>
    );
}

    
