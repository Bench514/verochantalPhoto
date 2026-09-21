/**
 * Temporary CLI to test the client invite flow before the admin UI for it
 * exists (step 3). Usage: npx tsx scripts/invite-client.ts email@example.com
 */
import { PrismaClient } from "@prisma/client";
import { createInviteToken } from "../src/lib/invite";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx scripts/invite-client.ts email@example.com");
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  const token = await createInviteToken(user.id);
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
  console.log(`Lien d'invitation pour ${email} :`);
  console.log(`${baseUrl}/client/set-password/${token}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
