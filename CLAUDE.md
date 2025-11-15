# CLAUDE.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working on this codebase.

## Project Overview

**Project Name:** Smart Waste Management Presentation
**Type:** Interactive Presentation Deck
**Purpose:** A professional pitch deck showcasing a smart waste management solution powered by IoT, AI, and cloud technologies
**Framework:** reveal.js v4.6.0
**Primary Language:** HTML/CSS/JavaScript

This is a presentation-focused repository, not a traditional web application. The primary deliverable is an interactive slide deck that can be viewed in a web browser or exported to PDF.

## Repository Structure

```
waste-management/
├── index.html          # Main presentation file (427 lines)
├── styles.css          # Custom styling and theming (411 lines)
├── package.json        # Node.js dependencies and scripts
├── README.md           # User-facing documentation
├── .gitignore          # Git ignore rules
└── CLAUDE.md           # This file - AI assistant guide
```

### File Responsibilities

**index.html** (Main Entry Point)
- Contains all presentation content organized into `<section>` elements
- Loads reveal.js framework from CDN
- Includes reveal.js configuration and initialization
- 17 main slide sections covering the full pitch deck
- Lines 1-13: HTML structure and CDN dependencies
- Lines 14-405: Slide content within `<div class="slides">`
- Lines 408-425: Reveal.js initialization script

**styles.css** (Custom Styling)
- Defines CSS custom properties/variables in `:root` (lines 3-8)
- Overrides reveal.js default styling
- Provides component-specific styles (grids, metrics, timelines, etc.)
- Includes responsive design breakpoints (@media queries)
- Contains print-specific styles for PDF export

**package.json** (Project Configuration)
- Defines npm scripts for local development servers
- Lists devDependencies (http-server, live-server)
- No runtime dependencies (all loaded via CDN)

## Technology Stack

### Core Technologies
- **Presentation Framework:** reveal.js 4.6.0 (loaded via CDN)
- **HTML:** Standard HTML5 with semantic elements
- **CSS:** CSS3 with custom properties, grid layouts, flexbox, animations
- **JavaScript:** Minimal vanilla JS (only reveal.js configuration)

### External Dependencies (CDN-based)
- `reveal.js` - Core presentation framework
- `reveal.js/dist/theme/black.css` - Base theme
- All dependencies loaded from `cdn.jsdelivr.net`

### Development Tools
- **http-server** - Simple HTTP server for local development
- **live-server** - Development server with live reload
- **Python HTTP server** - Alternative local server option

## Development Workflow

### Starting the Project

**Option 1: Direct Browser Access (Simplest)**
```bash
# Open index.html directly in a web browser
# No server needed for basic viewing
```

**Option 2: NPM Scripts (Recommended)**
```bash
npm install                  # Install dev dependencies
npm start                    # Starts http-server on port 8080
npm run serve               # Starts Python server on port 8000
npm run dev                 # Starts live-server with auto-reload
```

**Option 3: Manual Server**
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8080
```

### Testing Changes
1. Make edits to `index.html` or `styles.css`
2. Refresh browser to see changes (or use live-server for auto-reload)
3. Test across different browsers (Chrome, Firefox, Safari)
4. Test responsive design by resizing browser window
5. Test PDF export with `?print-pdf` URL parameter

### Navigation Controls (For Presentations)
- **Next/Previous:** Arrow keys, Space, Page Up/Down
- **Overview Mode:** ESC or O key
- **Fullscreen:** F key
- **Speaker Notes:** S key (if notes are added)
- **Zoom:** Alt + Click

## Code Organization & Conventions

### HTML Structure Patterns

**Slide Sections:**
```html
<section>
    <h2>Slide Title</h2>
    <p>Content goes here</p>
</section>
```

**Nested Slides (Vertical Navigation):**
```html
<section>
    <section>
        <h2>Parent Slide</h2>
    </section>
    <section>
        <h3>Child Slide</h3>
    </section>
</section>
```

**Background Colors/Gradients:**
```html
<section data-background-color="#10b981">
<section data-background-gradient="linear-gradient(to bottom, #1e3a8a, #10b981)">
```

**Speaker Notes (Optional):**
```html
<section>
    <h2>Slide Content</h2>
    <aside class="notes">
        These are speaker notes visible in presenter mode (S key)
    </aside>
