import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { geocode } from '../utils/geocode';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MapStory from '../models/mapStory';

// run with: yarn sync:map
dotenv.config();

const { NOTION_MAP_TOKEN, NOTION_MAP_DATABASE_ID, MONGODB_URI } = process.env;
if (!NOTION_MAP_TOKEN || !NOTION_MAP_DATABASE_ID || !MONGODB_URI) {
  console.error(
    'syncMapStories: NOTION_MAP_TOKEN, NOTION_MAP_DATABASE_ID and MONGODB_URI must be set in .env'
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
          notionPageId: page.id
        };
      });

    stories.push(...pageStories);
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  } while (hasMore);

  let synced = 0;
  let skipped = 0;
  let removed = 0;
  let geocoded = 0;

  const existingStories = await MapStory.find({});
  const existingById = new Map(
    existingStories.map((existing) => [existing.notionPageId, existing])
  );

  for (const story of stories) {
    const existing = existingById.get(story.notionPageId);
    let lat: number | undefined;
    let long: number | undefined;

    if (
      existing &&
      existing.city === story.city &&
      existing.state === story.state &&
      typeof existing.lat === 'number' &&
      typeof existing.long === 'number'
    ) {
      // same place as last sync, so reuse the saved coordinates
      lat = existing.lat;
      long = existing.long;
    } else if (story.city && story.state) {
      // new story, moved, or missing coordinates
      const coords = await geocode(story.city, story.state);
      ++geocoded;
      if (coords) {
        lat = coords.lat;
        long = coords.long;
      } else {
        console.warn(
          `Could not geocode ${story.city}, ${story.state} for ${story.name}. Saving without coordinates.`
        );
      }
    }

    try {
      // validate before attempting to save
      const mapStory = new MapStory({ ...story, lat, long });
      await mapStory.validate();

      // if geocoding failed, clear any old coordinates so the next sync retries
      const update =
        lat !== undefined && long !== undefined
          ? { ...story, lat, long }
          : { ...story, $unset: { lat: 1, long: 1 } };

      // find existing story and updates information
      await MapStory.findOneAndUpdate(
        { notionPageId: story.notionPageId },
        update,
        { upsert: true, runValidators: true }
      );
      ++synced;
      console.log(`Saved story: ${story.name}`);
    } catch (error) {
      // handle error if save fails
      ++skipped;
      console.error(`Failed to save story: ${story.name}`, error);
    }
  }

  // deletes all mongoDB stories that don't have a notionID that is present in the Notion database.
  // If Notion returned nothing, skip this: it's more likely a misconfigured
  // database or filter than every story being taken down, and deleting would
  // wipe the whole map.
  if (stories.length === 0) {
    console.warn(
      'Notion returned 0 stories, so nothing was removed from MongoDB. Check NOTION_MAP_DATABASE_ID and the Approved/Display Publicly filter.'
    );
  } else {
    const notionPageIds = stories.map((story) => story.notionPageId);
    const deleteResult = await MapStory.deleteMany({
      notionPageId: { $nin: notionPageIds }
    });
    removed = deleteResult.deletedCount;
  }

  console.log(
    `Sync complete: synced ${synced}, skipped ${skipped}, removed ${removed}, geocoded ${geocoded}`
  );
}

async function main() {
  // ensures mongo connects before continuing
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // ensures sync process finishes before main finishes
  try {
    await sync();
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// handle sync errors
main().catch((error) => {
  console.error('Sync failed:', error);
  // non-zero exit code so whatever runs this (e.g. a cron job) can tell it failed
  process.exitCode = 1;
});
