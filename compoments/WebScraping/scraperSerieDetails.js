const puppeteer = require("puppeteer-core");
const path = require("path");
const executablePath = path.resolve("./chrome/chrome.exe");

const scraperSerieDetails = async (urlSerie) => {
  const maxRetries = 5; // Número máximo de reintentos
  let dataSerie;
  let retries = 0;

  while (!dataSerie && retries < maxRetries) {
    try {
      const browser = await puppeteer.launch({
        executablePath,
        timeout: 60000,
        headless: true, // Puedes configurar esto según tus necesidades
      });
      const page = await browser.newPage();
      // Aumentar el tiempo de espera a 60 segundos (60000 ms)
      await page.goto(urlSerie, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      await page.waitForSelector(".chapterdetails");

      dataSerie = await page.evaluate((urlSerie) => {
        const element = document.querySelector(".chapterdetails");
        const title = element.querySelector("h1").textContent.trim();

        const genders = Array.from(
          document.querySelectorAll(".breadcrumb-item a")
        ).map((genero) => genero.textContent.trim());

        const estrenoElement = document.querySelector(
          "body > section:nth-child(5) > div > div > div.acontain > div.row > div > div:nth-child(3) > nav:nth-child(2) > ol > li.breadcrumb-item"
        );
        const date = estrenoElement.textContent.trim();
        const descripcionElement = document.querySelector(
          "body > section:nth-child(5) > div > div > div.acontain > div.row > div > div:nth-child(3) > p.textShort"
        );
        const aElement = descripcionElement.querySelector("a");
        aElement.remove();
        const description = descripcionElement.textContent.trim();
        const textoCompletoElement = document.querySelector(
          "body > section:nth-child(5) > div > div > div.acontain > div.row > div > div:nth-child(3) > p.textComplete"
        );
        const aaElement = textoCompletoElement.querySelector("a");
        aaElement.remove();
        const descriptionComplete = textoCompletoElement.textContent.trim();
        const imagenElement = document.querySelector(
          "body > section:nth-child(5) > div > div > div.herobg > img"
        );
        const imageSrc = imagenElement.getAttribute("src");
        const status = document.querySelector("#btninfo").textContent;
        const spans = document.querySelectorAll(".pagesdiv.dor span.options");
        const spansText = Array.from(spans).map((span) => span.textContent);

        return {
          title,
          urlSerie,
          genders,
          date,
          description,
          descriptionComplete,
          imageSrc,
          status,
          spansText,
        };
      }, urlSerie);

      const listaElementos = await page.$$(".col-item");
      const chapters = [];

      for (const elemento of listaElementos) {
        const url = await elemento.$eval("a", (node) => node.href);
        const title = await elemento.$eval(".animetitles", (node) =>
          node.textContent.trim()
        );
        chapters.push({ url, title });
      }
      dataSerie.chapters = chapters;

      await browser.close();
    } catch (error) {
      console.error("Error en el scraping del enlace:", error);
      retries++;
    }
  }

  if (!dataSerie) {
    throw new Error("Error en el scraping del enlace");
  }

  return dataSerie;
};

export { scraperSerieDetails };
