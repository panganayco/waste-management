const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Track analytics event
router.post('/events', async (req, res, next) => {
  try {
    const {
      sessionId,
      eventType,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      eventData
    } = req.body;

    // Basic validation
    if (!sessionId || !eventType) {
      return res.status(400).json({
        error: 'Session ID and event type are required'
      });
    }

    // Extract metadata
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Insert event
    const query = `
      INSERT INTO analytics_events (
        session_id,
        event_type,
        event_category,
        event_action,
        event_label,
        event_value,
        event_data,
        user_agent,
        ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at
    `;

    const values = [
      sessionId,
      eventType,
      eventCategory || null,
      eventAction || null,
      eventLabel || null,
      eventValue || null,
      JSON.stringify(eventData || {}),
      userAgent,
      ipAddress
    ];

    const result = await db.query(query, values);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error tracking event:', error);
    next(error);
  }
});

// Get analytics summary
router.get('/summary', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;

    // Get event counts by type
    const eventTypesQuery = `
      SELECT
        event_type,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY event_type
      ORDER BY count DESC
    `;
    const eventTypesResult = await db.query(eventTypesQuery);

    // Get daily event counts
    const dailyQuery = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as event_count,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    const dailyResult = await db.query(dailyQuery);

    // Get most common event actions
    const actionsQuery = `
      SELECT
        event_category,
        event_action,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '${days} days'
        AND event_action IS NOT NULL
      GROUP BY event_category, event_action
      ORDER BY count DESC
      LIMIT 20
    `;
    const actionsResult = await db.query(actionsQuery);

    res.json({
      success: true,
      data: {
        eventTypes: eventTypesResult.rows,
        dailyStats: dailyResult.rows,
        topActions: actionsResult.rows,
        period: {
          days,
          from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    next(error);
  }
});

module.exports = router;
