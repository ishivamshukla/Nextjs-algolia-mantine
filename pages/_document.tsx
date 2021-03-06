import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { SheetsRegistry, JssProvider, createGenerateId } from "react-jss";

if (typeof window === "undefined") {
    const originalWarn = console.warn;
    console.warn = (...args: any) => {
      if (
        args[0] !==
        'Warning: [JSS] Rule is not linked. Missing sheet option "link: true".'
      ) {
        originalWarn(...args);
      }
    };
  }
  

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const registry = new SheetsRegistry();
    const generateId = createGenerateId({ minify: true });
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name
        enhanceApp: (App) => (props) =>
          (
            <JssProvider registry={registry} generateId={generateId}>
              <App {...props} />
            </JssProvider>
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style id="mantine-ssr-styles">{registry.toString()}</style>
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="link to favicon" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}