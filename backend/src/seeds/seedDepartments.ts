import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../models/department';

dotenv.config();

const departments = [
  { name: 'it', description: 'Information Technology' },
  { name: 'hr', description: 'Human Resources' },
  { name: 'engineering', description: 'Software and Hardware Engineering' },
  { name: 'sales', description: 'Sales and Marketing' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    for (const dept of departments) {
      await Department.findOneAndUpdate(
        { name: dept.name },
        dept,
        { upsert: true, new: true }
      );
    }

    console.log('Departments seeded successfully');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
