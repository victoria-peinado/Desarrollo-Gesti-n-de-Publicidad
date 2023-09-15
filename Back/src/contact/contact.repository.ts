import { Repository } from '../shared/repository.js'
import { Contact } from './contact.entity.js'

const contacts = [
  new Contact(
    'Darth Vader',
    'Sith',
    43769477,
    ['4557789', 'darth@gmail.com'],
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class ContactRepository implements Repository<Contact> {
  public findAll(): Contact[] | undefined {
    return contacts
  }

  public findOne(item: { id: string }): Contact | undefined {
    return contacts.find((character) => character.id === item.id)
  }

  public add(item: Contact): Contact | undefined {
    contacts.push(item)
    return item
  }

  public update(item: Contact): Contact | undefined {
    const characterIdx = contacts.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      contacts[characterIdx] = { ...contacts[characterIdx], ...item }
    }
    return contacts[characterIdx]
  }

  public delete(item: { id: string }): Contact | undefined {
    const characterIdx = contacts.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      const deletedContact= contacts[characterIdx]
      contacts.splice(characterIdx, 1)
      return deletedContact
    }
  }
}
