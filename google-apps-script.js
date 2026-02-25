/**
 * Google Apps Script — The Snow Collective Image Catalog
 *
 * SETUP:
 *   1. Go to https://script.google.com and create a new project
 *   2. Paste this entire file into the editor (replace the default code)
 *   3. Click Deploy > New deployment
 *   4. Type = "Web app"
 *   5. Execute as = "Me"
 *   6. Who has access = "Anyone"
 *   7. Click Deploy, authorize when prompted
 *   8. Copy the web app URL and paste it into catalog.js (APPS_SCRIPT_URL)
 *
 * FILE NAMING CONVENTION in Google Drive:
 *   "category - Item Name.jpg"
 *
 *   Examples:
 *     drawings - Monocle Bunny.jpg
 *     buttons - Wildflower Set.jpg
 *     paintings - Midnight Garden.jpg
 *     other - Something Cool.png
 *
 *   Valid categories: buttons, paintings, drawings, other
 *
 *   If no " - " separator is found, category defaults to "other"
 *   and the full filename (minus extension) becomes the display name.
 *
 * DESCRIPTIONS:
 *   Right-click a file in Google Drive > File information > Description
 *   Whatever you type there becomes the item description on the site.
 */

function doGet() {
  var FOLDER_ID = '1ytUvRa2GK9M9NeHw1LAwS03y43sB-t3K';

  var folder = DriveApp.getFolderById(FOLDER_ID);
  var files = folder.getFiles();
  var items = [];

  while (files.hasNext()) {
    var file = files.next();
    var mimeType = file.getMimeType();

    // Only include image files
    if (!mimeType.startsWith('image/')) continue;

    var name = file.getName();
    var description = file.getDescription() || '';
    var id = file.getId();

    // Strip file extension for display name
    var displayName = name.replace(/\.[^.]+$/, '');

    // Parse "category - Item Name" convention
    var category = 'other';
    var dashIndex = displayName.indexOf(' - ');
    if (dashIndex > -1) {
      category = displayName.substring(0, dashIndex).trim().toLowerCase();
      displayName = displayName.substring(dashIndex + 3).trim();
    }

    items.push({
      id: id,
      name: displayName,
      category: category,
      description: description,
      image: 'https://lh3.googleusercontent.com/d/' + id,
      status: 'available'
    });
  }

  // Sort alphabetically by name
  items.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  return ContentService
    .createTextOutput(JSON.stringify(items))
    .setMimeType(ContentService.MimeType.JSON);
}
