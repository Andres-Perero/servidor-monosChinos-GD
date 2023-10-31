const puppeteer = require("puppeteer-core");
const path = require("path");
const executablePath = path.resolve("./chrome/chrome.exe");

const scraperPage = async (webSiteLibrary, pageNumber) => {
  const browser = await puppeteer.launch({
    executablePath,
    timeout: 60000,
    headless: true, // Puedes configurar esto según tus necesidades
  });
  const page = await browser.newPage();

  const url = `${webSiteLibrary}?p=${pageNumber}`;

  // Aumentar el tiempo de espera a 60 segundos (60000 ms)
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  //await page.goto(url);
  await page.waitForSelector(".heromain"); // Esperar a que los elementos estén disponibles

  const items = await page.evaluate(async () => {
    const seriesElements = document.querySelectorAll(".row > .col-md-4"); // Selecciona los elementos que contienen la información de cada serie
    const seriesData = [];

    seriesElements.forEach((element) => {
      const title = element.querySelector(".seristitles").textContent.trim();
      const year = element
        .querySelector(".seriesinfo")
        .textContent.trim()
        .split(" · ")[1];
      const type = element
        .querySelector(".seriesinfo")
        .textContent.trim()
        .split(" · ")[0];
      const image = element.querySelector(".lozad").getAttribute("data-src");
      const urlSerie = element.querySelector("a").getAttribute("href"); // Obtener la URL del enlace

      
      seriesData.push({
        title,
        type,
        year,
        urlSerie,
        image,
      });
    });

    return seriesData;
  });

  await browser.close();
  return items;
};

const scraperSeries = async (webSiteLibrary, totalPages) => {
  const allItems = [];
  const maxRetries = 5; // Número máximo de reintentos

  for (let pageNumber = totalPages; pageNumber >= 1; pageNumber--) {
    //for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    console.log("pagina: " + pageNumber + "/" + totalPages);

    let itemsOnPage;
    let retries = 0;

    while (!itemsOnPage && retries < maxRetries) {
      try {
        itemsOnPage = await scraperPage(webSiteLibrary, pageNumber);
      } catch (error) {
        console.error("Error en el scraping de la página:", error);
        retries++;
      }
    }

    if (itemsOnPage) {
      allItems.push(...itemsOnPage);
    }
  }

  return allItems;
};

export { scraperSeries };
