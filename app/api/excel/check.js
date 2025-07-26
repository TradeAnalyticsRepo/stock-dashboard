import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) {
      return NextResponse.json({ exists: false, message: "이름이 필요합니다." }, { status: 400 });
    }
    // 엑셀 디렉토리 내에 해당 이름의 .json 파일이 있는지 확인
    const filePath = path.join(process.cwd(), "excel", `${name}.json`);
    const exists = fs.existsSync(filePath);
    return NextResponse.json({ exists });
  } catch {
    return NextResponse.json({ exists: false, message: "서버 오류" }, { status: 500 });
  }
}
