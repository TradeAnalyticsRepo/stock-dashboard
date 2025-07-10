import { baseDataBeforeProcess, ChartData, excelEnum, originalExcelFile, TableData } from "@/types/processingData";
import { callPostApi } from "./api";
import * as XLSX from "xlsx";

export const excelFileToJson = async (excelFile: File): Promise<originalExcelFile[]> => {
  const arrayBuffer = await excelFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
};

export const processingExcelData = async (excelFile: File, stockName: string) => {
  const originalData = await excelFileToJson(excelFile);
  // 명칭줄(첫밴째 인덱스) 제거
  originalData.shift();
  const baseDataBeforeProcess: baseDataBeforeProcess = {};
  // 기간별 데이터 추출
  baseDataBeforeProcess.stockListByPeriod = stockDataBeforePeriodProcess(originalData);
  const tableData: TableData[] = processingExcelDataForCummulativePeriod(baseDataBeforeProcess.stockListByPeriod);
  const cumulativeTableData = {
    stockId: stockName,
    processingData: tableData,
    type: "table",
  };

  const reversedOriginalData = originalData.reverse(); // reverse 원본배열 변경
  const filtered = reversedOriginalData.filter((row) => {
    if (!row.일자) {
      return false;
    }
    return Number(row.일자.replaceAll("/", "")) >= 20201029;
  });
  // 누적합계, 최고저점, 최고고점 데이터 추출
  baseDataBeforeProcess.cumulativeStockData = stockDataBeforeCumulateProcess(filtered);

  // 누적합계, 주가선도 등 데이터 가공작업
  const { graphProcessingData, stockPriceList, culmulativeList } = processingExcelDataForCummulativeGraph(
    filtered,
    baseDataBeforeProcess.cumulativeStockData
  );

  //표에 있는 누적, 상관계수 등을 위함.
  const latestGraphData = graphProcessingData[graphProcessingData.length - 1];
  //   console.log(stockPriceList, culmulativeList)
  latestGraphData.개인.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.개인);
  const cumulativeGraphData = {
    stockId: stockName,
    processingData: graphProcessingData,
    type: "graph",
  };

  const cumulativeLastestData = {
    stockId: stockName,
    processingData: latestGraphData,
    type: "lastest",
  };

  //   console.log(cumulativeGraphData, cumulativeLastestData);
  // 그래프 json파일 생성
  await callPostApi("/api/excel", cumulativeGraphData);
  await callPostApi("/api/excel", cumulativeLastestData);
  await callPostApi("/api/excel", cumulativeTableData);
};

export const stockDataBeforeCumulateProcess = (data: originalExcelFile[]): baseDataBeforeProcess["cumulativeStockData"] => {
  const cumulativeStockData = initCumulativeStockData;

  data.forEach((item) => {
    // 투자자별 누적합계, 최저점, 최고점
    Object.keys(excelEnum).forEach((key: string) => {
      if (key === "TotalForeAndInst") {
        // 외국인 + 기관
        const cumulativeMount = cumulativeStockData.cumulativeForeMount + cumulativeStockData.cumulativeTotalInsMount;
        cumulativeStockData.cumulativeTotalForeAndInstMount = cumulativeMount;

        if (cumulativeStockData.minTotalForeAndInstMount > cumulativeMount) {
          cumulativeStockData.minTotalForeAndInstMount = cumulativeMount;
        } else if (cumulativeStockData.maxTotalForeAndInstMount < cumulativeMount) {
          cumulativeStockData.maxTotalForeAndInstMount = cumulativeMount;
        }
      } else if (Number(item[key])) {
        const cumulativeKey = `cumulative${excelEnum[key]}Mount`;
        const minKey = `min${excelEnum[key]}Mount`;
        const maxKey = `max${excelEnum[key]}Mount`;

        // [key]누적합계
        const cumulativeMount = cumulativeStockData[cumulativeKey] + Number(item[key]);
        cumulativeStockData[cumulativeKey] = cumulativeMount;

        // [key]min, max
        if (cumulativeStockData[minKey] > cumulativeMount) {
          cumulativeStockData[minKey] = cumulativeMount;
        } else if (cumulativeStockData[maxKey] < cumulativeMount) {
          cumulativeStockData[maxKey] = cumulativeMount;
        }
      }
    });
  });
  return cumulativeStockData;
};

