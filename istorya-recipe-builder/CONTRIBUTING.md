# Contributing to Istorya Recipe Builder

Thank you for considering contributing to the Istorya Recipe Builder! This document provides guidelines and information for contributors.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive experience for everyone, regardless of background, identity, or experience level.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
1. Check existing issues to avoid duplicates
2. Collect relevant information (OS, Node version, browser, etc.)
3. Try to isolate the problem

**Bug Report Template:**
```markdown
**Description**
A clear description of the bug

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g., macOS 12.0]
- Node Version: [e.g., 18.0.0]
- Browser: [e.g., Chrome 120]
- Database: [e.g., PostgreSQL 14]

**Additional Context**
Any other relevant information
```

### Suggesting Enhancements

**Enhancement Suggestion Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
A clear description of what you want to happen

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Any other context, mockups, or examples
```

### Code Contributions

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Your Changes**
4. **Test Your Changes**
5. **Commit Your Changes**
6. **Push to Your Fork**
7. **Open a Pull Request**

## Development Setup

### Prerequisites
- Node.js 14+
- PostgreSQL 12+
- Git

### Setup Steps

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/istorya-recipe-builder.git
   cd istorya-recipe-builder
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

4. **Create Database**
   ```bash
   createdb istorya_recipes_dev
   ```

5. **Initialize Database**
   ```bash
   npm run init-db
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

### Project Structure

```
istorya-recipe-builder/
├── public/              # Frontend files
│   ├── index.html      # Main HTML
│   ├── styles.css      # Styles
│   ├── config.js       # Configuration
│   ├── data.js         # Recipe data
│   └── app.js          # Main logic
├── server/             # Backend files
│   ├── index.js        # Express server
│   ├── db/             # Database
│   ├── routes/         # API routes
│   └── scripts/        # Utility scripts
├── tests/              # Test files (coming soon)
└── docs/               # Additional documentation
```

## Coding Standards

### JavaScript Style Guide

We follow a consistent coding style:

```javascript
// Use ES6+ features
const myFunction = (param) => {
  // Use camelCase for variables and functions
  const myVariable = 'value';

  // Use PascalCase for classes
  class MyClass {
    constructor() {
      this.property = value;
    }
  }

  // Use meaningful names
  const getUserRecipes = () => { /* ... */ };

  // Add comments for complex logic
  // This calculates the recipe complexity score
  const calculateScore = (recipe) => {
    // Implementation
  };
};

// Use async/await over promises
async function fetchData() {
  try {
    const result = await getData();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### CSS Style Guide

```css
/* Use BEM-like naming convention */
.block-name__element-name--modifier {
  /* Properties in alphabetical order */
  background: #color;
  display: flex;
  margin: 0;
  padding: 10px;
}

/* Use CSS custom properties for theming */
:root {
  --primary-color: #f97316;
  --spacing-unit: 8px;
}

/* Mobile-first responsive design */
.element {
  width: 100%;
}

@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}
```

### SQL Style Guide

```sql
-- Use UPPERCASE for SQL keywords
-- Use lowercase for table/column names
SELECT
  id,
  session_id,
  created_at
FROM recipes
WHERE constellation_selections IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- Add comments for complex queries
-- Calculate ingredient usage percentage
SELECT
  ingredient_id,
  COUNT(*) * 100.0 / (SELECT COUNT(*) FROM recipes) as percentage
FROM recipe_ingredients
GROUP BY ingredient_id;
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(recipe): add recipe sharing functionality

Implement sharing recipes via unique URLs.
Users can now generate shareable links for their recipes.

Closes #123
```

```
fix(database): resolve connection pool exhaustion

Update pool configuration to prevent connection leaks.
Increased max pool size and added better error handling.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Update Documentation**
   - Update README.md if needed
   - Add JSDoc comments to new functions
   - Update CHANGELOG.md

2. **Test Your Changes**
   - Test manually in browser
   - Verify database migrations work
   - Check responsive design
   - Test accessibility features

3. **Code Quality**
   - Remove console.logs
   - Remove commented-out code
   - Ensure no linting errors
   - Check for security issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested in multiple browsers
- [ ] Tested responsive design
- [ ] Tested accessibility

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] CHANGELOG.md updated

## Screenshots (if applicable)

## Related Issues
Closes #(issue number)
```

### Review Process

1. At least one maintainer must review
2. All CI checks must pass
3. No merge conflicts
4. Documentation updated
5. CHANGELOG updated

## Testing

### Manual Testing

Test checklist for UI changes:
- [ ] Desktop browsers (Chrome, Firefox, Safari)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Works with reduced motion
- [ ] Works with high contrast mode

### API Testing

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test recipe creation
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d @test-recipe.json

# Test statistics
curl http://localhost:3000/api/recipes/stats
```

### Database Testing

```sql
-- Verify schema
\dt

-- Check data integrity
SELECT COUNT(*) FROM recipes;
SELECT COUNT(*) FROM analytics_events;

-- Test views
SELECT * FROM ingredient_popularity;
```

## Documentation

### Code Documentation

Use JSDoc for JavaScript:

```javascript
/**
 * Creates a new recipe in the database
 * @param {Object} recipeData - The recipe data
 * @param {string} recipeData.sessionId - Unique session identifier
 * @param {Array} recipeData.ingredients - Selected ingredients
 * @returns {Promise<Object>} The created recipe
 * @throws {ValidationError} If recipe data is invalid
 */
async function createRecipe(recipeData) {
  // Implementation
}
```

### API Documentation

When adding new endpoints, update README.md:

```markdown
#### Get Recipe by ID
```
GET /api/recipes/:id
```

**Parameters:**
- `id` (string): Recipe UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "sessionId": "...",
    "ingredients": [...]
  }
}
```
```

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- GitHub contributors page

## Questions?

- Open an issue with the `question` label
- Check existing documentation
- Review closed issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Istorya Recipe Builder! 🎉
