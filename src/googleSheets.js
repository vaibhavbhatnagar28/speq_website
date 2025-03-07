import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path';

// Load credentials
const credentials = require(path.resolve(__dirname, '../assets/credentials/rising-field-451312-r8-473712ddbb37.json'));

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const getAuthClient = () => {
  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });
};

export const fetchGoogleSheetData = async (spreadsheetId) => {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:Z',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { totalCalls: 0, totalPnLPercent: 0, totalPnLAbs: 0 };
    }

    let totalCalls = rows.length - 1; // Excluding the header row
    let totalPnLPercent = 0;
    let totalPnLAbs = 0;

    rows.slice(1).forEach((row) => {
      totalPnLPercent += parseFloat(row[12]) || 0; // Column M (Index 12)
      totalPnLAbs += parseFloat(row[13]) || 0; // Column N (Index 13)
    });

    return { totalCalls, totalPnLPercent, totalPnLAbs };
  } catch (error) {
    console.error(`Error fetching Google Sheet data for sheet ${spreadsheetId}:`, error);
    return { totalCalls: 0, totalPnLPercent: 0, totalPnLAbs: 0 };
  }
};
