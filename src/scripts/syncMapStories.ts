import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import dotenv from 'dotenv';

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

// run with: yarn sync:map
dotenv.config();

// initialize Notion client using API token
const notion = new Client({
  auth: process.env.NOTION_MAP_TOKEN
});

type NotionProperty = PageObjectResponse['properties'][string];

// extracts plain text from Notion text fields
function getText(property: NotionProperty): string | undefined {
  if ('title' in property) {
    return property.title[0]?.plain_text;
  }

  if ('rich_text' in property) {
    return property.rich_text[0]?.plain_text;
  }

  return undefined;
}

// extracts selected option from Notion select fields
function getSelect(property: NotionProperty): string | undefined {
  if ('select' in property) {
    return property.select?.name;
  }

  return undefined;
}

// extracts numeric value from Notion number fields
function getNumber(property: NotionProperty): number | undefined {
  if ('number' in property) {
    return property.number;
  }

  return undefined;
}

// extracts URL from Notion URL fields
function getUrl(property: NotionProperty): string | null | undefined {
  if ('url' in property) {
    return property.url;
  }

  return undefined;
}

// extracts checked/unchecked value from Notion checkbox fields
function getCheckbox(property: NotionProperty): boolean | undefined {
  if ('checkbox' in property) {
    return property.checkbox;
  }

  return undefined;
}

// extracts URL of headshot (internally or externally stored)
function getHeadshotUrl(property: NotionProperty): string | undefined {
  if (!('files' in property)) {
    return undefined;
  }

  const headshot = property.files[0];

  if (!headshot) {
    return undefined;
  }

  if (headshot.type === 'file') {
    return headshot.file.url;
  }

  if (headshot.type === 'external') {
    return headshot.external.url;
  }

  return undefined;
}

// fetches approved stories (public display AND approved checked)
async function sync() {
  const stories = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  do {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_MAP_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Approved',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'Display Publicly',
            checkbox: {
              equals: true
            }
          }
        ]
      },
      start_cursor: cursor
    });

    const pageStories = response.results
      .filter(
        (page): page is PageObjectResponse =>
          page.object === 'page' && 'properties' in page
      )
      .map((page) => {
        const properties = page.properties;

        return {
          company: getText(properties['Company']),
          name: getText(properties['Name']),
          gradYear: getNumber(properties['Graduation Year']),
          type: getSelect(properties['Type']),
          jobTitle: getText(properties['Role Title']),
          city: getText(properties['City']),
          state: getSelect(properties['State']),
          story: getText(properties['Story']),
          linkedinUrl: getUrl(properties['Linkedin URL']),
          headshotUrl: getHeadshotUrl(properties['Headshot']),
          approved: getCheckbox(properties['Approved']),
          displayPublicly: getCheckbox(properties['Display Publicly']),
          notionPageId: page.id,
          lat: undefined,
          long: undefined
        };
      });

    stories.push(...pageStories);
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  } while (hasMore);

  console.log(stories);
}

sync();
