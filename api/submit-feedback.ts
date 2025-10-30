import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

interface FeedbackPayload {
  name: string;
  email: string;
  phone?: string;
}

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, phone } = req.body as FeedbackPayload;

  // Basic validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }
  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required.' });
  }
  // Optional phone validation (basic format check)
  // The regex /^\+?[1-9]\d{1,14}$/ is for E.164 format, which is very strict.
  // For optional phone, an empty string should be allowed.
  if (phone && typeof phone !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
  }
  if (phone && !/^\+?[1-9]\d{7,14}$/.test(phone.trim()) && phone.trim() !== '') {
    // A slightly more lenient phone regex for international numbers
    return res.status(400).json({ success: false, message: 'Invalid phone number format (e.g., +15551234567).' });
  }


  // Initialize client inside the handler for serverless best practices
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true, // Enforce SSL for secure connection to Neon
  });

  try {
    await client.connect();
    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        submission_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(
      'INSERT INTO feedback(name, email, phone) VALUES($1, $2, $3) RETURNING *',
      [name, email, phone === '' ? null : phone || null] // Ensure phone is null if empty string or undefined
    );

    res.status(200).json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Database operation error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit feedback due to a server error.' });
  } finally {
    // Always ensure the client is ended to release the connection
    if (client) {
      try {
        await client.end();
      } catch (endError) {
        console.error('Error closing database client:', endError);
      }
    }
  }
}