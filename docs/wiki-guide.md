# Wiki Guide

Creatorsgarten uses a sophisticated wiki-driven content management system where content, templates, and configuration are all stored and managed through the wiki itself.

## Wiki Architecture Overview

The wiki system is powered by [Contentsgarten](https://contentsgarten.netlify.app/wiki/MainPage), a headless wiki engine that uses a GitHub repository as data storage ([creatorsgarten/wiki](https://github.com/creatorsgarten/wiki)). This creates a unique architecture where:

- **Content** (events, people, documentation) is stored in wiki pages
- **Templates** (reusable components) are stored in wiki pages  
- **Configuration** (site settings, feature flags) is stored in wiki pages
- **Everything is version controlled** via Git
- **Community members can edit** content without touching the codebase

## Environment Access

### Development Environment
- **URL**: `http://localhost:5173/` (when development server is running)
- **Setup**: Run `pnpm dev` in the main repository
- **Use case**: Local development and testing

### Production Environment  
- **URL**: `https://creatorsgarten.org/`
- **Use case**: When development server is unavailable or for live editing

## Getting Editing Permissions

To edit wiki content, you need:

1. **Creatorsgarten account**: Sign in at `/auth/login`
2. **Connected GitHub account**: Link your GitHub at `/dashboard/profile` 
3. **Creators team membership**: Join the "creators" team in the [Creatorsgarten GitHub organization](https://github.com/creatorsgarten)

If you lack permissions, the editor pages will display the requirements and provide appropriate links to complete the setup.

## Content Types & Editor URLs

### Events
- **Pattern**: `/wiki/Events/[eventname]/editor`
- **Example**: `/wiki/Events/aliens/editor` 
- **Usage**: Create and edit event pages with details, schedules, and metadata

### People Profiles
- **Pattern**: `/wiki/People/[username]/editor`
- **Example**: `/wiki/People/dtinth/editor`
- **Usage**: Manage member profiles with social links and contributions

### Templates
- **Pattern**: `/wiki/Template/[templatename]/editor` 
- **Example**: `/wiki/Template/EventBox/editor`
- **Browse all**: `/wiki/Template`
- **Usage**: Create and modify reusable components used across the wiki

### Site Configuration
- **Location**: `/wiki/WebsiteConfig/editor`
- **Usage**: Control feature flags, recurring events, guild listings, service integrations, and site-wide announcements

### General Pages
- **Pattern**: `/wiki/[pagename]/editor`
- **Usage**: Any other wiki content (documentation, guides, etc.)

## Wiki File Structure

All wiki pages use a consistent structure with YAML front matter followed by Markdown content:

```yaml
---
# Structured metadata (YAML)
image: https://usercontent.creatorsgarten.org/c/v1746235035/644e5254802c0234580bdb52/image.webp
event:
  name: "Event Name"
  date: "2025-05-18"
  location: "Venue Name"
  site: "https://eventpop.me/e/12345"
  hosts:
    - Creatorsgarten
  leads:
    - username
---

# Markdown content starts here

:::lead
Introduction text in a special lead section
:::

Regular markdown content with template includes:
{% render 'EventBox', name: ref %}
{% render 'EventpopButton', id: page.event.eventpopId %}

## Schedule
Content continues...
```

### Key Structure Elements

- **YAML Front Matter**: Structured data that templates and the site can process
- **Markdown Content**: Human-readable content with rich formatting
- **Template Includes**: Dynamic components using `{% render %}` syntax
- **Special Directives**: Like `:::lead` for styled content sections

## Template System

The wiki includes a powerful template system for reusable components:

### Available Templates

Browse the complete list at `/wiki/Template`. Common templates include:

- **`Event`**: Event links with icons → `{% render 'Event', name: 'eventname' %}`
- **`EventBox`**: Event navigation with related links → `{% render 'EventBox', name: ref %}`
- **`EventpopButton`**: Ticket purchase buttons → `{% render 'EventpopButton', id: page.event.eventpopId %}`
- **`Person`**: Person profile links → `{% render 'Person', name: 'username' %}`
- **`YouTube`**: Embedded videos → `{% render 'YouTube', id: 'video_id' %}`

### Template Usage Syntax

Templates use Liquid syntax:
```liquid
{% render 'TemplateName', param1: value1, param2: value2 %}
```

### Template Development

Templates themselves are wiki pages that can be edited:
- **Location**: `/wiki/Template/[name]/editor`
- **Language**: Liquid template engine with HTML/CSS
- **Features**: Can query wiki data, include conditional logic, reference other templates

## Site Configuration Management

The `WebsiteConfig` page controls key site behaviors:

### Feature Flags
Enable/disable site features:
```yaml
featureFlags:
  deviceAuthorization: true
  newFeature: false
```

### Recurring Events
Define events shown on the events page:
```yaml
events:
  recurring:
    - name: "Event Name"
      schedule: "When it happens" 
      url: "/wiki/EventPage"
```

### Announcements
Site-wide banners with time-based display logic:
```yaml
announcements:
  current:
    enabled: true
    message: "Current event happening now!"
    link: "/wiki/CurrentEvent"
    start: "2025-01-01T00:00:00+07:00"
    end: "2025-01-02T00:00:00+07:00"
```

### Configuration Caching
- **Cache duration**: Up to 1 minute
- **Impact**: Changes may take up to 1 minute to appear on the live site
- **Planning**: Consider timing when making time-sensitive changes

## Asset Management

### Images and Files
- **Upload location**: `/dashboard/upload` (requires login)
- **CDN**: All assets served from `usercontent.creatorsgarten.org`
- **Usage**: Copy the provided URL into wiki page front matter or content

### Profile Pictures
1. Upload image via `/dashboard/upload`
2. Copy the `usercontent.creatorsgarten.org` URL
3. Add to profile front matter: `image: https://usercontent.creatorsgarten.org/c/v.../image.webp`

## Content Creation Workflows

### Creating a New Event
1. Navigate to `/wiki/Events/[event-slug]/editor` (creates new page)
2. Fill in the YAML front matter with event details
3. Add markdown content with schedule, description, etc.
4. Include templates like `{% render 'EventBox', name: ref %}`
5. Save the page

### Adding a Person Profile  
1. Go to `/wiki/People/[username]/editor`
2. Set up front matter with name, social links, profile picture
3. Add bio and contributed events in markdown
4. Use `{% render 'Event', name: 'eventname' %}` to link events

### Modifying Site Configuration
1. Access `/wiki/WebsiteConfig/editor`
2. Update the relevant YAML section (feature flags, events, etc.)
3. Remember changes may take up to 1 minute to propagate

## Best Practices

### Content Guidelines
- **Use relative URLs**: Start with `/` for internal links
- **Consistent naming**: Use clear, descriptive page names and slugs
- **Image optimization**: Upload appropriately sized images
- **Multilingual support**: Mix Thai and English content naturally

### Template Usage
- **Check existing templates**: Browse `/wiki/Template` before creating new ones
- **Parameter documentation**: Include usage examples in template pages
- **Template testing**: Test template changes on a few pages before widespread use

### Configuration Management
- **Test changes**: Verify configuration changes in development when possible
- **Timing considerations**: Account for 1-minute caching delay for time-sensitive changes
- **Backup awareness**: All changes are in Git, so previous versions can be restored

## Troubleshooting

### Permission Issues
- Verify login status and GitHub connection at `/dashboard/profile`
- Check creators team membership in GitHub organization
- Editor pages will show specific requirements if permissions are missing

### Template Errors
- Check syntax in template includes: `{% render 'Name', param: value %}`
- Verify template exists at `/wiki/Template/TemplateName`
- Review template parameters and expected data structure

### Configuration Not Updating
- Wait up to 1 minute for cache to refresh
- Check YAML syntax in WebsiteConfig for errors
- Verify the configuration section matches expected structure

For additional help, check the [GitHub Discussions](https://github.com/orgs/creatorsgarten/discussions) or ask in the community Discord.