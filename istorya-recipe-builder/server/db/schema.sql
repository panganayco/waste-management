-- Istorya Recipe Builder Database Schema

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Recipe data
    constellation_selections JSONB,
    ingredients JSONB,
    method JSONB,
    vessel JSONB,
    sawsawan JSONB,
    summary TEXT,

    -- Metadata
    user_agent TEXT,
    ip_address INET,

    -- Indexes for faster queries
    CONSTRAINT unique_session UNIQUE(session_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_session_id ON recipes(session_id);
CREATE INDEX IF NOT EXISTS idx_recipes_constellation ON recipes USING GIN (constellation_selections);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients ON recipes USING GIN (ingredients);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100),
    event_action VARCHAR(100),
    event_label VARCHAR(255),
    event_value INTEGER,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Metadata
    user_agent TEXT,
    ip_address INET
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for recipe statistics
CREATE OR REPLACE VIEW recipe_statistics AS
SELECT
    COUNT(*) as total_recipes,
    COUNT(DISTINCT session_id) as unique_sessions,
    DATE_TRUNC('day', created_at) as day,
    jsonb_object_agg(
        constellation_key,
        constellation_count
    ) as constellation_frequencies
FROM (
    SELECT
        created_at,
        session_id,
        jsonb_array_elements(constellation_selections)->>'id' as constellation_key,
        COUNT(*) as constellation_count
    FROM recipes
    WHERE constellation_selections IS NOT NULL
    GROUP BY created_at, session_id, constellation_key
) as subquery
GROUP BY day
ORDER BY day DESC;

-- View for ingredient popularity
CREATE OR REPLACE VIEW ingredient_popularity AS
SELECT
    ingredient_data->>'id' as ingredient_id,
    ingredient_data->>'name' as ingredient_name,
    ingredient_data->>'emoji' as ingredient_emoji,
    COUNT(*) as usage_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM recipes WHERE ingredients IS NOT NULL), 2) as usage_percentage
FROM recipes,
jsonb_array_elements(ingredients) as ingredient_data
WHERE ingredients IS NOT NULL
GROUP BY ingredient_id, ingredient_name, ingredient_emoji
ORDER BY usage_count DESC;

-- View for method and vessel combinations
CREATE OR REPLACE VIEW method_vessel_combinations AS
SELECT
    method->>'id' as method_id,
    method->>'label' as method_label,
    vessel->>'id' as vessel_id,
    vessel->>'label' as vessel_label,
    COUNT(*) as combination_count
FROM recipes
WHERE method IS NOT NULL AND vessel IS NOT NULL
GROUP BY method_id, method_label, vessel_id, vessel_label
ORDER BY combination_count DESC;

-- Comments for documentation
COMMENT ON TABLE recipes IS 'Stores completed Istorya recipes from users';
COMMENT ON TABLE analytics_events IS 'Stores analytics events for tracking user interactions';
COMMENT ON COLUMN recipes.constellation_selections IS 'JSONB array of selected constellation points';
COMMENT ON COLUMN recipes.ingredients IS 'JSONB array of selected ingredients';
COMMENT ON COLUMN recipes.method IS 'JSONB object containing the selected cooking method';
COMMENT ON COLUMN recipes.vessel IS 'JSONB object containing the selected cooking vessel';
COMMENT ON COLUMN recipes.sawsawan IS 'JSONB object containing the selected sawsawan (agency layer)';
