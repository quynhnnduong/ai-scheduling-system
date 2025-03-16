// Instead of direct database access, proxy to Python backend
export async function GET() {
  const res = await fetch('http://localhost:8000/api/appointments/')
  if (!res.ok) throw new Error('Failed to fetch appointments')
  return Response.json(await res.json())
} 