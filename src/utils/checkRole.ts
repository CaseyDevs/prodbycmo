export async function checkRole(): Promise<string | null> {
    const res = await fetch("/api/me");
    const data = await res.json();
    return data.role;
}