// 수급계산 로직
export const processingExcelDataForCummulativeGraph = (
  data: originalExcelFile[],
  cumulativeStockData: baseDataBeforeProcess["cumulativeStockData"]
) => {
  const volume = {
    indivCollectionVolume: -cumulativeStockData.minIndivMount,
    totalForeAndInstCollectionVolume: -cumulativeStockData.minTotalForeAndInstMount,
    foreCollectionVolume: -cumulativeStockData.minForeMount,
    totalInsCollectionVolume: -cumulativeStockData.minTotalInsMount,
    finInvCollectionVolume: -cumulativeStockData.minFinInvMount,
    insurCollectionVolume: -cumulativeStockData.minInsurMount,
    etcFinCollectionVolume: -cumulativeStockData.minEtcFinMount,
    bankCollectionVolume: -cumulativeStockData.minBankMount,
    pensCollectionVolume: -cumulativeStockData.minPensMount,
    gTrustCollectionVolume: -cumulativeStockData.minGTrustMount,
    sTrustCollectionVolume: -cumulativeStockData.minSTrustMount,
    natCollectionVolume: -cumulativeStockData.minNatMount,
    etcCollectionVolume: -cumulativeStockData.minEtcMount,
  };

  const stockPriceList: number[] = [];
  const culmulativeList = {
    개인: [],
  };
  const result: ChartData[] = [];

  data.forEach((item) => {
    let sumTotalCollectionVolume = 0;
    (Object.keys(excelEnum) as (keyof originalExcelFile)[]).forEach((key) => {
      const value = excelEnum[key];
      if (value === "TotalForeAndInst") {
        volume.totalForeAndInstCollectionVolume += item["외국인"] + item["기관종합"];
      } else {
        // 타입 안전하게 접근
        const volKey = `${toCamel(value)}CollectionVolume` as keyof typeof volume;
        if (key in item && volKey in volume) {
          volume[volKey] += (item as any)[key] as number;
          sumTotalCollectionVolume += volume[volKey];
        }
      }
    });
    //   if(idx === data.length - 1){
    //     console.log(cumulativeStockData.maxIndivMount, cumulativeStockData.minIndivMount, cumulativeStockData.maxIndivMount - cumulativeStockData.minIndivMount ,sumTotalCollectionVolume);
    //   }

    const defaultInfo = {
      tradeDate: item.일자,
      open: item.종가 + item.__EMPTY,
      close: item.종가,
      previousDayComparison: item.__EMPTY,
    };

    const dayValue: ChartData = {
      주가: {
        ...defaultInfo,
        high: 0,
        low: 0,
        tradingVolume: item.거래량,
      },
      개인: {
        ...defaultInfo,
        tradingVolume: item.개인,
        stockCorrelation: 0,
        collectionVolume: volume.indivCollectionVolume,
        dispersionRatio: calcPercent(volume.indivCollectionVolume, cumulativeStockData.maxIndivMount - cumulativeStockData.minIndivMount),
        stockMomentum: calcPercent(cumulativeStockData.maxIndivMount - cumulativeStockData.minIndivMount, sumTotalCollectionVolume),
      },
      세력합: {
        ...defaultInfo,
        tradingVolume: item.외국인 + item.기관종합,
        stockCorrelation: 0,
        collectionVolume: volume.totalForeAndInstCollectionVolume,
        dispersionRatio: calcPercent(
          volume.totalForeAndInstCollectionVolume,
          cumulativeStockData.maxTotalForeAndInstMount - cumulativeStockData.minTotalForeAndInstMount
        ),
        stockMomentum: calcPercent(
          cumulativeStockData.maxTotalForeAndInstMount - cumulativeStockData.minTotalForeAndInstMount,
          sumTotalCollectionVolume
        ),
      },
      외국인: {
        ...defaultInfo,
        tradingVolume: item.외국인,
        stockCorrelation: 0,
        collectionVolume: volume.foreCollectionVolume,
        dispersionRatio: calcPercent(volume.foreCollectionVolume, cumulativeStockData.maxForeMount - cumulativeStockData.minForeMount),
        stockMomentum: calcPercent(cumulativeStockData.maxForeMount - cumulativeStockData.minForeMount, sumTotalCollectionVolume),
      },
      투신_일반: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_1,
        stockCorrelation: 0,
        collectionVolume: volume.gTrustCollectionVolume,
        dispersionRatio: calcPercent(volume.gTrustCollectionVolume, cumulativeStockData.maxGTrustMount - cumulativeStockData.minGTrustMount),
        stockMomentum: calcPercent(cumulativeStockData.maxGTrustMount - cumulativeStockData.minGTrustMount, sumTotalCollectionVolume),
      },
      투신_사모: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_2,
        stockCorrelation: 0,
        collectionVolume: volume.sTrustCollectionVolume,
        dispersionRatio: calcPercent(volume.sTrustCollectionVolume, cumulativeStockData.maxSTrustMount - cumulativeStockData.minSTrustMount),
        stockMomentum: calcPercent(cumulativeStockData.maxSTrustMount - cumulativeStockData.minSTrustMount, sumTotalCollectionVolume),
      },
      은행: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_3,
        stockCorrelation: 0,
        collectionVolume: volume.bankCollectionVolume,
        dispersionRatio: calcPercent(volume.bankCollectionVolume, cumulativeStockData.maxBankMount - cumulativeStockData.minBankMount),
        stockMomentum: calcPercent(cumulativeStockData.maxBankMount - cumulativeStockData.minBankMount, sumTotalCollectionVolume),
      },
      보험: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_4,
        stockCorrelation: 0,
        collectionVolume: volume.insurCollectionVolume,
        dispersionRatio: calcPercent(volume.insurCollectionVolume, cumulativeStockData.maxInsurMount - cumulativeStockData.minInsurMount),
        stockMomentum: calcPercent(cumulativeStockData.maxInsurMount - cumulativeStockData.minInsurMount, sumTotalCollectionVolume),
      },
      기타금융: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_5,
        stockCorrelation: 0,
        collectionVolume: volume.etcFinCollectionVolume,
        dispersionRatio: calcPercent(volume.etcFinCollectionVolume, cumulativeStockData.maxEtcFinMount - cumulativeStockData.minEtcFinMount),
        stockMomentum: calcPercent(cumulativeStockData.maxEtcFinMount - cumulativeStockData.minEtcFinMount, sumTotalCollectionVolume),
      },
      연기금: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_6,
        stockCorrelation: 0,
        collectionVolume: volume.pensCollectionVolume,
        dispersionRatio: calcPercent(volume.pensCollectionVolume, cumulativeStockData.maxPensMount - cumulativeStockData.minPensMount),
        stockMomentum: calcPercent(cumulativeStockData.maxPensMount - cumulativeStockData.minPensMount, sumTotalCollectionVolume),
      },
      국가매집: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_7,
        stockCorrelation: 0,
        collectionVolume: volume.natCollectionVolume,
        dispersionRatio: calcPercent(volume.natCollectionVolume, cumulativeStockData.maxNatMount - cumulativeStockData.minNatMount),
        stockMomentum: calcPercent(cumulativeStockData.maxNatMount - cumulativeStockData.minNatMount, sumTotalCollectionVolume),
      },

      기타법인: {
        ...defaultInfo,
        tradingVolume: item.기타,
        stockCorrelation: 0,
        collectionVolume: volume.etcCollectionVolume,
        dispersionRatio: calcPercent(volume.etcCollectionVolume, cumulativeStockData.maxEtcMount - cumulativeStockData.minEtcMount),
        stockMomentum: calcPercent(cumulativeStockData.maxEtcMount - cumulativeStockData.minEtcMount, sumTotalCollectionVolume),
      },
    };

    stockPriceList.push(item.종가);
    culmulativeList.개인.push(volume.indivCollectionVolume);

    result.push(dayValue);
  });

  return { graphProcessingData: result, stockPriceList: stockPriceList, culmulativeList: culmulativeList };
};

