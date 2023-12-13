import { Repository } from '../shared/repository.js';
import { History } from './history.entity.js';

const historyList: History[] = [
  new History(
    '13/12/2023, 18:06:12',
    11,
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
];

export class HistoryRepository implements Repository<History> {
  public findAll(): History[] | undefined {
    return historyList;
  }

  public findOne(item: { id: string }): History | undefined {
    return historyList.find((history) => history.id === item.id);
  }

  public add(item: History): History | undefined {
    historyList.push(item);
    return item;
  }

  public update(item: History): History | undefined {
    const historyIdx = historyList.findIndex((history) => history.id === item.id);

    if (historyIdx !== -1) {
      historyList[historyIdx] = { ...historyList[historyIdx], ...item };
    }
    return historyList[historyIdx];
  }

  public delete(item: { id: string }): History | undefined {
    const historyIdx = historyList.findIndex((history) => history.id === item.id);

    if (historyIdx !== -1) {
      const deletedHistory = historyList[historyIdx];
      historyList.splice(historyIdx, 1);
      return deletedHistory;
    }
  }
}