import { callPostApi } from "./api";
import * as XLSX from "xlsx";

export const excelFileToJson = async (excelFile) => {
  const arrayBuffer = await excelFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
};

export const processingExcelData = async (excelFile, stockName) => {
  const originalData = await excelFileToJson(excelFile);
  // 명칭줄(첫밴째 인덱스) 제거
  originalData.shift();
  const baseDataBeforeProcess = {};
  // 기간별 데이터 추출
  const filtered = originalData.filter((row) => {
    if (!row.일자) {
      return false;
    }
    return Number(row.일자.replaceAll("/", "")) >= 20191001;
  });

  baseDataBeforeProcess.stockListByPeriod = stockDataBeforePeriodProcess(filtered);
  const tableData = processingExcelDataForCummulativePeriod(baseDataBeforeProcess.stockListByPeriod);
  const cumulativeTableData = {
    stockId: stockName,
    processingData: tableData,
    type: "table",
  };

  const reversedFilteredData = filtered.reverse(); // reverse 원본배열 변경
  
  // 누적합계, 최고저점, 최고고점 데이터 추출
  baseDataBeforeProcess.cumulativeStockData = stockDataBeforeCumulateProcess(reversedFilteredData);

  // 누적합계, 주가선도 등 데이터 가공작업
  const { graphProcessingData, stockPriceList, culmulativeList } = processingExcelDataForCummulativeGraph(
    filtered,
    baseDataBeforeProcess.cumulativeStockData
  );

  //표에 있는 누적, 상관계수 등을 위함.
  const latestGraphData = graphProcessingData[graphProcessingData.length - 1];
  latestGraphData.개인.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.개인);
  latestGraphData.세력합.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.세력합);
  latestGraphData.외국인.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.외국인);
  latestGraphData.금융투자.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.금융투자);
  latestGraphData.투신_일반.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.투신_일반);
  latestGraphData.투신_사모.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.투신_사모);
  latestGraphData.보험.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.보험);
  latestGraphData.기타금융.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.기타금융);
  latestGraphData.연기금.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.연기금);
  latestGraphData.국가매집.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.국가매집);
  latestGraphData.기타법인.stockCorrelation = pearsonCorrelation(stockPriceList, culmulativeList.기타법인);

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

