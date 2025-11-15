const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Validation helper
function validateRecipeData(data) {
  const errors = [];

  if (!data.sessionId) {
    errors.push('Session ID is required');
  }

  if (!data.constellationSelections || !Array.isArray(data.constellationSelections)) {
    errors.push('Constellation selections must be an array');
  }

  if (!data.ingredients || !Array.isArray(data.ingredients)) {
    errors.push('Ingredients must be an array');
  }

  if (data.ingredients && data.ingredients.length > 3) {
    errors.push('Maximum 3 ingredients allowed');
  }

  return errors;
}

// Create a new recipe
router.post('/', async (req, res, next) => {
  try {
    const recipeData = req.body;

    // Validate input
    const validationErrors = validateRecipeData(recipeData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Extract IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Insert recipe into database
    const query = `
      INSERT INTO recipes (
        session_id,
        constellation_selections,
        ingredients,
        method,
        vessel,
        sawsawan,
        summary,
        user_agent,
        ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (session_id)
      DO UPDATE SET
        constellation_selections = EXCLUDED.constellation_selections,
        ingredients = EXCLUDED.ingredients,
        method = EXCLUDED.method,
        vessel = EXCLUDED.vessel,
        sawsawan = EXCLUDED.sawsawan,
        summary = EXCLUDED.summary,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, session_id, created_at, updated_at
    `;

    const values = [
      recipeData.sessionId,
      JSON.stringify(recipeData.constellationSelections || []),
      JSON.stringify(recipeData.ingredients || []),
      JSON.stringify(recipeData.method || null),
      JSON.stringify(recipeData.vessel || null),
      JSON.stringify(recipeData.sawsawan || null),
      recipeData.summary || null,
      userAgent,
      ipAddress
    ];

    const result = await db.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Recipe saved successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error saving recipe:', error);
    next(error);
  }
});

// Get recipe by session ID
router.get('/session/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const query = `
      SELECT
        id,
        session_id,
        constellation_selections,
        ingredients,
        method,
        vessel,
        sawsawan,
        summary,
        created_at,
        updated_at
      FROM recipes
      WHERE session_id = $1
    `;

    const result = await db.query(query, [sessionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching recipe:', error);
    next(error);
  }
});

// Get recipe statistics
router.get('/stats', async (req, res, next) => {
  try {
    // Get total counts
    const totalQuery = `
      SELECT
        COUNT(*) as total_recipes,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM recipes
    `;
    const totalResult = await db.query(totalQuery);

    // Get ingredient popularity
    const ingredientQuery = `
      SELECT * FROM ingredient_popularity LIMIT 10
    `;
    const ingredientResult = await db.query(ingredientQuery);

    // Get method/vessel combinations
    const combinationQuery = `
      SELECT * FROM method_vessel_combinations LIMIT 10
    `;
    const combinationResult = await db.query(combinationQuery);

    // Get constellation point frequencies
    const constellationQuery = `
      SELECT
        constellation_data->>'id' as constellation_id,
        constellation_data->>'label' as constellation_label,
        COUNT(*) as usage_count
      FROM recipes,
      jsonb_array_elements(constellation_selections) as constellation_data
      WHERE constellation_selections IS NOT NULL
      GROUP BY constellation_id, constellation_label
      ORDER BY usage_count DESC
    `;
    const constellationResult = await db.query(constellationQuery);

    res.json({
      success: true,
      data: {
        totals: totalResult.rows[0],
        ingredientPopularity: ingredientResult.rows,
        methodVesselCombinations: combinationResult.rows,
        constellationFrequencies: constellationResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    next(error);
  }
});

// Get recent recipes (admin endpoint - should be protected in production)
router.get('/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const query = `
      SELECT
        id,
        session_id,
        constellation_selections,
        ingredients,
        method,
        vessel,
        sawsawan,
        summary,
        created_at
      FROM recipes
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(query, [limit, offset]);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit,
        offset,
        count: result.rows.length
      }
    });

  } catch (error) {
    console.error('Error fetching recent recipes:', error);
    next(error);
  }
});

module.exports = router;
