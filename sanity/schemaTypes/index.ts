import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {dropType} from './drop'
import {sceneType} from './scene'
import {tagType} from './tag'
import {manifestType} from './manifest'
import {productType} from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    dropType,
    sceneType,
    tagType,
    manifestType,
    productType,
  ],
}
