# 🧩 Dynamic Filterable React App

A fully functional **React + Vite** application that demonstrates key frontend skills:
- Dynamic list filtering (text, dropdown, range)
- URL-based filter persistence
- Custom data-fetching hook with caching and retry
- Paginated API fetching with “Load More”
- Clean, responsive UI with minimal dependencies

---

## 🚀 Features

### ✅ **1. Dynamic Filterable Product List**
- Mock product data (name, category, price)
- Filter by **name** (case-insensitive)
- Filter by **category**
- Filter by **price range** (dual slider)
- Reset all filters
- **Filters persist in URL query params**
  - Example:  
    ```
    http://localhost:5173/?name=iphone&category=Electronics&minPrice=500&maxPrice=1500
    ```
  - Enables deep-linking and refresh-safe state.

### ✅ **2. `useFetch(url)` Custom Hook**
Reusable hook for remote data fetching.

**Features:**
- Auto-fetches when `url` changes
- Exposes `{ data, error, loading, retry }`
- Caches each successful `url → data` pair (no re-fetch on repeat)
- Manual retry option for failed requests

### ✅ **3. `<PostList />` Component**
- Uses `useFetch("https://jsonplaceholder.typicode.com/posts")`
- Displays post titles and bodies
- Demonstrates loading, error, and retry behavior

### ✅ **4. `<PaginatedList />` Component**
- Fetches data page by page (10 items per page)
- “Load More” button appends next page
- Includes loading spinner and error handling
- Demonstrates real-world pagination pattern

---

## 🧠 Tech Stack

| Tool | Purpose |
|------|----------|
| **React 18** | UI library |
| **Vite** | Fast build tool & dev server |
| **JavaScript (ES6+)** | Core language |
| **Fetch API** | For network requests |
| **CSS** | Minimal styling |
| **JSONPlaceholder API** | Mock data source |

---

## 🛠️ Project Structure

```
dynamic-filterable-app/
├── index.html
├── package.json
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles.css
│   ├── hooks/
│   │   └── useFetch.js
│   └── components/
│       ├── FilterableList.jsx
│       ├── PostList.jsx
│       └── PaginatedList.jsx
└── public/
```

---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone or Unzip
Download or extract the project files.

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`).

### 4️⃣ Build for Production
```bash
npm run build
npm run preview
```

---

## 📸 UI Preview (Expected Behavior)

| Component | Description |
|------------|--------------|
| **Filterable List** | Interactive filters with URL persistence |
| **PostList** | Cached API fetch with retry |
| **PaginatedList** | Infinite-like "Load More" pattern |

---

## 🧩 Core Concepts Demonstrated

- React component composition  
- Custom hooks (`useFetch`)  
- State synchronization with URL  
- Efficient re-rendering using `useMemo` / `useEffect`  
- Graceful handling of network errors  
- Client-side caching  
- Minimal responsive styling (CSS Grid / Flexbox)

---

## 🧱 Future Enhancements (Optional Ideas)

- Replace mock data with live API (e.g., `/api/products`)
- Add sorting (price, name)
- Add debounce to name filter
- Replace dual sliders with a proper range component
- Integrate localStorage for offline persistence
- Use TypeScript for better type safety

---

## 👨‍💻 Author

**Gunavardhan sai Putta**  
Built as part of a React assessment challenge.  
Demonstrates skills in component design, hooks, state management, and user experience.

---

## 📄 License

This project is open-source and free to use for educational or demonstration purposes.
