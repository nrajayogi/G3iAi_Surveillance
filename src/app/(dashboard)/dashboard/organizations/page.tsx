import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function OrganizationsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Organization Management</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Tenants & Organizations</CardTitle>
                    <CardDescription>Multi-tenancy configuration.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-12 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                        Feature in development (Phase 3).
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
