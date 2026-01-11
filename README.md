# Notes Organizer - Full-Stack Application

A modern, professional notes organization platform built with vanilla JavaScript frontend and Node.js/Express backend. Teachers can upload, edit, and delete notes while students can view, search, and download them.

## Features

- **Role-Based Access**: Separate dashboards for teachers and students
- **Note Management**: Upload, edit, delete (teachers), view and download (students)
- **Advanced Search**: Keyword search with real-time filtering
- **Smart Filtering**: Filter by department, year, and subject
- **Sorting Options**: Sort by newest, oldest, or title
- **File Support**: PDF, DOCX, images, and video files
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Alert System**: Real-time notifications for user actions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional UI**: Clean, modern interface with smooth animations
- **Local Storage**: JSON file-based data storage (no database required)

## Project Structure

\`\`\`
notes-organizer/
├── server.js                 # Express server
├── package.json              # Dependencies
├── data/
│   └── seedData.json         # Sample data for initialization
├── uploads/                  # Uploaded files directory
├── public/
│   ├── index.html            # Home page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── dashboard.html        # Main dashboard
│   ├── css/
│   │   ├── styles.css        # Main stylesheet
│   │   └── dashboard.css     # Dashboard specific styles
│   └── js/
│       ├── theme.js          # Dark/Light mode toggle
│       ├── auth.js           # Authentication logic
│       └── dashboard.js      # Dashboard functionality
└── README.md                 # This file
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**
   \`\`\`bash
   cd notes-organizer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create necessary directories**
   \`\`\`bash
   mkdir -p data uploads
   \`\`\`

4. **Start the server**
   \`\`\`bash
   npm start
   \`\`\`

   The server will start on `http://localhost:3000`

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - The database will be automatically initialized with seed data

## Demo Credentials

### Teacher Account
- **Email**: teacher1@example.com
- **Password**: teacher123

### Student Accounts
- **Email**: student1@example.com
- **Password**: student123

- **Email**: student2@example.com
- **Password**: student123

## Features Guide

### For Teachers

1. **Upload Notes**
   - Click "Upload Notes" from the sidebar
   - Fill in the note details (title, description, department, year, subject)
   - Select a file (PDF, DOCX, images, or video)
   - Click "Upload Note"

2. **Manage Notes**
   - Access "My Notes" to view all uploaded notes
   - Edit note details (metadata only)
   - Delete notes you've uploaded

3. **View Statistics**
   - See how many times your notes have been downloaded
   - Track note details and metadata

### For Students

1. **Browse Notes**
   - View all available notes from teachers
   - Search notes by title or description
   - Filter by department, year, or subject
   - Sort by newest, oldest, or title

2. **Download Notes**
   - Click the download button on any note
   - Access note details and information
   - Track download history

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user

### Notes
- `GET /api/notes` - Get all notes with optional filters
- `GET /api/notes/:id` - Get single note
- `POST /api/notes/upload` - Upload new note (teachers only)
- `PUT /api/notes/:id` - Update note (teachers only)
- `DELETE /api/notes/:id` - Delete note (teachers only)
- `POST /api/notes/:id/download` - Record download

### Metadata
- `GET /api/metadata` - Get available departments, years, and subjects
- `POST /api/init-seed` - Initialize database with seed data

## Data Storage

The application uses JSON files for data storage:
- **users.json**: User accounts and authentication
- **notes.json**: All notes metadata and references
- **uploads/**: Directory containing uploaded files

## Customization

### Add New Departments
Edit `seedData.json` and add new notes with different department names.

### Change Colors
Edit CSS variables in `public/css/styles.css`:
\`\`\`css
:root {
    --accent-primary: #3b82f6;
    --accent-secondary: #10b981;
    --accent-danger: #ef4444;
}
\`\`\`

### Modify File Types
Edit the `fileFilter` in `server.js` to allow additional file types.

## Limitations & Future Enhancements

### Current Limitations
- Single-file deployment (no database)
- No user profile images
- No note categories beyond department/year/subject
- No comment system
- No sharing features

### Potential Enhancements
- Add MongoDB/PostgreSQL database
- Implement email notifications
- Add user profile customization
- Create note categories and tags
- Add comment/discussion system
- Implement note ratings and reviews
- Add file preview capabilities
- Create backup/export system
- Add analytics dashboard

## Security Notes

**Important**: This is a demo application. For production use:
- Use bcrypt for password hashing
- Implement HTTPS
- Add input validation on backend
- Implement rate limiting
- Add CSRF protection
- Store files outside public directory
- Implement proper access control

## Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Ensure Node.js is properly installed
- Try `npm install` again

### Files not uploading
- Check permissions in `uploads` directory
- Verify file size is under 100MB
- Ensure file type is supported

### Database not initializing
- Delete `data/` folder and restart server
- Check file permissions in project directory

### Page not loading
- Clear browser cache
- Check browser console for errors
- Ensure server is running on http://localhost:3000

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, check the troubleshooting section or review the code comments for implementation details.

---

**Built with ❤️ for educational collaboration**
# leena_magar-
