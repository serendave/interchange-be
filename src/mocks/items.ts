import { Item } from 'src/items/entities/item.entity';

export default [
  {
    id: '2d725f04-2898-4419-99e9-f854185e9047',
    name: 'item1',
    category: {
      id: 'd947108a-ff79-4eb1-a7a5-e392cbb19537',
      name: 'Clothes',
    },
    user: null,
    description: 'Description',
    dateCreated: '2022-05-28T07:14:18.802Z',
    active: true,
    photos: [
      'items-e59cb39d-133c-4e89-ab8c-3b653a5855ea.png',
      'items-ba827c57-5f8d-488d-9ac6-6ddc48e7f4fd.png',
    ],
  },
  {
    id: 'a4edf85c-8505-410b-8ab8-484e866fc404',
    name: 'item3',
    category: {
      id: '5c604b2f-4699-4edc-b223-e0628d4262dc',
      name: 'Garderobe',
    },
    user: null,
    description: 'Description',
    dateCreated: '2022-05-28T07:12:29.330Z',
    active: true,
    photos: [
      'items-088f704b-b617-433b-99e4-1bff43836f56.png',
      'items-c3638ef8-aa01-4d29-b66b-a4dbe41c6a7e.png',
    ],
  },
  {
    id: 'a6cfc1ec-3059-4deb-97ca-3a4e49fbd102',
    name: 'item2',
    category: {
      id: 'a82ff505-e627-4a23-ab5f-d76480f8f005',
      name: 'Gadgets',
    },
    user: null,
    description: 'Description',
    dateCreated: '2022-05-28T06:58:20.809Z',
    active: true,
    photos: [
      'items-205a7b7c-2264-4118-b989-601c605540ee.png',
      'items-c8ef97f3-5936-4f04-8cf5-19bd0cf22ae3.png',
    ],
  },
  {
    id: 'ce94fd82-cd6a-4675-8bcd-f909dc799ec0',
    name: 'Test item',
    category: {
      id: 'd947108a-ff79-4eb1-a7a5-e392cbb19537',
      name: 'Clothes',
    },
    user: null,
    description: 'Test description',
    dateCreated: '2022-06-19T07:16:51.240Z',
    active: true,
    photos: [
      'items-79945011-8b60-465e-827a-f37753622f50.png',
      'items-3950aa54-5b80-4651-ab3e-d55ea994ed3c.png',
    ],
  },
] as unknown as Item[];
