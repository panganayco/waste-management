#!/usr/bin/env node

/**
 * Database initialization script
 * Run this script to set up the database schema
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../db/database');

async function initDatabase() {
  console.log('Starting database initialization...\n');

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');

    // Execute schema
    await pool.query(schema);

    console.log('\n✓ Database schema created successfully!');

    // Verify tables were created
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    const result = await pool.query(tablesQuery);

    console.log('\nCreated tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Verify views were created
    const viewsQuery = `
      SELECT table_name
      FROM information_schema.views
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    const viewsResult = await pool.query(viewsQuery);

    if (viewsResult.rows.length > 0) {
      console.log('\nCreated views:');
      viewsResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

    console.log('\n✓ Database initialization complete!\n');

  } catch (error) {
    console.error('\n✗ Database initialization failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initDatabase();
