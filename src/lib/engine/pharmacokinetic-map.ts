import type { DrugPair } from '@/lib/types';
import drugPairsData from '../../../data/drug-pairs.json';

const drugPairs: DrugPair[] = drugPairsData as DrugPair[];

export function getAllDrugPairs(): DrugPair[] {
  return drugPairs;
}

export function findDrugPair(drugCodeA: string, drugCodeB: string): DrugPair | undefined {
  return drugPairs.find(
    (pair) =>
      (pair.drugCodeA === drugCodeA && pair.drugCodeB === drugCodeB) ||
      (pair.drugCodeA === drugCodeB && pair.drugCodeB === drugCodeA)
  );
}

export function findDrugPairByName(drugNameA: string, drugNameB: string): DrugPair | undefined {
  const normalize = (s: string) => s.toLowerCase().trim();
  return drugPairs.find(
    (pair) =>
      (normalize(pair.drugA) === normalize(drugNameA) && normalize(pair.drugB) === normalize(drugNameB)) ||
      (normalize(pair.drugA) === normalize(drugNameB) && normalize(pair.drugB) === normalize(drugNameA))
  );
}

export function findInteractionsForDrug(drugCode: string): DrugPair[] {
  return drugPairs.filter(
    (pair) => pair.drugCodeA === drugCode || pair.drugCodeB === drugCode
  );
}

export function getInteractingPairs(drugCodes: string[]): DrugPair[] {
  const pairs: DrugPair[] = [];
  for (let i = 0; i < drugCodes.length; i++) {
    for (let j = i + 1; j < drugCodes.length; j++) {
      const pair = findDrugPair(drugCodes[i], drugCodes[j]);
      if (pair) pairs.push(pair);
    }
  }
  return pairs;
}
