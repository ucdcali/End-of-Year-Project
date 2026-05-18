# School Cafeteria Menu Application - Refactoring Summary

## Overview
This document outlines the refactoring of the school cafeteria menu application to implement a user-friendly workflow for viewing daily and monthly menus.

## Key Features Implemented

### 1. **User Workflow**
- **Home Page (/)**: Displays today's meal from the monthly menu
  - Shows meal title, image, description, and dietary information
  - Displays a friendly message if no meal is scheduled for today
  - Button to view the full monthly menu

- **Monthly Menu (/menu)**: Displays all meals scheduled for the selected month
  - Organized by date
  - Clickable meal cards that link to meal details
  - Easy to browse through the entire month's schedule

- **Meal Detail (/meals/:id)**: Shows detailed information about a specific meal
  - Full meal description
  - Dietary restriction tags
  - Links to return to menu or home page

### 2. **Admin Panel (/admin)**
- Create new meal items with:
  - Title
  - Description (NEW)
  - Image URL
  - Dietary restrictions (Vegan, Vegetarian, Gluten-Free, Dairy-Free, Nut-Free)
  
- View all existing meals in a table format
- Edit meals
- Delete meals
- Create/manage monthly menus (in progress)

## Architecture Changes

### Routes (routes/routes.js)
- **Fixed typos**: Corrected route path from `'meals/:id'` to `'/meals/:id'`
- **Student Routes**:
  - `GET /` - Home page with today's meal
  - `GET /menu` - Display monthly menu
  - `GET /meals/:id` - Display meal details
- **Admin Routes**:
  - `GET /admin` - Admin dashboard
  - `POST /admin/createMeal` - Create new meal
  - `GET /meals/edit/:id` - Edit meal form
  - `POST /meals/edit/:id` - Save meal edits
  - `POST /meals/delete/:id` - Delete meal
  - `POST /admin/createMenu` - Create monthly menu

### Models
**Meal.js**
- Added `description` field for meal details
- Fields: title, description, diet (array), img (image URL)

**Menu.js** (unchanged)
- Fields: meals (array of menuMeal objects), month, year
- Each meal entry has a date and reference to a Meal object

### Controllers

**mealController.js**
- `homePage()`: Fetches today's meal from the menu and displays it
  - Handles "no meal today" scenario gracefully
  - Uses `.populate()` to fetch full meal data
- `createMeal()`: Now includes description field
- `displayMealDetail()`: Renamed from `meal()`, displays full meal details
- `editMeal()`: Allows editing meal information
- `saveEdits()`: Now includes description field
- `deleteMeal()`: Removes meals from database
- `adminPage()`: Shows admin dashboard

**menuController.js**
- `displayMonthlyMenu()`: Fetches and renders the monthly menu
  - Accepts month and year as query parameters
  - Groups meals by date for organized display
  - Handles missing menus gracefully
- `createMenu()`: Creates or updates monthly menus
  - Prevents duplicate month/year combinations

### Views

**navbar.ejs** (NEW)
- Shared navigation bar across all pages
- Links to: Home, Monthly Menu, Admin Panel
- Consistent branding: "School Cafeteria Menu"

**index.ejs** (Home)
- Displays today's meal
- Shows "No meal scheduled" message if needed
- Shows meal title, image, description, and dietary info
- Button to view full monthly menu

**menu.ejs** (Monthly Menu)
- Displays all meals organized by date
- Clickable meal cards with images and dietary tags
- Groups meals by date for easy browsing
- Shows "No menu available" message if applicable

**displayMeal.ejs** (Meal Detail)
- Full meal information page
- Title, image, detailed description
- Dietary information with icons
- Navigation back to menu or home

**admin.ejs** (Admin Dashboard)
- Section for creating new meals
- Table of all existing meals
- Edit and delete buttons for each meal
- Form for creating monthly menus
- Improved UI with form groups and buttons

**edit.ejs** (Edit Meal)
- Form to edit meal information
- Pre-populated fields with current values
- Dietary checkboxes show current selections
- Cancel button to return without changes

### Styles (public/styles.css)
- Comprehensive CSS overhaul with:
  - Modern color scheme (blues, grays)
  - Responsive grid layout
  - Hover effects and transitions
  - Navbar styling
  - Button variants (primary, secondary, danger, info)
  - Form styling with focus states
  - Meal card design
  - Mobile-responsive media queries
  - Admin table styling

## Workflow Example

### Student User Flow
1. User visits `/` (home page)
2. Sees today's meal with details and dietary info
3. Clicks "View Full Monthly Menu" button
4. Navigates to `/menu` showing all meals for the month
5. Clicks on a meal card to see full details at `/meals/{mealId}`
6. Can navigate back to menu or home from detail page

### Admin Workflow
1. Visit `/admin` dashboard
2. Create a new meal by filling out the form and clicking "Create Meal"
3. View all meals in the table below
4. Click "Edit" to modify meal details
5. Click "Delete" to remove a meal
6. Create a monthly menu by selecting month/year and assigning meals to dates

## Database Structure

### Meal Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  diet: [String], // e.g., ['V', 'GF']
  img: String     // URL to image
}
```

### Menu Collection
```javascript
{
  _id: ObjectId,
  month: String,  // e.g., 'may'
  year: String,   // e.g., '2026'
  meals: [
    {
      _id: ObjectId,
      date: Date,
      meal: ObjectId // Reference to Meal
    }
  ]
}
```

## Next Steps / In Progress

1. **Monthly Menu Form Enhancement**: The menu creation form needs JavaScript to:
   - Generate form fields for each day of the selected month
   - Allow selecting meals for each day
   - Submit properly formatted data to the backend

2. **Date Handling**: Ensure dates are properly formatted in the database
   - Currently using JavaScript Date objects
   - May need to adjust timezone handling

3. **Additional Features to Consider**:
   - Search/filter meals
   - Nutritional information
   - Meal ratings/reviews
   - Multiple meal times per day (breakfast, lunch, dinner)
   - Semester/week planning view
   - PDF menu export

4. **Testing**: 
   - Test the complete user flow
   - Verify date matching for today's meal
   - Test with multiple months of data

## API Endpoints Summary

| Method | Path | Purpose |
|--------|------|---------|
| GET | / | Home page - today's meal |
| GET | /menu | Monthly menu display |
| GET | /meals/:id | Meal detail page |
| GET | /admin | Admin dashboard |
| POST | /admin/createMeal | Create new meal |
| GET | /meals/edit/:id | Edit meal form |
| POST | /meals/edit/:id | Save meal edits |
| POST | /meals/delete/:id | Delete meal |
| POST | /admin/createMenu | Create/update menu |

## Files Modified
- `routes/routes.js` - Fixed routes and organization
- `models/Meal.js` - Added description field
- `controllers/mealController.js` - Refactored and fixed logic
- `controllers/menuController.js` - Complete rewrite for views
- `views/index.ejs` - Rewrote home page
- `views/menu.ejs` - Rewrote monthly menu view
- `views/displayMeal.ejs` - Rewrote meal detail view
- `views/admin.ejs` - Improved admin dashboard
- `views/edit.ejs` - Fixed edit form
- `views/navbar.ejs` - Created new navbar partial
- `public/styles.css` - Complete CSS overhaul