export const stockDataBeforePeriodProcess = (data: originalExcelFile[]): baseDataBeforeProcess["stockListByPeriod"] => {
  let week = 1,
    month = 1,
    quarter = 1,
    year = 1;

  /**
   * 기간별 list 잘라서 넣어주기
   */
  const stockListByPeriod = initStockListByPeriod;
  data.forEach((item) => {
    if (stockListByPeriod?.week?.length < 5) {
      stockListByPeriod?.week?.push(item);
    }

    if (week < 5) {
      const weekList = stockListByPeriod[`week${week}`] || [];
      if (weekList.length < 5) {
        const tradeDateNm = `${week}주`;
        weekList.push(Object.assign({}, item, { tradeDateNm: tradeDateNm }));
      } else {
        const nextweek = stockListByPeriod[`week${++week}`] || [];
        const tradeDateNm = `${week}주`;
        nextweek.push(Object.assign({}, item, { tradeDateNm: tradeDateNm }));
      }
    }

    if (month < 4) {
      const monthList = stockListByPeriod[`month${month}`] || [];
      if (monthList.length < 20) {
        const tradeDateNm = `${month}월`;
        monthList.push(Object.assign({}, item, { tradeDateNm: tradeDateNm }));
      } else {
        const nextMonth = stockListByPeriod[`month${++month}`] || [];
        const tradeDateNm = `${month}월`;
        nextMonth.push(Object.assign({}, item, { tradeDateNm: tradeDateNm }));
      }
    }

    if (quarter < 5) {
      const quarterList = stockListByPeriod[`quarter${quarter}`] || [];
      if (quarterList.length < 60) {
        const tradeDateNm = `${quarter}분기`;
        quarterList.push(Object.assign({}, item, { tradeDateNm: tradeDateNm }));
      } else {
        const nextQuarter = stockListByPeriod[`quarter${++quarter}`] || [];
        const tradeDateNm = `${month}분기`;
        nextQuarter.push(Object.assign({}, item, { tradeDateNm: tradeDateNm }));
      }
    }

    const yearList = stockListByPeriod[`year${year}`] || [];
    if (yearList.length < 240) {
      const tradeDateNm = `${year}년`;
      yearList.push(Object.assign({}, item, { tradeDateNm: tradeDateNm }));
    } else {
      const nextYear = stockListByPeriod[`year${++year}`] || [];
      const tradeDateNm = `${year}년`;
      nextYear.push(Object.assign({}, item, { tradeDateNm: tradeDateNm }));
    }
  });

  return stockListByPeriod;
};
// 수급분석표 로직
export const processingExcelDataForCummulativePeriod = (stockList: baseDataBeforeProcess["stockListByPeriod"]): TableData[] => {
  const result: TableData[] = [];
  const keys = Object.keys(stockList ?? {});
  keys.forEach((key) => {
    if (key === "week") {
      stockList[key].forEach((data: originalExcelFile) => {
        result.push({
          tradeDateNm: data.일자,
          avgMount: data.종가,
          tradingVolume: data.거래량,

          tradingVolumeIndiv: data.개인,
          tradingVolumeTotalForeAndInst: data.외국인 + data.기관종합,
          tradingVolumeFore: data.외국인,
          tradingVolumeTotalIns: data.기관종합,
          tradingVolumeFinInv: data.기관,
          tradingVolumeEtc: data.기타,
          tradingVolumeGTrust: data.__EMPTY_1,
          tradingVolumeSTrust: data.__EMPTY_2,
          tradingVolumeBank: data.__EMPTY_3,
          tradingVolumeInsur: data.__EMPTY_4,
          tradingVolumeEtcFin: data.__EMPTY_5,
          tradingVolumePens: data.__EMPTY_6,
          tradingVolumeNat: data.__EMPTY_7,
        });
      });
    } else {
      const cumulativeData: TableData = {
        tradeDateNm: "",
        avgMount: 0,
        tradingVolume: 0,

        tradingVolumeIndiv: 0,
        tradingVolumeTotalForeAndInst: 0,
        tradingVolumeFore: 0,
        tradingVolumeTotalIns: 0,
        tradingVolumeFinInv: 0,
        tradingVolumeEtc: 0,
        tradingVolumeGTrust: 0,
        tradingVolumeSTrust: 0,
        tradingVolumeBank: 0,
        tradingVolumeInsur: 0,
        tradingVolumeEtcFin: 0,
        tradingVolumePens: 0,
        tradingVolumeNat: 0,
      };
      stockList[key].forEach((data: originalExcelFile, idx: number) => {
        cumulativeData.avgMount += data.종가;
        cumulativeData.tradingVolume += data.거래량;

        cumulativeData.tradingVolumeIndiv += data.개인;
        cumulativeData.tradingVolumeTotalForeAndInst += data.외국인 + data.기관종합;
        cumulativeData.tradingVolumeFore += data.외국인;
        cumulativeData.tradingVolumeTotalIns += data.기관종합;
        cumulativeData.tradingVolumeFinInv += data.기관;
        cumulativeData.tradingVolumeEtc += data.기타;
        cumulativeData.tradingVolumeGTrust += data.__EMPTY_1;
        cumulativeData.tradingVolumeSTrust += data.__EMPTY_2;
        cumulativeData.tradingVolumeBank += data.__EMPTY_3;
        cumulativeData.tradingVolumeInsur += data.__EMPTY_4;
        cumulativeData.tradingVolumeEtcFin += data.__EMPTY_5;
        cumulativeData.tradingVolumePens += data.__EMPTY_6;
        cumulativeData.tradingVolumeNat += data.__EMPTY_7;

        if (idx + 1 === stockList[key].length) {
          result.push(
            Object.assign({}, cumulativeData, {
              tradeDateNm: data.tradeDateNm,
              avgMount: Math.floor(cumulativeData.avgMount / stockList[key].length),
            })
          );
        }
      });
    }
  });

  return result;
};