</section>
```

### CSS Organization

**CSS Variables (`:root` in styles.css:3-8):**
```css
--primary-color: #10b981    /* Green - main brand color */
--secondary-color: #1e3a8a  /* Blue - secondary brand color */
--accent-color: #7c3aed     /* Purple - accent highlights */
--text-color: #ffffff       /* White - primary text */
```

**Component Classes:**
- `.grid-container` + `.grid-item` - 2-column responsive grids
- `.tech-stack` + `.tech-category` - Technology stack display
- `.metrics-grid` + `.metric` - 4-column metrics display
- `.timeline` + `.timeline-item` - Implementation roadmap
- `.business-model` + `.model-item` - Business model grid
- `.team-grid` + `.team-member` - Team member display
- `.cta-buttons` + `.cta-button` - Call-to-action buttons

**Responsive Breakpoint:** `@media (max-width: 768px)` at line 368

### Presentation Content Structure

The deck follows this narrative flow:
1. **Title & Problem** (slides 1-2) - Hook and problem statement
2. **Vision & Solution** (slides 3-4) - Mission and solution overview
3. **Features & Tech** (slides 5-6) - Detailed features and technology
4. **Impact & Validation** (slides 7-8) - Metrics and case study
5. **Implementation & Business** (slides 9-10) - Roadmap and business model
6. **Sustainability & Competition** (slides 11-12) - Differentiators
7. **Team & Financials** (slides 13-14) - Team and projections
8. **Investment & CTA** (slides 15-16) - Funding ask and next steps
9. **Thank You** (slide 17) - Contact information

## Key Conventions for AI Assistants

### When Making Changes

1. **Content Updates (index.html):**
   - Always preserve the `<section>` structure
   - Maintain data attributes (`data-background-*`)
   - Keep semantic HTML structure (h2, h3, h4 hierarchy)
   - Don't break the reveal.js initialization script (lines 408-425)
   - Test slide navigation after changes

2. **Styling Updates (styles.css):**
   - Use CSS custom properties for colors when possible
   - Maintain responsive design patterns
   - Preserve hover effects and transitions
   - Keep print styles intact for PDF export
   - Test across different viewport sizes

3. **Adding New Slides:**
   - Insert new `<section>` within `<div class="slides">`
   - Follow existing patterns for consistency
   - Consider the narrative flow and placement
   - Add appropriate background styling if needed
   - Update README.md if adding major sections

4. **Customizing Themes:**
   - Modify CSS variables in `:root` for color changes
   - Can change reveal.js theme by updating CDN link in index.html:8
   - Available themes: white, league, sky, beige, simple, serif, blood, night, moon, solarized

5. **Performance Considerations:**
   - Keep images optimized (currently using placeholders)
   - Avoid excessive animations that may lag
   - Test PDF export after major changes
   - Ensure CDN resources are accessible

### Common Tasks

**Add a new slide:**
```html
<section>
    <h2>New Slide Title</h2>
    <p>Your content here</p>
</section>
```

**Change brand colors:**
```css
/* In styles.css :root */
--primary-color: #YOUR_COLOR;
--secondary-color: #YOUR_COLOR;
```

**Add speaker notes:**
```html
<aside class="notes">
    Notes for the presenter
</aside>
```

**Export to PDF:**
1. Add `?print-pdf` to URL
2. Use browser Print function (Ctrl+P / Cmd+P)
3. Select "Save as PDF"
4. Set landscape orientation, no margins

### Don't Do This

- Don't remove reveal.js CDN links or initialization script
- Don't change the fundamental `<div class="reveal"><div class="slides">` structure
- Don't use large local images without optimization
- Don't add complex JavaScript that might conflict with reveal.js
- Don't break the responsive grid patterns
- Don't remove accessibility features (semantic HTML, proper heading hierarchy)

## Git Workflow

### Branch Strategy
- Development happens on feature branches starting with `claude/`
- Branch naming: `claude/claude-md-{session-id}`
- Always commit and push to the designated branch
- Never push directly to main/master without permission

### Commit Conventions
- Use clear, descriptive commit messages
- Focus on "why" rather than "what"
- Example: "Update investment slide with revised funding ask" vs "Changed slide 15"

### Testing Before Commits
1. Open `index.html` in browser and navigate through all slides
2. Check responsive design (resize window to mobile size)
3. Verify no console errors (open browser DevTools)
4. Test PDF export if content changed significantly
5. Validate HTML if structure was modified

## Debugging Tips

### Common Issues

**Slides not displaying:**
- Ensure viewing through a web server, not `file://` protocol
- Check browser console for CDN loading errors
- Verify reveal.js initialization script is intact

**Styling looks broken:**
- Check internet connection (CSS loaded from CDN)
- Verify custom styles.css is linked correctly
- Check for CSS syntax errors in custom styles

**PDF export issues:**
- Use Chrome/Chromium for best results
- Ensure `?print-pdf` parameter is in URL
- Check print settings (landscape, no margins, background graphics enabled)

**Responsive design not working:**
- Check @media query breakpoints in styles.css
- Test on actual devices, not just browser resize
- Verify viewport meta tag in HTML head

## Dependencies & Updates

### CDN Dependencies
All external dependencies are loaded from CDN (no local installation):
- reveal.js: v4.6.0
- Theme: black.css from reveal.js

### Updating Dependencies
If upgrading reveal.js version:
1. Update version number in CDN URLs (index.html:7-8)
2. Review reveal.js changelog for breaking changes
3. Test all slides and features thoroughly
4. Update this documentation with new version number

### Local Dependencies (package.json)
- `http-server`: ^14.1.1 - Development server
- `live-server`: ^1.2.2 - Development server with live reload

Update with: `npm update` or `npm install package@latest`

## Browser Support

**Fully Supported:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

**Testing Checklist:**
- [ ] Slide transitions work smoothly
- [ ] All content is visible and properly styled
- [ ] Navigation controls respond correctly
- [ ] Responsive design works on mobile
- [ ] PDF export generates correctly

## Additional Resources

- [reveal.js Documentation](https://revealjs.com/)
- [reveal.js GitHub](https://github.com/hakimel/reveal.js)
- Project README.md for user-facing instructions
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## Questions & Clarifications

When uncertain about changes, ask the user to clarify:
- Scope of content changes (which slides to modify)
- Desired visual style (colors, layouts, animations)
- Target audience impact (technical vs. business focus)
- Deployment method (web hosting vs. PDF distribution)
- Branding requirements (colors, fonts, imagery)

## Summary for AI Assistants

This is a **presentation deck**, not a web application. Focus on:
1. **Content clarity** - Ensure messages are clear and compelling
2. **Visual consistency** - Maintain design patterns and brand colors
3. **Navigation flow** - Preserve logical slide progression
4. **Responsive design** - Works on all devices
5. **PDF compatibility** - Export must work flawlessly

When editing, always test the presentation flow from start to finish. Every change should enhance the storytelling without breaking the technical functionality.

---

**Last Updated:** 2025-11-15
**Repository:** https://github.com/panganayco/waste-management
**For Questions:** Refer to README.md or ask the repository owner
