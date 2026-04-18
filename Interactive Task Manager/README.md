# Interactive Task Manager

A premium, interactive task manager for organizing your day. Built with a calm, modern SaaS aesthetic, it features robust task management functionalities including drag-and-drop reordering and a real-time notification system that alerts you when task deadlines arrive.

## Features

* **Task Management**: Add, edit, delete, and toggle task completion status seamlessly.
* **Drag and Drop Interface**: Reorder your tasks manually using an intuitive drag-and-drop system.
* **Real-Time Reminders**: Set dates and times securely. Get real-time desktop notifications when task deadlines are met.
* **Smart Filtering**: Quickly sort tasks by All, Active, and Completed views.
* **Dark & Light Themes**: Accessible dynamic theming tailored for visual comfort.
* **Responsive Design**: Designed to provide the best user experience on all devices.

## Technologies Used

* **HTML5 & Vanilla CSS3**: For the application's structure and styling.
* **Vanilla JavaScript ES6+**: Operating via modular script structure (`app.js`, `storage.js`, `ui.js`, `utils.js`).
* **Flatpickr**: For advanced date and time selections.
* **FontAwesome**: Modern UI iconography.

## Project Structure

```text
├── css/
│   ├── style.css       # Core layout and component styles 
│   └── theme.css       # Dark/Light mode color variables
├── images/             # Visual assets and icons
├── js/
│   ├── app.js          # Core application logic and bindings
│   ├── storage.js      # LocalStorage handling
│   ├── ui.js           # UI rendering and DOM manipulations
│   └── utils.js        # Helper utility functions
├── index.html          # Main HTML entrypoint
├── .gitignore          # Ignored files for Git tracking
└── README.md           # Documentation (You are here)
```

## How to Run Locally

Since this is a client-side vanilla web application, no build steps are required. 

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Open `index.html` in your favorite modern web browser (e.g., Chrome, Firefox, Edge).
4. *(Optional)* For advanced features like notifications to work completely in some browsers, you might consider running it through a local development server like VSCode Live Server. 

## Usage

* **Adding a Task**: Type your description, select a priority, pick a date & time using the Flatpickr input, and click "Add".
* **Reordering Tasks**: Click and hold a task item, then drag it up or down the list.
* **Testing Notifications**: Grant notification permissions if prompted by your browser. You will receive a desktop alert when the task time matches the current system time.
