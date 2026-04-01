import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pdfPath = resolve(__dirname, '../../textbook.pdf')
const outputPath = resolve(__dirname, '../../textbook.txt')
const cmapsDir = resolve(__dirname, 'node_modules/pdfjs-dist/cmaps/')

const buffer = await readFile(pdfPath)
const doc = await getDocument({
  data: new Uint8Array(buffer),
  cMapUrl: cmapsDir + '/',
  cMapPacked: true,
  useWorkerFetch: false,
  disableAutoFetch: true,
}).promise

const totalPages = doc.numPages
console.log(`ページ数: ${totalPages}`)

const texts = []
for (let i = 1; i <= totalPages; i++) {
  const page = await doc.getPage(i)
  const content = await page.getTextContent()
  const pageText = content.items.map(item => item.str).join('')
  texts.push(pageText)
  if (i % 50 === 0) console.log(`${i}/${totalPages} ページ処理済み`)
}

const fullText = texts.join('\n\n')

console.log(`文字数: ${fullText.length}`)

await writeFile(outputPath, fullText, 'utf-8')
console.log(`出力先: ${outputPath}`)