const calcPercent = (num1: number, num2: number) => Math.round((num1 / num2) * 100) || 0;
const toCamel = (str: string) => str[0].toLowerCase() + str.slice(1);

const initCumulativeStockData = {
  cumulativeIndivMount: 0,
  minIndivMount: 0,
  maxIndivMount: 0,

  cumulativeForeMount: 0,
  minForeMount: 0,
  maxForeMount: 0,

  cumulativeFinInvMount: 0,
  minFinInvMount: 0,
  maxFinInvMount: 0,

  cumulativeInsurMount: 0,
  minInsurMount: 0,
  maxInsurMount: 0,

  cumulativeTrustMount: 0,
  minTrustMount: 0,
  maxTrustMount: 0,

  cumulativeEtcFinMount: 0,
  minEtcFinMount: 0,
  maxEtcFinMount: 0,

  cumulativeBankMount: 0,
  minBankMount: 0,
  maxBankMount: 0,

  cumulativePensMount: 0,
  minPensMount: 0,
  maxPensMount: 0,

  cumulativeSTrustMount: 0,
  minSTrustMount: 0,
  maxSTrustMount: 0,

  cumulativeNatMount: 0,
  minNatMount: 0,
  maxNatMount: 0,

  cumulativeEtcMount: 0,
  minEtcMount: 0,
  maxEtcMount: 0,

  cumulativeTotalForeAndInstMount: 0,
  minTotalForeAndInstMount: 0,
  maxTotalForeAndInstMount: 0,

  cumulativeTotalInsMount: 0,
  minTotalInsMount: 0,
  maxTotalInsMount: 0,

  cumulativeGTrustMount: 0,
  minGTrustMount: 0,
  maxGTrustMount: 0,
};

