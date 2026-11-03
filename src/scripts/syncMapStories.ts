import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import dotenv from 'dotenv';

// run with: yarn sync:map
dotenv.config();

const { NOTION_MAP_TOKEN, NOTION_MAP_DATABASE_ID } = process.env;
if (!NOTION_MAP_TOKEN || !NOTION_MAP_DATABASE_ID) {
  console.error(
    'syncMapStories: NOTION_MAP_TOKEN and NOTION_MAP_DATABASE_ID must be set in .env'
  );
  process.exit(1);
}

// initialize Notion client using API token
const notion = new Client({
  auth: NOTION_MAP_TOKEN
});

type NotionProperty = PageObjectResponse['properties'][string];

// extracts plain text from Notion text fields. Notion splits text into
// several pieces wherever formatting changes, so join all of them.
function getText(property: NotionProperty): string | undefined {
  if ('title' in property) {
    return property.title.map((t) => t.plain_text).join('') || undefined;
  }

  if ('rich_text' in property) {
    return property.rich_text.map((t) => t.plain_text).join('') || undefined;
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
      database_id: NOTION_MAP_DATABASE_ID,
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
