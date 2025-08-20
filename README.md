# AFZ Advocacy Application - Albinism Foundation Zambia

A professional, modern, and accessible web application designed to mirror the AFZ's mission of advocating for albinism rights in Zambia.

## 🎯 Project Overview

This application provides a comprehensive platform for the Albinism Foundation Zambia to:
- Advocate for the rights of individuals with albinism
- Promote awareness and education
- Build an inclusive community
- Provide support services and resources

## 🏗️ Architecture

The application is built using modern web technologies with a focus on accessibility, performance, and multilingual support:

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties (CSS Variables)
- **Accessibility**: WCAG 2.1 AA compliant
- **Languages**: English, Nyanja, Bemba
- **Responsive**: Mobile-first design approach

## 📁 Project Structure

```
afz-advocacy-app/
├── index.html              # Main homepage
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js            # JavaScript functionality
├── images/                 # Image assets (to be added)
│   ├── afz-logo.png       # AFZ logo (placeholder)
│   ├── hero-image.jpg     # Hero section image (placeholder)
│   ├── news-1.jpg         # News item 1 image (placeholder)
│   ├── news-2.jpg         # News item 2 image (placeholder)
│   ├── news-3.jpg         # News item 3 image (placeholder)
│   ├── favicon.ico        # Site favicon (placeholder)
│   └── apple-touch-icon.png # Apple touch icon (placeholder)
├── pages/
│   ├── contact.html       # Contact page
│   ├── about.html         # About page (to be created)
│   ├── programs.html      # Programs page (to be created)
│   ├── resources.html     # Resources page (to be created)
│   └── advocacy.html      # Advocacy page (to be created)
├── translations/
│   ├── en.json           # English translations
│   ├── ny.json           # Nyanja translations
│   └── be.json           # Bemba translations
└── README.md             # This documentation
```

## 🚀 Features

### ✅ Implemented Features

1. **Responsive Design**: Mobile-first approach with desktop scaling
2. **Accessibility**: WCAG 2.1 AA compliance with screen reader support
3. **Multilingual Support**: English, Nyanja, and Bemba language switching
4. **Modern UI**: Professional design with AFZ brand colors
5. **Interactive Elements**: Smooth animations, hover effects, and transitions
6. **Form Handling**: Contact form with validation and accessibility
7. **SEO Optimized**: Proper meta tags, semantic HTML, and structured data
8. **Performance**: Optimized CSS and JavaScript with lazy loading support

### 🎨 Design System

**Brand Colors:**
- Primary Blue: #2b6cb0 (AFZ brand color)
- Secondary Orange: #ed8936 (Call-to-action color)
- Neutral Grays: #f7fafc to #171923 (Content and backgrounds)

**Typography:**
- Font Family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Responsive font scaling
- High contrast ratios for accessibility

**Spacing System:**
- Consistent spacing using CSS custom properties
- Mobile-friendly touch targets (minimum 48px)

## 🔧 Setup Instructions

1. **Clone or Download** the project files to your web server
2. **Replace Placeholder Images** (see section below)
3. **Update Contact Information** (see section below)
4. **Configure Backend Integration** (see section below)
5. **Test Translations** and update as needed

## 📋 Next Steps & Requirements

### 🚨 Critical Replacements Needed

#### 1. Images
Replace the following placeholder images in the `/images/` directory:

- `afz-logo.png` - Official AFZ logo (recommended: 200x200px, transparent background)
- `hero-image.jpg` - Hero section image (recommended: 1200x600px, high quality)
- `news-1.jpg`, `news-2.jpg`, `news-3.jpg` - News article images (recommended: 400x200px each)
- `favicon.ico` - Site favicon (16x16, 32x32 sizes)
- `apple-touch-icon.png` - iOS home screen icon (180x180px)

#### 2. Contact Information
Update the following placeholders in HTML files and translations:

**In HTML files:**
- `[AFZ Office Address - To be replaced with actual address]`
- Phone: `+260 123 456 789` (placeholder number)
- Email: `info@afz.org.zm` (verify if correct)

**In translation files** (`/translations/*.json`):
- Update `"address"` field with actual office address
- Verify phone and email accuracy
- Review all translations for accuracy

#### 3. Content Updates
- Update statistics in mission section (currently shows 500+ members, 15+ programs, 8 provinces)
- Replace news items with actual AFZ news
- Add real social media links (currently placeholder "#" links)

### 🔗 Backend Integration Requirements

#### 1. Contact Form
The contact form (`pages/contact.html`) needs backend integration:

**Current Form Data:**
- Name (required)
- Email (required)
- Phone (optional)
- Subject (required - dropdown with predefined options)
- Message (required)
- Newsletter subscription (optional checkbox)

**Required Backend Endpoints:**
```
POST /api/contact
Content-Type: application/json

{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "optional phone",
  "subject": "support|volunteer|partnership|media|other",
  "message": "Message content",
  "newsletter": true|false
}

Expected Response:
{
  "success": true,
  "message": "Thank you for your message"
}
```

#### 2. Newsletter Subscription
If newsletter functionality is needed:

