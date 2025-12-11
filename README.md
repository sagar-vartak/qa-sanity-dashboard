# Sanity Dashboard - Contentstack Integration

A modern, responsive dashboard for viewing and managing Contentstack entries. Built with Next.js 16, React 19, and Tailwind CSS.

## Features

- 📋 **Entry Listing**: Beautiful card-based grid layout displaying all entries
- 🔍 **Entry Details**: Detailed view for individual entries with all metadata
- 🎨 **Modern UI**: Responsive design with dark mode support
- ⚡ **Fast Performance**: Server-side rendering with Next.js App Router
- 🚀 **Contentstack Launch Ready**: Optimized for deployment on Contentstack Launch

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Contentstack

Create a `.env.local` file in the root directory with the following variables:

```env
# Contentstack Configuration
# Get these values from your Contentstack dashboard: https://app.contentstack.com/

# API Key - Found in your stack settings
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your_api_key_here

# Delivery Token - Found in your stack settings > Tokens
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here

# Environment - Usually 'production', 'development', or 'staging'
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=production

# Region - 'us' (US), 'eu' (Europe), 'azure-na' (Azure North America), 'azure-eu' (Azure Europe)
NEXT_PUBLIC_CONTENTSTACK_REGION=us

# Content Type - The content type you want to display (e.g., 'blog_post', 'product', 'page')
# If not specified, defaults to 'entry'
NEXT_PUBLIC_CONTENTSTACK_CONTENT_TYPE=entry
```

### 3. Get Your Contentstack Credentials

1. Log in to your [Contentstack account](https://app.contentstack.com/)
2. Navigate to your stack
3. Go to **Settings** → **Stack** to find your **API Key**
4. Go to **Settings** → **Tokens** to create or find your **Delivery Token**
5. Set the **Environment** (usually 'production')
6. Note your **Region** (US, EU, etc.)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your dashboard.

### 5. Build for Production

```bash
npm run build
npm start
```

## Deployment to Contentstack Launch

This application is ready to be deployed on Contentstack Launch. Follow these steps:

1. **Connect your repository** to Contentstack Launch
2. **Set environment variables** in the Launch dashboard:
   - `NEXT_PUBLIC_CONTENTSTACK_API_KEY`
   - `NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN`
   - `NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT`
   - `NEXT_PUBLIC_CONTENTSTACK_REGION`
   - `NEXT_PUBLIC_CONTENTSTACK_CONTENT_TYPE` (optional)

3. **Deploy** - Contentstack Launch will automatically build and deploy your Next.js application

## Project Structure

```
├── app/
│   ├── entry/
│   │   └── [uid]/
│   │       ├── page.tsx          # Entry detail page
│   │       └── not-found.tsx      # 404 page for entries
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main dashboard (entry listing)
│   └── globals.css                # Global styles
├── lib/
│   └── contentstack.ts            # Contentstack SDK client and helpers
└── package.json
```

## Customization

### Change Content Type

Update the `NEXT_PUBLIC_CONTENTSTACK_CONTENT_TYPE` environment variable to display entries from a different content type.

### Customize Styling

The application uses Tailwind CSS. Modify the classes in:
- `app/page.tsx` - Entry listing page
- `app/entry/[uid]/page.tsx` - Entry detail page

### Add More Fields

The detail page automatically displays all fields from your Contentstack entry. To customize which fields are shown, modify the `excludedFields` array in `app/entry/[uid]/page.tsx`.

## Documentation

For more information about Contentstack, visit:
- [Contentstack Documentation](https://www.contentstack.com/docs)
- [Contentstack JavaScript SDK](https://www.contentstack.com/docs/developers/javascript-delivery-sdk)

## License

This project is private and proprietary.
