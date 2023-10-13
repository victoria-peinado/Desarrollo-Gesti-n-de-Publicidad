import { History } from './history.entity.js';
const historyList = [
    new History('2023-10-08', 11, 'a02b91bc-3769-4221-beb1-d7a3aeba7dad', 'a02b91bc-3769-4221-beb1-d7a3aeba7dad'),
];
export class HistoryRepository {
    findAll() {
        return historyList;
    }
    findOne(item) {
        return historyList.find((history) => history.id === item.id);
    }
    add(item) {
        historyList.push(item);
        return item;
    }
    update(item) {
        const historyIdx = historyList.findIndex((history) => history.id === item.id);
        if (historyIdx !== -1) {
            historyList[historyIdx] = { ...historyList[historyIdx], ...item };
        }
        return historyList[historyIdx];
    }
    delete(item) {
        const historyIdx = historyList.findIndex((history) => history.id === item.id);
        if (historyIdx !== -1) {
            const deletedHistory = historyList[historyIdx];
            historyList.splice(historyIdx, 1);
            return deletedHistory;
        }
    }
}
//# sourceMappingURL=history.repository.js.map