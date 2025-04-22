import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory for cloud upload
export const upload = multer({ storage });
