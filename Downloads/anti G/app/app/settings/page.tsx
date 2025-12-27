"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Save, User, Shield, Bell, Smartphone, Monitor } from "lucide-react"

// Demo data for fallback
const DEMO_USER = {
    id: "demo-user",
    email: "demo@muscatbay.com",
    full_name: "Abdulrahim Albalushi",
    username: "admin_user",
    website: "https://muscatbay.com",
    avatar_url: "/avatars/01.png", // Assuming this might not exist, fallback will handle it
    role: "Administrator"
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [isDemo, setIsDemo] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>({
        full_name: "",
        username: "",
        website: "",
        avatar_url: "",
    })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile')

    const supabase = getSupabaseClient()

    useEffect(() => {
        async function loadData() {
            setLoading(true)

            // Check if Supabase is available
            if (!supabase) {
                console.log("Supabase not configured, using Demo mode")
                useDemoData()
                setLoading(false)
                return
            }

            try {
                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser()

                if (userError || !user) {
                    console.log("No authenticated user, using Demo mode")
                    useDemoData()
                    setLoading(false)
                    return
                }

                setUser(user)
                setIsDemo(false)

                // Get profile
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setProfile({
                        full_name: data.full_name || "",
                        username: data.username || "",
                        website: data.website || "",
                        avatar_url: data.avatar_url || "",
                    })
                } else {
                    // Initialize with empty profile if none exists
                    setProfile({
                        full_name: user.user_metadata?.full_name || "",
                        username: "",
                        website: "",
                        avatar_url: user.user_metadata?.avatar_url || "",
                    })
                }
            } catch (error) {
                console.error('Error loading settings:', error)
                useDemoData()
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [supabase])

    const useDemoData = () => {
        setIsDemo(true)
        setUser({ id: DEMO_USER.id, email: DEMO_USER.email })
        setProfile({
            full_name: DEMO_USER.full_name,
            username: DEMO_USER.username,
            website: DEMO_USER.website,
            avatar_url: "",
        })
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return
        }
        const file = event.target.files[0]
        setAvatarFile(file)

        // Create preview
        const objectUrl = URL.createObjectURL(file)
        setAvatarPreview(objectUrl)
    }

    const uploadAvatar = async (userId: string) => {
        if (!avatarFile || !supabase) return null

        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${userId}-${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        return data.publicUrl
    }

    const updateProfile = async () => {
        setUpdating(true)

        if (isDemo) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            setUpdating(false)
            // Show toast or alert (using simple alert for now as toast isn't set up)
            window.alert("Settings saved! (Demo Mode - changes not persisted)")
            return
        }

        if (!user || !supabase) return

        try {
            let avatarUrl = profile.avatar_url

            if (avatarFile) {
                avatarUrl = await uploadAvatar(user.id)
            }

            const updates = {
                id: user.id,
                full_name: profile.full_name,
                username: profile.username,
                website: profile.website,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            }

            const { error } = await supabase
                .from('profiles')
                .upsert(updates)

            if (error) throw error

            setProfile(prev => ({ ...prev, avatar_url: avatarUrl }))
            setAvatarPreview(null)
            setAvatarFile(null)

            window.alert('Profile updated successfully!')
        } catch (error: any) {
            console.error(error)
            window.alert('Error updating profile: ' + error.message)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--mb-primary)]" />
            </div>
        )
    }

    return (
        <div className="flex-1 p-8 pt-6 space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account settings and profile information.</p>
                </div>
                {isDemo && (
                    <Badge variant="secondary" className="w-fit px-4 py-1.5 text-sm bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                        Demo Mode
                    </Badge>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="lg:w-64 space-y-1">
                    {[
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'account', label: 'Account', icon: Shield },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                ? "bg-mb-primary text-white shadow-md"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'profile' && (
                        <>
                            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Public Profile</CardTitle>
                                    <CardDescription>
                                        This information represents you publicly on the platform.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-lg">
                                            <AvatarImage src={avatarPreview || profile.avatar_url} />
                                            <AvatarFallback className="bg-[var(--mb-secondary)] text-white text-2xl font-bold">
                                                {profile.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Label
                                                    htmlFor="avatar-upload"
                                                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 h-9 px-4 py-2"
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Change Avatar
                                                </Label>
                                                {avatarPreview && (
                                                    <Button variant="ghost" size="sm" onClick={() => {
                                                        setAvatarPreview(null)
                                                        setAvatarFile(null)
                                                    }} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Recommended: 400x400px. Max size: 2MB.
                                            </p>
                                        </div>
                                        <Input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="full-name">Full Name</Label>
                                            <Input
                                                id="full-name"
                                                value={profile.full_name}
                                                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                                placeholder="e.g. John Doe"
                                                className="max-w-md"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                value={profile.username}
                                                onChange={e => setProfile({ ...profile, username: e.target.value })}
                                                placeholder="e.g. john_doe"
                                                className="max-w-md"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                value={profile.website}
                                                onChange={e => setProfile({ ...profile, website: e.target.value })}
                                                placeholder="https://example.com"
                                                className="max-w-md"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {isDemo ? "Changes are not saved in demo mode." : "Please use 32 characters or less."}
                                    </p>
                                    <Button
                                        onClick={updateProfile}
                                        disabled={updating}
                                        className="bg-mb-primary hover:bg-mb-primary-hover text-white"
                                    >
                                        {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        </>
                    )}

                    {activeTab === 'account' && (
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle>Account Security</CardTitle>
                                <CardDescription>
                                    Manage your login credentials and security perferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="flex max-w-md items-center space-x-2">
                                        <Input
                                            id="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="bg-slate-100 dark:bg-slate-800 text-slate-500"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Contact your administrator to change your email address.
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Active Sessions</h3>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-full border shadow-sm">
                                                <Monitor className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Windows PC • Chrome</p>
                                                <p className="text-xs text-slate-500">Muscat, Oman • Active now</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Current</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-full border shadow-sm">
                                                <Smartphone className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">iPhone 13 • Safari</p>
                                                <p className="text-xs text-slate-500">Muscat, Oman • 2 days ago</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs">Revoke</Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {isDemo ? "Changes are not saved in demo mode." : "Session management options."}
                                </p>
                                <Button
                                    onClick={updateProfile}
                                    disabled={updating}
                                    className="bg-mb-primary hover:bg-mb-primary-hover text-white"
                                >
                                    {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Configure how you receive alerts and reports.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Alerts</Label>
                                        <p className="text-sm text-slate-500">Receive daily summary reports via email.</p>
                                    </div>
                                    <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-700 relative cursor-pointer" onClick={() => window.alert("Toggle feature in Demo Mode")}>
                                        <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform" />
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Critical Alarms</Label>
                                        <p className="text-sm text-slate-500">Immediate notifications for critical system failures (SMS).</p>
                                    </div>
                                    <div className="h-6 w-11 rounded-full bg-[#4E4456] relative cursor-pointer">
                                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {isDemo ? "Changes are not saved in demo mode." : "Configure your notification preferences."}
                                </p>
                                <Button
                                    onClick={updateProfile}
                                    disabled={updating}
                                    className="bg-mb-primary hover:bg-mb-primary-hover text-white"
                                >
                                    {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
