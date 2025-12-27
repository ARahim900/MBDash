# Muscat Bay Design System

## Color Palette

### Primary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Primary** | `#5f5168` | Main UI elements, headers, sidebars, primary buttons. Derived from the Muscat Bay logo (Deep Muted Purple). |
| **Secondary** | `#A8D5E3` | Accents, highlights, secondary buttons, borders. Derived from the Muscat Bay logo (Soft Teal/Aqua). |

### Functional Colors
| Role | Hex Code | Description |
|------|----------|-------------|
| **Success** | `#10B981` | Positive actions, completion status, trends up. |
| **Warning** | `#F59E0B` | Cautionary messages, pending states, alerts. |
| **Danger** | `#EF4444` | Error messages, destructive actions, negative trends. |
| **Info/Disabled** | `#6B7280` | Secondary text, disabled states, neutral info. |
| **Water** | `#3B82F6` | Specific to water analysis module. |

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, Primary Color
- **Body**: Regular, Gray-800 for high contrast

### Accessibility Compliance (WCAG AA)
- **Primary Background**: White text on `#5f5168` passes AA (Contrast 6.3:1).
- **Secondary Background**: Dark text on `#A8D5E3` passes AA.
- **Text Contrast**: All body text uses dark grays (`#1f2937`) on white backgrounds for high readability.

## Components

### Sidebar
- Background: Primary Color (`#5f5168`)
- Text: White (`#ffffff`)
- Active Item: Lighter Primary or Secondary accent

### Buttons
- **Primary**: Background `#5f5168`, Text White. Hover `#6f6178`.
- **Secondary**: Background `#A8D5E3`, Text Dark. Hover `#B8E5F3`.
- **Destructive**: Background `#EF4444`, Text White.

### Cards
- Background: White
- Border: Light Gray or transparent
- Shadow: Soft shadow for depth
