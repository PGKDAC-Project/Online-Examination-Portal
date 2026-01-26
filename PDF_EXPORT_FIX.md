# PDF Export Fix - Install Instructions

## Problem
The PDF export feature fails with error: "doc.autoTable is not a function"

## Cause
Missing npm packages: `jspdf` and `jspdf-autotable`

## Solution

### Option 1: Using Git Bash (Recommended)
1. Open Git Bash
2. Navigate to the frontend directory:
   ```bash
   cd "c:/Users/arkks/OneDrive/Desktop/Pg-Dac/Personal git data/Project/Code/Online-Examination-Portal/frontend-Application"
   ```
3. Install the packages:
   ```bash
   npm install jspdf jspdf-autotable
   ```

### Option 2: Using PowerShell (Requires Admin)
1. Open PowerShell as Administrator
2. Enable script execution:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Navigate to frontend directory and install:
   ```powershell
   cd "c:\Users\arkks\OneDrive\Desktop\Pg-Dac\Personal git data\Project\Code\Online-Examination-Portal\frontend-Application"
   npm install jspdf jspdf-autotable
   ```

### Option 3: Using CMD
1. Open Command Prompt
2. Navigate and install:
   ```cmd
   cd "c:\Users\arkks\OneDrive\Desktop\Pg-Dac\Personal git data\Project\Code\Online-Examination-Portal\frontend-Application"
   npm install jspdf jspdf-autotable
   ```

## Verification
After installation, check that `package.json` contains:
```json
"dependencies": {
  ...
  "jspdf": "^2.x.x",
  "jspdf-autotable": "^3.x.x"
  ...
}
```

## Restart Dev Server
After installing, restart the React development server:
```bash
npm run dev
```
