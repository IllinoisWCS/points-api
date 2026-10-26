import dotenv from 'dotenv';

// run with: yarn sync:map
dotenv.config();

// TODO (Task 3): read approved rows from the "TEST Alumni Map Data" Notion
// database and print them as objects matching src/models/mapStory.ts.
// No Mongo writes yet.
//
// - Use `new Client({ auth: process.env.NOTION_MAP_TOKEN })` from
//   @notionhq/client (pinned to v2, same as the website).
// - Query process.env.NOTION_MAP_DATABASE_ID with a filter on Approved.
// - Notion returns at most 100 rows per call. Loop while `has_more` is true,
//   passing `next_cursor` as `start_cursor`. See IllinoisWCS.github.io
//   src/server/server.js lines 85-101 (pagination) and 253-266 (filter +
//   pagination).
async function sync() {
  console.log(
    `syncMapStories: env loaded (NOTION_MAP_TOKEN set: ${Boolean(
      process.env.NOTION_MAP_TOKEN
    )})`
  );
}

sync();
