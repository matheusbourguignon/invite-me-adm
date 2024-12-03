import { prisma } from '../src/lib/prisma'

async function seed() {
    await prisma.event.create({
        data: {
            title: 'Invite-Me',
            slug: 'invite-me',
            details: 'Projeto de controle de verificação entrada e saída de convidados de evento.',
            maximumAttendees:120,
        }
    })
}

seed().then(() => {
    console.log('Database seeded!')
    prisma.$disconnect()
})