
// app/api/getExcelFiles/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const excelDir = path.join(process.cwd(), 'excel');
    const files = fs.readdirSync(excelDir).filter(file => file.endsWith('_lastest.json'));
    const stocks = [];
    files.forEach(file => {
        const filePath = path.join(process.cwd(), 'excel', file);
        const jsonContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(jsonContent);
        stocks.push({
            name: file.split('_')[0],
            price: data.주가.close,
            change: data.주가.previousDayComparison
        })
    })

    return NextResponse.json({ stocks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read excel directory', details: String(error) }, { status: 500 });
  }
}