import type { NextApiRequest, NextApiResponse } from 'next';
import { migrate } from '../../lib/migrate';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await migrate();
    res.status(200).json({ message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({ message: 'Migration failed' });
  }
}