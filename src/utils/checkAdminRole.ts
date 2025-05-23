export async function checkRole(): Promise<boolean> {
    const res = await fetch("/api/me");
    const data = await res.json();
    return data.role;
}