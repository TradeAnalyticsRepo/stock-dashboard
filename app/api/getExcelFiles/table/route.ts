
// app/api/getExcelFiles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req:NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stockName = searchParams.get('stockName');

    const excelDir = path.join(process.cwd(), 'excel');
    const file = fs.readdirSync(excelDir).find(file => (file === `${stockName}_table.json`));
    const filePath = path.join(process.cwd(), 'excel', file);
    const jsonContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonContent);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read excel directory', details: String(error) }, { status: 500 });
  }
}