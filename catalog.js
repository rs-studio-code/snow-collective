/**
 * The Snow Collective — Dynamic Catalog
 *
 * Loads inventory from Google Drive via a Google Apps Script web app.
 * Falls back to inventory.json if the Apps Script URL is not configured.
 *
 * To add new items:
 *   1. Upload the image to the Google Drive folder
 *   2. Name it: "category - Item Name.jpg" (e.g. "drawings - Monocle Bunny.jpg")
 *   3. Optionally add a description via Drive > right-click > File information > Description
 *   4. The site picks it up automatically — no code changes needed
 */

(function () {
  'use strict';

  // ─── CONFIGURATION ────────────────────────────────────────
  // Paste your deployed Google Apps Script web app URL here.
  // Leave empty to fall back to inventory.json.
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmVURyw-p0dZtyV1qZetmkn6OfTryrOnYRe1U7gKENbdtNl1jABTtGBBZ0AgShSp4C/exec';
  // ──────────────────────────────────────────────────────────

  var grid = document.getElementById('catalog-grid');
  var filterButtons = document.querySelectorAll('.filter-btn');
  var inventory = [];

  // Decide which source to fetch from
  var dataUrl = APPS_SCRIPT_URL || 'inventory.json';

  fetch(dataUrl)
    .then(function (res) {
      if (!res.ok) throw new Error('Could not load inventory');
      return res.json();
    })
    .then(function (data) {
      inventory = data;
      render('all');
    })
    .catch(function () {
      grid.innerHTML =
        '<p class="catalog-empty">Could not load the collection. Please try again later.</p>';
    });

  // Render items, optionally filtered by category
  function render(filter) {
    var items =
      filter === 'all'
        ? inventory
        : inventory.filter(function (item) {
            return item.category === filter;
          });

    if (items.length === 0) {
      grid.innerHTML =
        '<p class="catalog-empty">Nothing here yet — check back soon!</p>';
      return;
    }

    grid.innerHTML = items
      .map(function (item) {
        var statusClass = item.status === 'sold' ? ' sold' : '';
        var statusLabel = item.status === 'sold' ? 'Sold' : 'Available';
        var escapedName = item.name.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        var descHtml = item.description
          ? '<p class="item-description">' + item.description + '</p>'
          : '';

        return (
          '<div class="catalog-item" data-category="' + item.category + '">' +
            '<img class="item-image" src="' + item.image + '" alt="' + escapedName + '"' +
              ' onerror="this.outerHTML=\'<div class=\\\'placeholder-img\\\'>' + escapedName + '</div>\'" referrerpolicy="no-referrer">' +
            '<div class="item-info">' +
              '<div class="item-category">' + item.category + '</div>' +
              '<div class="item-name">' + item.name + '</div>' +
              descHtml +
              '<span class="item-status' + statusClass + '">' + statusLabel + '</span>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  // Filter buttons
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      render(btn.getAttribute('data-filter'));
    });
  });
})();