const initStockListByPeriod: {
  week: originalExcelFile[];
  week1: originalExcelFile[];
  week2: originalExcelFile[];
  week3: originalExcelFile[];
  week4: originalExcelFile[];
  month1: originalExcelFile[];
  month2: originalExcelFile[];
  month3: originalExcelFile[];
  quarter1: originalExcelFile[];
  quarter2: originalExcelFile[];
  quarter3: originalExcelFile[];
  quarter4: originalExcelFile[];
  year1: originalExcelFile[];
  year2: originalExcelFile[];
  year3: originalExcelFile[];
  year4: originalExcelFile[];
  year5: originalExcelFile[];
  year6: originalExcelFile[];
  year7: originalExcelFile[];
  year8: originalExcelFile[];
  year9: originalExcelFile[];
  year10: originalExcelFile[];
} = {
  week: [],
  week1: [],
  week2: [],
  week3: [],
  week4: [],
  month1: [],
  month2: [],
  month3: [],
  quarter1: [],
  quarter2: [],
  quarter3: [],
  quarter4: [],
  year1: [],
  year2: [],
  year3: [],
  year4: [],
  year5: [],
  year6: [],
  year7: [],
  year8: [],
  year9: [],
  year10: [],
};

/** 상관계수 */
function pearsonCorrelation(x, y) {
  if (x.length !== y.length) {
    throw new Error("배열의 길이가 같아야 합니다.");
  }

  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let sumX = 0;
  let sumY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumX += dx * dx;
    sumY += dy * dy;
  }

  const denominator = Math.sqrt(sumX * sumY);
  if (denominator === 0) return 0;

  return numerator / denominator;
}
