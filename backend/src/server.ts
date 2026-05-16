import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize }  from './models/index.js';
import authRoutes     from './routes/auth.routes.js';
import itemRoutes     from './routes/item.routes.js';
import outfitRoutes   from './routes/outfit.routes.js';

dotenv.config();

const app  = express();
const port = process.env.PORT || 3000;

// ── Middlewares globales ────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Servir la carpeta de subidas de forma estática
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── Rutas ───────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/items',   itemRoutes);
app.use('/api/outfits', outfitRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// ── Manejo global de errores ────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Arranque ────────────────────────────────────────────────
sequelize.sync({ alter: true })
  .then(() => {
    console.log('[database]: Database synced successfully.');
    app.listen(port, () => {
      console.log(`[server]: Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('[database]: Unable to connect to the database:', error);
  });

