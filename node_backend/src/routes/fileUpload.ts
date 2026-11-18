import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as xlsx from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../config/database';
import config from '../config/config';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configure file filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = config.fileUpload.allowedExtensions.map(ext => `.${ext}`);
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Only files with extensions ${config.fileUpload.allowedExtensions.join(', ')} are allowed`));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.fileUpload.maxSize, // Max file size in bytes
  }
});

/**
 * @route POST /file-upload
 * @desc Upload and process an Excel file
 */
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    
    // Process the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    
    if (sheetNames.length === 0) {
      return res.status(400).json({ message: 'The uploaded Excel file has no sheets' });
    }
    
    // Process the first sheet
    const firstSheetName = sheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: 'No data found in the Excel file' });
    }
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Process the data (this would depend on the specific requirements)
      // For example, adding data to database tables
      // ...
      
      // Commit transaction
      await transaction.commit();
      
      // Return processed data
      return res.status(200).json({
        message: 'File processed successfully',
        filename: req.file.filename,
        rowCount: data.length,
        data: data.slice(0, 5) // Return first 5 rows as sample
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    } finally {
      // Clean up: Delete the uploaded file if needed
      // fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error processing uploaded file:', error);
    return res.status(500).json({ 
      message: 'Error processing the uploaded file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /file-upload/template/:type
 * @desc Download a template file based on type
 */
router.get('/template/:type', (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    let templatePath = '';
    
    // Set template path based on type
    switch (type) {
      case 'obf':
        templatePath = path.join(process.cwd(), 'templates', 'obf_template.xlsx');
        break;
      case 'manpower':
        templatePath = path.join(process.cwd(), 'templates', 'manpower_template.xlsx');
        break;
      case 'capex':
        templatePath = path.join(process.cwd(), 'templates', 'capex_template.xlsx');
        break;
      default:
        return res.status(400).json({ message: 'Invalid template type' });
    }
    
    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ message: 'Template file not found' });
    }
    
    // Send the template file
    return res.download(templatePath);
  } catch (error) {
    console.error('Error downloading template:', error);
    return res.status(500).json({ message: 'Error downloading template file' });
  }
});

export default router; 