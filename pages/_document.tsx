import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap" rel="stylesheet"/>
          <link href="https://unpkg.com/pattern.css" rel="stylesheet"/>
        </Head>

        <div>
          <Main />
          <NextScript />
        </div>
      </Html>
    )
  }
}
