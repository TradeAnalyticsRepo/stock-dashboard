export interface ExcelData__ {
  /** 거래 날짜 */
  tradeDate: string;
  /** 시작가 */
  open: number;
  /** 종가 */
  close: number;
  /** 전일 대비 */
  previousDayComparison: number;
  /** 거래량 */
  tradingVolume: number;
  /** 상관계수 */
  stockCorrelation: number;
  /** 개인매집수량 */
  collectionVolume: number;
  /** 개인분산비율 */
  dispersionRatio: number;
  /** 개인주가선도 */
  stockMomentum: number;
}

export interface ChartData {
  주가: {
    tradeDate: string;
    previousDayComparison: string;
    open: number;
    close: number;
    high: number;
    low: number;
    tradingVolume: number;
  };
  개인: ExcelData__;
  세력합: ExcelData__;
  외국인: ExcelData__;
  금융투자: ExcelData__;
  투신_일반: ExcelData__;
  투신_사모: ExcelData__;
  은행: ExcelData__;
  보험: ExcelData__;
  기타금융: ExcelData__;
  연기금: ExcelData__;
  국가매집: ExcelData__;
  기타법인: ExcelData__;
}

export interface TableData {
  tradeDateNm: string;
  avgMount: number;
  tradingVolume: number;

  tradingVolumeIndiv: number;
  tradingVolumeTotalForeAndInst: number;
  tradingVolumeFore: number;
  tradingVolumeTotalIns: number;
  tradingVolumeFinInv: number;
  tradingVolumeEtc: number;
  tradingVolumeGTrust: number;
  tradingVolumeSTrust: number;
  tradingVolumeBank: number;
  tradingVolumeInsur: number;
  tradingVolumeEtcFin: number;
  tradingVolumePens: number;
  tradingVolumeNat: number;
}

export interface originalExcelFile {
    개인: number; 
    거래량: number;
    기관: number;          // 기관 = (금융투자)
    기관종합: number;
    기타: number;
    외국인: number;
    일자: string;          // "2025/06/05"
    전일대비: string;       // "▲" "▼"
    종가: number;
    __EMPTY: number;      // 전일대비오른 금액
    __EMPTY_1: number;    // 투신(일반)
    __EMPTY_2: number;    // 투신(사모)
    __EMPTY_3: number;    // 은행
    __EMPTY_4: number;    // 보험
    __EMPTY_5: number;    // 기타금융
    __EMPTY_6: number;    // 연기금
    __EMPTY_7: number;    // 국가지방
    __rowNum__: number;   // indicator
}

export interface baseDataBeforeProcess {
    cumulativeStockData?: {
        cumulativeIndivMount: number;   // 개인누적합계
        minIndivMount: number;          // 개인최고저점
        maxIndivMount: number;          // 개인최고고점
        cumulativeTotalForeAndInstMount:number; // 외국인 + 기관 누적합계
        minTotalForeAndInstMount: number;
        maxTotalForeAndInstMount: number;
        cumulativeForeMount : number;   // 외국인누적합계
        minForeMount: number;
        maxForeMount: number;
        cumulativeTotalInsMount : number;   // 기관종합누적합계
        minTotalInsMount: number;
        maxTotalInsMount: number;
        cumulativeFinInvMount: number;  // 금융투자(기관)누적합계
        minFinInvMount: number;
        maxFinInvMount: number;
        cumulativeInsurMount : number;   // 보험누적합계
        minInsurMount: number;
        maxInsurMount: number;
        cumulativeTrustMount : number;  // 투신(일반 + 특수)누적합계
        minTrustMount: number;
        maxTrustMount: number;
        cumulativeEtcFinMount : number; // 기타금융누적합계
        minEtcFinMount: number;
        maxEtcFinMount: number;
        cumulativeBankMount : number;   // 은행누적합계
        minBankMount: number;
        maxBankMount: number;
        cumulativePensMount : number;   // 연기금누적합계
        minPensMount: number;
        maxPensMount: number;
        cumulativeGTrustMount : number; // 투신(일반)누적합계
        minGTrustMount: number;
        maxGTrustMount: number;
        cumulativeSTrustMount : number; // 사모펀드누적합계
        minSTrustMount: number;
        maxSTrustMount: number;
        cumulativeNatMount : number;   // 국가누적합계
        minNatMount: number;
        maxNatMount: number;
        cumulativeEtcMount : number;   // 기타법인누적합계
        minEtcMount: number;
        maxEtcMount: number;
    },
    
    stockListByPeriod?: {
        week?: originalExcelFile[];           // 이번주
        week1?: originalExcelFile[];           // 1주
        week2?: originalExcelFile[];           // 2주
        week3?: originalExcelFile[];           // 3주
        week4?: originalExcelFile[];           // 4주
        month1?: originalExcelFile[];          // 1개월
        month2?: originalExcelFile[];          // 2개월
        month3?: originalExcelFile[];          // 3개월 
        quarter1?: originalExcelFile[];        // 1분기
        quarter2?: originalExcelFile[];        // 2분기
        quarter3?: originalExcelFile[];        // 3분기
        quarter4?: originalExcelFile[];        // 4분기
        year1?: originalExcelFile[];           // 1년
        year2?: originalExcelFile[];           // 2년
        year3?: originalExcelFile[];           // 3년
        year4?: originalExcelFile[];           // 4년
        year5?: originalExcelFile[];           // 5년
        year6?: originalExcelFile[];           // 6년
        year7?: originalExcelFile[];           // 7년
        year8?: originalExcelFile[];           // 8년
        year9?: originalExcelFile[];           // 9년
        year10?: originalExcelFile[];          // 10년
    };

    stockPriceList: [],
    culmulativeList: []
}

export const excelEnum = Object.freeze({
  개인: "Indiv",
  기관종합: "TotalIns",
  외국인: "Fore",
  기관: "FinInv",
  기타: "Etc",
  __EMPTY_1: "GTrust",
  __EMPTY_2: "STrust",
  __EMPTY_3: "Bank",
  __EMPTY_4: "Insur",
  __EMPTY_5: "EtcFin",
  __EMPTY_6: "Pens",
  __EMPTY_7: "Nat",

  TotalForeAndInst: "TotalForeAndInst",
});