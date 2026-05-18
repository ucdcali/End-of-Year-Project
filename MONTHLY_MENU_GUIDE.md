# Monthly Menu Form Implementation Guide

## Current Status
The monthly menu creation form structure is in place but needs enhancement to properly populate and submit data.

## What Needs to Be Done

### 1. Backend Enhancement (Optional but Recommended)
Create a helper function to parse month-day-meal data:

```javascript
// In menuController.js
export const parseMenuFormData = (req, res) => {
  const { month, year } = req.body;
  const meals = [];
  
  // Parse meal data from form
  // Expected format: meal_day_1, meal_day_2, etc.
  for (let day = 1; day <= 31; day++) {
    const mealId = req.body[`meal_day_${day}`];
    if (mealId) {
      const date = new Date(year, getMonthIndex(month), day);
      meals.push({
        date,
        meal: mealId
      });
    }
  }
  
  return meals;
}

function getMonthIndex(monthName) {
  const months = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3,
    'may': 4, 'june': 5, 'july': 6, 'august': 7,
    'september': 8, 'october': 9, 'november': 10, 'december': 11
  };
  return months[monthName.toLowerCase()];
}
```

### 2. Frontend Enhancement (JavaScript)
Add a script to dynamically populate the menu form:

```html
<!-- Add to bottom of admin.ejs -->
<script>
  document.getElementById('month').addEventListener('change', function() {
    populateMealDays();
  });
  
  document.getElementById('year').addEventListener('change', function() {
    populateMealDays();
  });
  
  async function populateMealDays() {
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    
    if (!month || !year) {
      document.getElementById('menu-days').innerHTML = 
        '<p>Select month and year to populate meal options for each day.</p>';
      return;
    }
    
    // Fetch meals from admin page (or make an API call)
    const meals = document.querySelectorAll('.meals-table tbody tr');
    
    if (meals.length === 0) {
      document.getElementById('menu-days').innerHTML = 
        '<p>No meals available. Please create meals first.</p>';
      return;
    }
    
    const daysInMonth = getDaysInMonth(month, year);
    let html = '<div class="menu-days-grid">';
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, getMonthIndex(month), day);
      const dateStr = date.toLocaleDateString('en-US', 
        { weekday: 'short', month: 'short', day: 'numeric' });
      
      html += `
        <div class="menu-day-select">
          <label for="meal_day_${day}">${dateStr}</label>
          <select name="meal_day_${day}" id="meal_day_${day}">
            <option value="">-- Select Meal --</option>
            ${getMealOptions()}
          </select>
        </div>
      `;
    }
    
    html += '</div>';
    document.getElementById('menu-days').innerHTML = html;
  }
  
  function getDaysInMonth(monthName, year) {
    const monthIndex = getMonthIndex(monthName);
    return new Date(year, monthIndex + 1, 0).getDate();
  }
  
  function getMonthIndex(monthName) {
    const months = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3,
      'may': 4, 'june': 5, 'july': 6, 'august': 7,
      'september': 8, 'october': 9, 'november': 10, 'december': 11
    };
    return months[monthName.toLowerCase()];
  }
  
  function getMealOptions() {
    // Option 1: Fetch from meals table
    const mealsTable = document.querySelector('.meals-table tbody');
    if (!mealsTable) return '';
    
    let options = '';
    mealsTable.querySelectorAll('tr').forEach(row => {
      const mealTitle = row.querySelector('td:first-child').textContent;
      // Note: You may need to store meal ID in data attribute or fetch it via API
      options += `<option value="${mealTitle}">${mealTitle}</option>`;
    });
    
    return options;
  }
</script>
```

### 3. Add CSS for Menu Days Grid
Add to `styles.css`:

```css
.menu-days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.menu-day-select {
  display: flex;
  flex-direction: column;
}

.menu-day-select label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50;
}

.menu-day-select select {
  padding: 8px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
}
```

### 4. Update Form Processing
In `admin.ejs`, update the form to handle the parsed data properly:

```html
<!-- Change the form action to handle the parsed meals -->
<form action="/admin/createMenu" method="post" class="menu-form">
  <!-- ... existing month/year fields ... -->
  
  <div id="menu-days">
    <!-- Populated by JavaScript -->
  </div>
  
  <button type="submit" class="btn btn-primary">Create Menu</button>
</form>
```

### 5. Update Menu Controller
Enhance the `createMenu` function to properly parse the form data:

```javascript
export const createMenu = async (req, res) => {
    try {
        const { month, year } = req.body;
        
        // Parse meal data from form
        const meals = [];
        for (let day = 1; day <= 31; day++) {
          const mealId = req.body[`meal_day_${day}`];
          if (mealId) {
            const monthIndex = getMonthIndex(month);
            const date = new Date(year, monthIndex, day);
            meals.push({
              date,
              meal: mealId
            });
          }
        }
        
        // Check if menu already exists for this month/year
        const existingMenu = await Menu.findOne({ month, year });
        
        if (existingMenu) {
          existingMenu.meals = meals;
          await existingMenu.save();
        } else {
          await Menu.create({
            month,
            year,
            meals
          });
        }
        
        res.redirect('/admin');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error creating/updating menu');
    }
}

function getMonthIndex(monthName) {
    const months = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3,
        'may': 4, 'june': 5, 'july': 6, 'august': 7,
        'september': 8, 'october': 9, 'november': 10, 'december': 11
    };
    return months[monthName.toLowerCase()];
}
```

## Testing Checklist

### User Interface Testing
- [ ] Home page loads and displays today's meal
- [ ] "No meal today" message displays when appropriate
- [ ] Monthly menu page loads and groups meals by date
- [ ] Meal cards are clickable and link to detail pages
- [ ] Meal detail page displays all information
- [ ] Navbar is present on all pages and links work
- [ ] Admin page loads with meal creation form

### Functional Testing
- [ ] Create a new meal from admin panel
- [ ] Verify meal appears in meals table
- [ ] Edit a meal and verify changes
- [ ] Delete a meal
- [ ] Create a monthly menu
- [ ] Verify today's date matches correct meal
- [ ] View monthly menu in student interface

### Browser Testing
- [ ] Test on desktop (1920px wide)
- [ ] Test on tablet (768px wide)
- [ ] Test on mobile (375px wide)
- [ ] Test navbar responsiveness

### Edge Cases
- [ ] No meals in database
- [ ] No menu for current month
- [ ] Month with 28, 29, 30, or 31 days
- [ ] Year changes (2026 to 2027)
- [ ] Dietary restrictions display correctly

## Quick Start for Testing

1. **Create test meals**:
   - Visit `/admin`
   - Create 3-5 test meals with different dietary restrictions
   
2. **Create a test menu**:
   - Select current month and year
   - Populate meal selections for a few days
   - Submit the form
   
3. **View as student**:
   - Visit `/` to see today's meal
   - Click "View Full Monthly Menu"
   - Click on meal cards to see details
   - Use navbar to navigate

## Known Issues to Address
1. JavaScript for dynamic form population not yet included
2. Meal ID selection in form needs API endpoint or data attributes
3. Date timezone handling may need adjustment
4. Form styling for many day selects needs grid layout

## Future Enhancements
- Duplicate menu from previous month
- View existing menus
- Export menu as PDF
- Email notifications when menu is updated
- Weekly view option