```
POST /api/newsletter
Content-Type: application/json

{
  "email": "email@example.com",
  "language": "en|ny|be"
}
```

#### 3. Analytics Integration
Consider adding:
- Google Analytics or similar
- Privacy-compliant tracking
- GDPR compliance measures

### 🌐 Translation Requirements

#### Current Translation Status:
- ✅ **English**: Complete
- ⚠️ **Nyanja**: Needs professional review
- ⚠️ **Bemba**: Needs professional review

#### Translation Review Needed:
The Nyanja and Bemba translations were created using general linguistic knowledge and should be reviewed by native speakers familiar with:
- AFZ's specific terminology
- Local cultural context
- Proper albinism advocacy language

#### Additional Translation Items:
Add translations for contact page elements not yet included:
- Contact form labels and validation messages
- Emergency contact section
- Office hours information
- Form submission success/error messages

### 📱 Additional Pages to Create

Using `pages/contact.html` as a template, create:

1. **About Page** (`pages/about.html`)
   - AFZ history and mission
   - Team member profiles
   - Organizational achievements
   - Partnership information

2. **Programs Page** (`pages/programs.html`)
   - Detailed program descriptions
   - Success stories
   - How to apply for services
   - Program impact statistics

3. **Resources Page** (`pages/resources.html`)
   - Educational materials
   - Downloadable resources
   - Links to external resources
   - Support guides

4. **Advocacy Page** (`pages/advocacy.html`)
   - Current campaigns
   - Policy positions
   - How to get involved in advocacy
   - Legislative updates

### 🔒 Security Considerations

#### Form Security:
- Implement CSRF protection
- Add rate limiting to prevent spam
- Validate and sanitize all inputs
- Use HTTPS for all form submissions

#### Content Security:
- Implement Content Security Policy (CSP)
- Add proper CORS headers
- Validate file uploads if implemented
- Regular security updates

### 📈 Performance Optimizations

#### Immediate Improvements:
1. **Image Optimization**: Compress all images and use modern formats (WebP with fallbacks)
2. **CDN**: Consider using a CDN for static assets
3. **Caching**: Implement proper browser caching headers
4. **Minification**: Minify CSS and JavaScript for production

#### Advanced Optimizations:
1. **Service Worker**: For offline functionality
2. **Critical CSS**: Inline critical CSS for faster rendering
3. **Image Lazy Loading**: Already implemented in HTML
4. **Font Optimization**: Consider web font optimization

### 🧪 Testing Requirements

#### Accessibility Testing:
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing
- Color contrast validation
- WCAG 2.1 AA compliance audit

#### Cross-Browser Testing:
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11 (if required)

#### Device Testing:
- Various screen sizes (320px to 1920px+)
- Touch device functionality
- Print styles verification

### 🚀 Deployment Checklist

#### Pre-Deployment:
- [ ] Replace all placeholder images
- [ ] Update contact information
- [ ] Review and finalize translations
- [ ] Configure backend endpoints
- [ ] Set up domain and hosting
- [ ] Configure SSL certificate
- [ ] Set up Google Analytics (if desired)

#### Post-Deployment:
- [ ] Submit to search engines
- [ ] Set up monitoring and analytics
- [ ] Create backup procedures
- [ ] Plan content update workflow
- [ ] Train team on content management

### 📞 Support and Maintenance

#### Content Updates:
The application is designed for easy content updates:
- News items can be updated in `index.html`
- Contact information centralized in translation files
- Statistics can be updated in the mission section

#### Code Maintenance:
- Regular dependency updates
- Security patch applications
- Performance monitoring
- Browser compatibility updates

## 🤝 Additional Feature Suggestions

### Phase 2 Enhancements:
1. **Content Management System**: WordPress, Strapi, or custom CMS
2. **Event Calendar**: For AFZ events and meetings
3. **Member Portal**: For members to access resources
4. **Donation Integration**: PayPal, Stripe, or local payment systems
5. **Blog/News System**: Dynamic news and article management
6. **Search Functionality**: Site-wide search capability
7. **Social Media Integration**: Live social media feeds
8. **Multi-media Gallery**: Photo and video galleries
9. **Document Library**: Downloadable resources and reports
10. **Interactive Maps**: Office locations and service areas

## 📊 Analytics and Insights

Consider tracking:
- Page views and user engagement
- Contact form submissions
- Language preferences
- Geographic distribution of visitors
- Accessibility feature usage
- Mobile vs. desktop usage

## 🌍 Internationalization Notes

The current implementation supports:
- Left-to-right text direction
- Dynamic language switching
- Localized content
- Cultural appropriate imagery (to be implemented)

For future expansion, consider:
- Additional African languages
- Regional customizations
- Cultural adaptations
- Local currency support (for donations)

---

## 📝 Final Notes

This application provides a solid foundation for AFZ's digital advocacy efforts. The focus on accessibility, multilingual support, and modern design ensures the platform can effectively serve the diverse community of individuals with albinism in Zambia.

For technical support or questions about implementation, please refer to the code comments or contact the development team.

**Built with accessibility, inclusion, and advocacy in mind. 🤝**
