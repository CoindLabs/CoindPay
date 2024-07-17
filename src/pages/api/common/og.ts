import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'
import prisma from '@/lib/prisma'
import config from '@/config'

const { title, logo } = config

export default async function account(req: NextApiRequest, res: NextApiResponse) {
  const { uuid } = req.query

  if (!uuid) {
    return res.status(400).json({ ok: false, message: 'uuid is required ˙◠˙' })
  }

  try {
    let user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        id: uuid,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'user not found ˙◠˙' })
    }

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const htmlContent = `
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <article class="bg-white text-black p-16">
        <header class='flex'>
          <h1 class='text-4xl font-semibold>${uuid}</h1>
          <img src=${logo.dark} class='size-32 rounded-xl' />
        </header>
        <footer class='text-right'>
         ${title}
        </footer>
      </article>
    </body>
    </html>
  `

    await page.setContent(htmlContent)
    await page.setViewport({ width: 1200, height: 630 })

    const imageBuffer = await page.screenshot({ type: 'png' })

    await browser.close()

    res.setHeader('Content-Type', 'image/png')
    res.send(imageBuffer)
  } catch (error) {
    res.status(500).json({ ok: false, message: 'generate image errorr˙◠˙' })
  }
}