export const stockDataBeforeCumulateProcess = (data) => {
  const cumulativeStockData = initCumulativeStockData;

  data.forEach((item) => {
    // 투자자별 누적합계, 최저점, 최고점
    Object.keys(excelEnum).forEach((key) => {
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
export const processingExcelDataForCummulativeGraph = (data, cumulativeStockData) => {
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

  const stockPriceList = [];
  const culmulativeList = {
    개인: [],
    세력합: [],
    외국인: [],
    금융투자: [],
    투신_일반: [],
    투신_사모: [],
    은행: [],
    보험: [],
    기타금융: [],
    연기금: [],
    국가매집: [],
    기타법인: [],
  };
  const result = [];

  data.forEach((item) => {
    let sumTotalCollectionVolume = 0;
    Object.keys(excelEnum).forEach((key) => {
      const value = excelEnum[key];
      if (value === "TotalForeAndInst") {
        volume.totalForeAndInstCollectionVolume += item["외국인"] + item["기관종합"];
      } else {
        // 타입 안전하게 접근
        const volKey = `${toCamel(value)}CollectionVolume`;
        if (key in item && volKey in volume) {
          volume[volKey] += item[key];
          sumTotalCollectionVolume += volume[volKey];
        }
      }
    });

    const defaultInfo = {
      tradeDate: item.일자,
      open: item.종가 + item.__EMPTY,
      close: item.종가,
      previousDayComparison: item.__EMPTY,
    };

    const dayValue = {
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
        maxColVolume: cumulativeStockData.maxIndivMount - cumulativeStockData.minIndivMount,
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
        maxColVolume: cumulativeStockData.maxTotalForeAndInstMount - cumulativeStockData.minTotalForeAndInstMount,
      },
      외국인: {
        ...defaultInfo,
        tradingVolume: item.외국인,
        stockCorrelation: 0,
        collectionVolume: volume.foreCollectionVolume,
        dispersionRatio: calcPercent(volume.foreCollectionVolume, cumulativeStockData.maxForeMount - cumulativeStockData.minForeMount),
        stockMomentum: calcPercent(cumulativeStockData.maxForeMount - cumulativeStockData.minForeMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxForeMount - cumulativeStockData.minForeMount,
      },
      금융투자: {
        ...defaultInfo,
        tradingVolume: item.기관,
        stockCorrelation: 0,
        collectionVolume: volume.finInvCollectionVolume,
        dispersionRatio: calcPercent(volume.finInvCollectionVolume, cumulativeStockData.maxFinInvMount - cumulativeStockData.minFinInvMount),
        stockMomentum: calcPercent(cumulativeStockData.maxFinInvMount - cumulativeStockData.minFinInvMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxFinInvMount - cumulativeStockData.minFinInvMount,
      },
      투신_일반: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_1,
        stockCorrelation: 0,
        collectionVolume: volume.gTrustCollectionVolume,
        dispersionRatio: calcPercent(volume.gTrustCollectionVolume, cumulativeStockData.maxGTrustMount - cumulativeStockData.minGTrustMount),
        stockMomentum: calcPercent(cumulativeStockData.maxGTrustMount - cumulativeStockData.minGTrustMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxGTrustMount - cumulativeStockData.minGTrustMount,
      },
      투신_사모: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_2,
        stockCorrelation: 0,
        collectionVolume: volume.sTrustCollectionVolume,
        dispersionRatio: calcPercent(volume.sTrustCollectionVolume, cumulativeStockData.maxSTrustMount - cumulativeStockData.minSTrustMount),
        stockMomentum: calcPercent(cumulativeStockData.maxSTrustMount - cumulativeStockData.minSTrustMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxSTrustMount - cumulativeStockData.minSTrustMount,
      },
      은행: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_3,
        stockCorrelation: 0,
        collectionVolume: volume.bankCollectionVolume,
        dispersionRatio: calcPercent(volume.bankCollectionVolume, cumulativeStockData.maxBankMount - cumulativeStockData.minBankMount),
        stockMomentum: calcPercent(cumulativeStockData.maxBankMount - cumulativeStockData.minBankMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxBankMount - cumulativeStockData.minBankMount,
      },
      보험: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_4,
        stockCorrelation: 0,
        collectionVolume: volume.insurCollectionVolume,
        dispersionRatio: calcPercent(volume.insurCollectionVolume, cumulativeStockData.maxInsurMount - cumulativeStockData.minInsurMount),
        stockMomentum: calcPercent(cumulativeStockData.maxInsurMount - cumulativeStockData.minInsurMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxInsurMount - cumulativeStockData.minInsurMount,
      },
      기타금융: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_5,
        stockCorrelation: 0,
        collectionVolume: volume.etcFinCollectionVolume,
        dispersionRatio: calcPercent(volume.etcFinCollectionVolume, cumulativeStockData.maxEtcFinMount - cumulativeStockData.minEtcFinMount),
        stockMomentum: calcPercent(cumulativeStockData.maxEtcFinMount - cumulativeStockData.minEtcFinMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxEtcFinMount - cumulativeStockData.minEtcFinMount,
      },
      연기금: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_6,
        stockCorrelation: 0,
        collectionVolume: volume.pensCollectionVolume,
        dispersionRatio: calcPercent(volume.pensCollectionVolume, cumulativeStockData.maxPensMount - cumulativeStockData.minPensMount),
        stockMomentum: calcPercent(cumulativeStockData.maxPensMount - cumulativeStockData.minPensMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxPensMount - cumulativeStockData.minPensMount,
      },
      국가매집: {
        ...defaultInfo,
        tradingVolume: item.__EMPTY_7,
        stockCorrelation: 0,
        collectionVolume: volume.natCollectionVolume,
        dispersionRatio: calcPercent(volume.natCollectionVolume, cumulativeStockData.maxNatMount - cumulativeStockData.minNatMount),
        stockMomentum: calcPercent(cumulativeStockData.maxNatMount - cumulativeStockData.minNatMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxNatMount - cumulativeStockData.minNatMount,
      },

      기타법인: {
        ...defaultInfo,
        tradingVolume: item.기타,
        stockCorrelation: 0,
        collectionVolume: volume.etcCollectionVolume,
        dispersionRatio: calcPercent(volume.etcCollectionVolume, cumulativeStockData.maxEtcMount - cumulativeStockData.minEtcMount),
        stockMomentum: calcPercent(cumulativeStockData.maxEtcMount - cumulativeStockData.minEtcMount, sumTotalCollectionVolume),
        maxColVolume: cumulativeStockData.maxEtcMount - cumulativeStockData.minEtcMount,
      },
    };

    stockPriceList.push(item.종가);
    culmulativeList.개인.push(volume.indivCollectionVolume);
    culmulativeList.세력합.push(volume.totalInsCollectionVolume);
    culmulativeList.외국인.push(volume.foreCollectionVolume);
    culmulativeList.금융투자.push(volume.finInvCollectionVolume);
    culmulativeList.투신_일반.push(volume.gTrustCollectionVolume);
    culmulativeList.투신_사모.push(volume.sTrustCollectionVolume);
    culmulativeList.은행.push(volume.bankCollectionVolume);
    culmulativeList.보험.push(volume.insurCollectionVolume);
    culmulativeList.기타금융.push(volume.etcFinCollectionVolume);
    culmulativeList.연기금.push(volume.pensCollectionVolume);
    culmulativeList.국가매집.push(volume.natCollectionVolume);
    culmulativeList.기타법인.push(volume.etcCollectionVolume);

    result.push(dayValue);
  });

  return { graphProcessingData: result, stockPriceList: stockPriceList, culmulativeList: culmulativeList };
};

export const stockDataBeforePeriodProcess = (data) => {
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
export const processingExcelDataForCummulativePeriod = (stockList) => {
  const result = [];
  const keys = Object.keys(stockList ?? {});
  keys.forEach((key) => {
    if (key === "week") {
      stockList[key].forEach((data) => {
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
      const cumulativeData = {
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
      stockList[key].forEach((data, idx) => {
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

const calcPercent = (num1, num2) => Math.floor((num1 / num2) * 100) || 0;
const toCamel = (str) => str[0].toLowerCase() + str.slice(1);

// excelEnum 정의 추가 (원본에서 import 되는 것으로 보임)
import { excelEnum } from "../../types/processingData.js";
  개인: "Indiv",
  외국인: "Fore",
  기관: "FinInv",
  기관종합: "TotalIns",
  기타: "Etc",
  __EMPTY_1: "GTrust",
  __EMPTY_2: "STrust",
  __EMPTY_3: "Bank",
  __EMPTY_4: "Insur",
  __EMPTY_5: "EtcFin",
  __EMPTY_6: "Pens",
  __EMPTY_7: "Nat",
  TotalForeAndInst: "TotalForeAndInst",
};

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

const initStockListByPeriod = {
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
    throw new Error("입력 데이터의 길이가 같아야 합니다.");
  }

  const n = x.length;
  if (n === 0) {
    return 0; // 또는 NaN, 상황에 따라 처리
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) {
    return 0; // 또는 NaN, 분모가 0인 경우 처리
  }

  return (numerator / denominator).toFixed(4);
}
