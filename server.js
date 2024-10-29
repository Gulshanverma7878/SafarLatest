const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const sequelize = require('./config/db');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const path = require('path');

const fs = require('fs');
const archiver = require('archiver');





dotenv.config();


const app = express();


const OBJECT_PREFIX = 'uploads/';


const port = process.env.PORT || 9000;

//Importing routes
const PostRoute = require('./api/Post/PostRoutes');
const UserRoute = require('./api/UserAdd/UserRoute');
const LikePost=require('./api/PostLike/likePostRoute');
const BookingRoute=require('./api/Booking/BookingRoute');
const ReviewsRoute=require('./api/Reviews/ReviewsRoute');



// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));







// Run the cleanup script
exec('node ./cleanupIndexes.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing cleanup script: ${error}`);
    return;
  }
  console.log(`Cleanup script output: ${stdout}`);
  if (stderr) {
    console.error(`Cleanup script stderr: ${stderr}`);
  }
});

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);

  });





// Routes middleware



app.use('/api/user', UserRoute);
app.use('/api/post', PostRoute);
app.use('/api/likepost',LikePost);
app.use('/api/booking',BookingRoute);
app.use('/api/reviews',ReviewsRoute);

//////






app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Status</title>
      <style>
        body {
          margin: 0;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: black;
          color: #0f0;
          font-family: 'Courier New', Courier, monospace;
        }

        h2 {
          font-size: 3rem;
          animation: pulse 2s infinite;
          z-index: 1;
          color: #00ff00;
          text-shadow: 0 0 10px #00ff00;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }
      </style>
    </head>
    <body>
      <h2> +++    donation date match22222    +++  </h2>
      <canvas id="matrix"></canvas>

      <script>
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
        const matrix = letters.split('');

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = '#0f0';
          ctx.font = fontSize + 'px monospace';

          for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
        }

        setInterval(draw, 33);

        window.addEventListener('resize', () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          drops.length = Math.floor(canvas.width / fontSize);
          drops.fill(1);
        });
      </script>
    </body>
    </html>
  `);
});





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});







//  local server start code
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


