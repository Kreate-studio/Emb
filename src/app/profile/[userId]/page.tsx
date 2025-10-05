
import { getGuildMember, getGuildRoles, type GuildRole } from '@/lib/discord-service';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSession } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

function intToHex(int: number | undefined) {
    if (int === undefined || int === null || int === 0) return '#99aab5'; // Default Discord grey
    return '#' + int.toString(16).padStart(6, '0');
}


function ProfileError({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Could Not Load Profile</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
    )
}

export default async function ProfilePage({ params }: { params: { userId: string } }) {
    const [session, memberResult, rolesResult] = await Promise.all([
        getSession(),
        getGuildMember(params.userId),
        getGuildRoles(),
    ]);

    if (memberResult.error || !memberResult.member) {
        return (
             <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header session={session} />
                <main className="flex-1 container mx-auto px-4 py-8">
                     <ProfileError message={memberResult.error || 'This member could not be found in the realm.'} />
                </main>
                <Footer />
            </div>
        )
    }

    const { member } = memberResult;
    const { roles } = rolesResult;

    const userRoles = roles
        ? roles.filter(r => member.roles.includes(r.id)).sort((a, b) => b.position - a.position)
        : [];
    
    const bannerColor = userRoles.length > 0 ? intToHex(userRoles[0].color) : 'hsl(var(--primary))';


    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header session={session} />
            <main className="flex-1">
                <div className="w-full h-48" style={{ backgroundColor: bannerColor }} />
                <div className="container mx-auto px-4 -mt-24">
                     <Card className="overflow-visible">
                        <CardHeader className="flex flex-col md:flex-row items-center gap-6 border-b p-6">
                            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary -mt-16 md:-mt-8">
                                <AvatarImage src={member.avatarUrl} alt={member.displayName} />
                                <AvatarFallback>{member.displayName?.charAt(0) || member.user.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='text-center md:text-left'>
                                <h1 className="text-3xl font-bold font-headline">{member.displayName}</h1>
                                <p className="text-muted-foreground">@{member.user.username}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="font-headline text-lg font-bold mb-2">Roles</h3>
                                    {userRoles.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {userRoles.map(role => (
                                                <Badge 
                                                    key={role.id}
                                                    className="border"
                                                    style={{ 
                                                        backgroundColor: `${intToHex(role.color)}20`,
                                                        borderColor: intToHex(role.color),
                                                        color: intToHex(role.color)
                                                    }}
                                                >
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No roles to display.</p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="font-headline text-lg font-bold mb-2">Placeholder for Commands/Economy</h3>
                                    <div className="p-8 border-2 border-dashed rounded-lg flex items-center justify-center h-full">
                                        <p className="text-muted-foreground">Command interface coming soon...</p>
                                    </div>
                                d_last_sanctuary/workspace/src/lib/discord-service.ts
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
