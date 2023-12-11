import { Repository } from '../shared/repository.js'
import { Block } from './block.entity.js'

const blocks = [
  new Block(
    '08:30:00',
    11,
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
   new Block(
    '09:30:00',
    13,
    'a02b91bc-3768-4221-beb2-d7a3aeba7dad' 
  ),
]

export class BlockRepository implements Repository<Block> {
  public findAll(): Block[] | undefined {
    return blocks
  }

  public findOne(item: { id: string }): Block | undefined {
    return blocks.find((character) => character.id === item.id)
  }

  public add(item: Block): Block | undefined {
    blocks.push(item)
    return item
  }

  public update(item: Block): Block | undefined {
    const characterIdx = blocks.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      blocks[characterIdx] = { ...blocks[characterIdx], ...item }
    }
    return blocks[characterIdx]
  }

  public delete(item: { id: string }): Block | undefined {
    const characterIdx = blocks.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      const deletedBlocks = blocks[characterIdx]
      blocks.splice(characterIdx, 1)
      return deletedBlocks
    }
  }
}
