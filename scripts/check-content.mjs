import { readFileSync } from 'node:fs'
import { validateContent } from '../src/edit/validateContent.mjs'

const file = 'content.yaml'
const source = readFileSync(file, 'utf8')
const { issues, document } = validateContent(source)
const lineAt = (path) => {
  for (let depth = path.length; depth > 0; depth--) {
    const node = document.getIn(path.slice(0, depth), true)
    if (node?.range) return source.slice(0, node.range[0]).split('\n').length
  }
  return 1
}
if (issues.length) {
  console.error(issues.map(({ path, message }) => `${file} の${lineAt(path)}行目：${message}`).join('\n'))
  process.exit(1)
}
console.log('content.yaml の確認に成功しました')
