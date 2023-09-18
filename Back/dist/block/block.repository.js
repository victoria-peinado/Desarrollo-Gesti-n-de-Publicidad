import { Block } from './block.entity.js';
const blocks = [
    new Block('08:30:00', 11),
];
export class BlockRepository {
    findAll() {
        return blocks;
    }
    findOne(item) {
        return blocks.find((character) => character.id === item.id);
    }
    add(item) {
        blocks.push(item);
        return item;
    }
    update(item) {
        const characterIdx = blocks.findIndex((character) => character.id === item.id);
        if (characterIdx !== -1) {
            blocks[characterIdx] = { ...blocks[characterIdx], ...item };
        }
        return blocks[characterIdx];
    }
    delete(item) {
        const characterIdx = blocks.findIndex((character) => character.id === item.id);
        if (characterIdx !== -1) {
            const deletedBlocks = blocks[characterIdx];
            blocks.splice(characterIdx, 1);
            return deletedBlocks;
        }
    }
}
//# sourceMappingURL=block.repository.js.map