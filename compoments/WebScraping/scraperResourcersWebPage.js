const puppeteer = require("puppeteer-core");
const path = require("path");
const executablePath = path.resolve("./chrome/chrome.exe");

const launchBrowser = async () => {
  const browser = await puppeteer.launch({
    executablePath,
    timeout: 60000,
    headless: true,
  });
  return browser;
};

const scrapePage = async (pageUrl) => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.goto(pageUrl);
  await page.waitForSelector("body > section:nth-child(4) > div", {
    timeout: 5000,
  });

  // Ahora puedes interactuar con los elementos dentro de div.allfilters
  const filterOptions = await page.evaluate(() => {
    const allFiltersDiv = document.querySelector("div.allfilters");

    // Obtener las opciones de los selectores
    const category = Array.from(
      allFiltersDiv.querySelectorAll('select[name="categoria"] option')
    ).map((option) => option.value);

    const genre = Array.from(
      allFiltersDiv.querySelectorAll('select[name="genero"] option')
    ).map((option) => option.value);

    const year = Array.from(
      allFiltersDiv.querySelectorAll('select[name="fecha"] option')
    ).map((option) => option.value);

    const letter = Array.from(
      allFiltersDiv.querySelectorAll('select[name="letra"] option')
    ).map((option) => option.value);

    return {
      category,
      genre,
      year,
      letter,
    };
  });

  const maxPage = await page.evaluate(() => {
    const paginationItems = document.querySelectorAll(".pagination .page-item");
    let maxPage = 0;

    paginationItems.forEach((item) => {
      const pageNumber = parseInt(item.innerText);
      if (!isNaN(pageNumber) && pageNumber > maxPage) {
        maxPage = pageNumber;
      }
    });

    return { maxPage };
  });

  // Cierra el navegador después de obtener los datos
  await browser.close();

  return { filterOptions, maxPage };
};

const scraperResourcersWebPage = async (webSiteLibrary) => {
  let retries = 0;
  let filterOptions, maxPage; // Declarar las variables aquí

  let maxRetries = 5;
  while (retries < maxRetries) {
    try {
      // Asignar los valores dentro del bloque try
      ({ filterOptions, maxPage } = await scrapePage(webSiteLibrary));
      break; // Si no hay errores, salir del bucle while
    } catch (error) {
      console.error(`Error en el intento ${retries + 1}:`, error);
      retries++;
    }
  }

  if (!filterOptions) {
    throw new Error(
      `No se pudo obtener la información después de ${maxRetries} intentos.`
    );
  }

  return { filterOptions, maxPage };
};

export { scraperResourcersWebPage };
