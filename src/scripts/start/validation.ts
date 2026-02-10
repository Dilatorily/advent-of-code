export const validateYear = (year: number) => {
  if (Number.isNaN(year) || year < 2015) {
    throw new Error(`Invalid year: ${year}. Must be 2015 or later.`);
  }
};

export const validateDay = (day: number, year: number) => {
  const maxDay = year >= 2025 ? 12 : 25;
  if (Number.isNaN(day) || day < 1 || day > maxDay) {
    throw new Error(`Invalid day: ${day}. Must be between 1 and ${maxDay}.`);
  }
};

export const validatePart = (part: number) => {
  if (part !== 1 && part !== 2) {
    throw new Error(`Invalid part: ${part}. Must be either 1 or 2.`);
  }
};

const validateDateNotInFuture = (year: number, month: number, day: number) => {
  const now = new Date();
  const inputDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (inputDate > today) {
    throw new Error(
      `Cannot use future date: ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}. Advent of Code puzzles unlock daily at midnight EST.`,
    );
  }
};

export const parseDate = (dateStr?: string) => {
  if (!dateStr) {
    throw new Error('Date is required. Please use --date YYYY-MM-DD format.');
  }

  // Only accept "YYYY-MM-DD" format
  const parts = dateStr.split('-').map(Number);

  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD format.`);
  }

  const [year, month, day] = parts;

  validateYear(year);

  if (month !== 12) {
    throw new Error(`Invalid month: ${month}. Advent of Code is in December.`);
  }

  validateDateNotInFuture(year, month, day);
  validateDay(day, year);
  return { year, day };
};
