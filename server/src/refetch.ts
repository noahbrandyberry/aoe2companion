import {createDB} from "./helper/db";
import {fetchMatch, fetchMatches} from "../../serverless/src/helper";
import {PrismaClient} from "@prisma/client"
import {differenceInHours, fromUnixTime} from "date-fns";
import {upsertMatchesWithPlayers} from "../../serverless/entity/entity-helper";
import {createExpress} from "./helper/express";
import {formatDayAndTime, sleep} from './helper/util';

const app = createExpress();

const prisma = new PrismaClient({
    // log: ['query', 'info', 'warn'],
});

const FETCH_COUNT = 300;

async function refetchMatchesSinceLastTime() {
    const connection = await createDB();

    console.log(new Date(), "Refetch unfinished matches");

    const unfinishedMatches = await prisma.match.findMany({
        where: {
            AND: [
                { maybe_finished: null },
                { finished: null },
            ],
        },
        orderBy: { started: 'asc' },
        take: FETCH_COUNT,
        include: {
            players: true,
        }
    })

    console.log('GOT', unfinishedMatches.length);

    if (unfinishedMatches.length === 0) return false;

    for (const unfinishedMatch of unfinishedMatches) {
        console.log(new Date(), "Fetch match", unfinishedMatch.match_id, formatDayAndTime(fromUnixTime(unfinishedMatch.started)));
        let updatedMatch = await fetchMatch('aoe2de', { uuid: unfinishedMatch.match_uuid, match_id: unfinishedMatch.match_id });
        const hoursAgo = differenceInHours(new Date(), fromUnixTime(unfinishedMatch.started));
        console.log(new Date(), "Fetched match", hoursAgo + 'h ago');
        if (updatedMatch) {
            if (updatedMatch.finished) {
                await upsertMatchesWithPlayers(connection, [updatedMatch]);
                console.log(new Date(), 'SAVED');
            } else {
                await prisma.match.update({
                    where: {
                        match_id: unfinishedMatch.match_id,
                    },
                    data: {
                        maybe_finished: hoursAgo >= 24 ? -5 : -1,
                    },
                });
                console.log(new Date(), hoursAgo >= 24 ? 'UNFINISHED FOREVER' : 'UNFINISHED');
            }
        } else {
            console.log(new Date(), 'NOT FOUND');
        }
    }

    return true;
}

async function refetchMatches() {
    try {
        const matchesProcessed = await refetchMatchesSinceLastTime();
        if (matchesProcessed) {
            console.log('Waiting 0s');
            setTimeout(refetchMatches, 0 * 1000);
        } else {
            console.log('Waiting 10s');
            setTimeout(refetchMatches, 10 * 1000);
        }
    } catch (e) {
        console.error(e);
        setTimeout(refetchMatches, 60 * 1000);
    }
}

async function main() {
    await createDB();
    app.listen(process.env.PORT || 3010, () => console.log(`Server listening on port ${process.env.PORT || 3010}!`));
    await refetchMatches();
}

main();

























// console.log('--------');
// const used = process.memoryUsage() as any;
// for (let key in used) {
//     console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
// }
// console.log('--------');

// const res = await prisma.match.findMany({
//     include: {
//         players: true,
//     },
//     where: {
//         AND: [
//             { players: { some: { profile_id: { in: [196240, 197930] } } } },
//             // { players: { some: { OR: [{ profile_id: 196240 }, { profile_id: 197930 }] } } },
//             // { players: { some: { profile_id: 197930 } } },
//             // { players: { some: { profile_id: 199325 } } },
//         ],
//     },
//     skip: 0,
//     take: 5,
//     orderBy: { started: 'desc' },
// });
// console.log('res', res);
//
// return;
