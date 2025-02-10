import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

async function main() {
    const client = postgres(process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL!)
    const db = drizzle({ client });
}

main();
