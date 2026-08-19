import app from './app.js';
import connectDatabase from './config/db.js';
const port = process.env.PORT || 5000;
const startServer = async () => { await connectDatabase(); app.listen(port, () => console.log(`Server running at http://localhost:${port}`)); };
startServer();